import { NextResponse } from 'next/server'
import { createReadStream, existsSync, statSync } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'

// Hand-rolled MIME map — no new dependency (zero-protocol-change constraint).
const MIME = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  m4v: 'video/x-m4v',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/ogg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  flac: 'audio/flac',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  pdf: 'application/pdf',
  txt: 'text/plain; charset=utf-8',
  json: 'application/json',
  csv: 'text/csv',
  zip: 'application/zip',
}

// Only these extensions are ever served inline (image/video/audio). Everything
// else is forced to attachment to avoid the browser executing arbitrary content.
// NOTE: svg is deliberately EXCLUDED — SVG can embed <script>, and serving it
// inline (image/svg+xml) from the site origin is an XSS vector via <object>/
// <embed>. It is still downloadable via ?download=1.
const INLINE_EXT = new Set([
  'mp4', 'webm', 'mov', 'm4v',
  'mp3', 'ogg', 'oga', 'opus', 'wav', 'm4a', 'aac', 'flac',
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp',
])

// The Client (Tauri WebView) downloads bulletin files from this endpoint over
// cross-origin fetch, so it must be readable from another origin. The file is
// content-addressed (128-bit hash, not enumerable) and public, so `*` is safe.
const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*' }

function notFound() {
  return new NextResponse('Not Found', { status: 404, headers: CORS_HEADERS })
}

/**
 * Build a Content-Disposition header value. Header values must be ByteString,
 * so non-ASCII filenames (e.g. Chinese) go through RFC 5987 `filename*` with
 * a sanitized ASCII fallback in `filename`.
 */
function buildDisposition(name, ext, inline) {
  const raw = `${name}.${ext}`
  const ascii = raw.replace(/[^!-~]/g, '_') || 'file'
  const encoded = encodeURIComponent(raw)
  return inline
    ? `inline; filename="${ascii}"; filename*=UTF-8''${encoded}`
    : `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`
}

/**
 * Look up the File row and resolve its display name + extension from the
 * referencing bulletin's JSON. Returns null if the file is unknown or not
 * fully saved.
 */
async function resolveFileMeta(hash) {
  const file = await prisma.File.findUnique({
    where: { hash },
    include: { bulletins: { take: 1, select: { json: true } } },
  })
  if (!file || !file.is_saved) return null

  let name = hash
  let ext = ''
  if (file.bulletins.length > 0) {
    try {
      const json = JSON.parse(file.bulletins[0].json)
      const entry = (json.File || []).find((f) => f.Hash === hash)
      if (entry) {
        name = entry.Name || hash
        ext = String(entry.Ext || '').toLowerCase()
      }
    } catch {
      // JSON parse failure → fall back to hash + octet-stream
    }
  }
  return { name, ext }
}

/**
 * Build a 200/206 streaming response for a file, honoring the Range header.
 */
function buildFileResponse(filePath, totalSize, mime, disposition, rangeHeader) {
  const baseHeaders = {
    'Content-Type': mime,
    'Accept-Ranges': 'bytes',
    'Content-Disposition': disposition,
    // Prevent MIME sniffing of user-uploaded content (e.g. a .jpg that is
    // really an HTML/SVG payload).
    'X-Content-Type-Options': 'nosniff',
    // Allow the Client (Tauri WebView) to read the body cross-origin.
    ...CORS_HEADERS,
  }

  if (!rangeHeader) {
    return new NextResponse(createReadStream(filePath), {
      status: 200,
      headers: { ...baseHeaders, 'Content-Length': String(totalSize) },
    })
  }

  const match = rangeHeader.match(/bytes=(\d*)-(\d*)/)
  if (!match) {
    return new NextResponse(createReadStream(filePath), {
      status: 200,
      headers: { ...baseHeaders, 'Content-Length': String(totalSize) },
    })
  }

  let start
  let end
  if (match[1] === '' && match[2] !== '') {
    // Suffix range: last N bytes
    const suffixLength = parseInt(match[2], 10)
    start = Math.max(0, totalSize - suffixLength)
    end = totalSize - 1
  } else {
    start = match[1] ? parseInt(match[1], 10) : 0
    end = match[2] ? parseInt(match[2], 10) : totalSize - 1
  }

  if (start >= totalSize || start < 0) {
    return new NextResponse('Range not satisfiable', {
      status: 416,
      headers: { 'Content-Range': `bytes */${totalSize}`, ...CORS_HEADERS },
    })
  }
  end = Math.min(end, totalSize - 1)

  return new NextResponse(createReadStream(filePath, { start, end }), {
    status: 206,
    headers: {
      ...baseHeaders,
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Content-Length': String(end - start + 1),
    },
  })
}

/**
 * GET /file/[hash]
 *
 * Streams a bulletin attachment stored on the relay server's disk.
 * - Strict 32-hex validation (rejects path traversal / junk).
 * - 404 unless the File row exists AND is_saved (fully downloaded).
 * - Range support so <video> can seek.
 * - ?download=1 → Content-Disposition: attachment, otherwise inline.
 */
export async function GET(request, { params }) {
  const hash = params.hash

  // 1. Strict 32-char hex — FileHash is QuarterSHA512 (128 bits, 32 uppercase
  //    hex chars, see MessengerUtil.FileHash). The hash is also the filename,
  //    so this bounds the path.
  if (typeof hash !== 'string' || !/^[0-9a-fA-F]{32}$/.test(hash)) {
    return notFound()
  }

  // 2. File must exist in the DB and be fully saved.
  const meta = await resolveFileMeta(hash)
  if (!meta) {
    return notFound()
  }

  const fileDirRaw = process.env.FILE_DIR
  if (!fileDirRaw) {
    return new NextResponse('File service not configured (FILE_DIR missing)', {
      status: 500,
      headers: CORS_HEADERS,
    })
  }
  // Resolve to absolute so the containment check below works even if .env
  // holds a relative path.
  const fileDir = path.resolve(fileDirRaw)

  // 3. Build the on-disk path: FILE_DIR/{hash[0:3]}/{hash[3:6]}/{hash}
  //    hash is already constrained to [0-9a-fA-F]{32} above, so it cannot
  //    contain path separators or ".." — but verify containment regardless.
  const filePath = path.join(fileDir, hash.slice(0, 3), hash.slice(3, 6), hash)
  if (!filePath.startsWith(fileDir + path.sep)) {
    return notFound()
  }
  if (!existsSync(filePath)) {
    return notFound()
  }

  let stats
  try {
    stats = statSync(filePath)
  } catch {
    return notFound()
  }

  const mime = MIME[meta.ext] || 'application/octet-stream'
  const download = request.nextUrl.searchParams.get('download') === '1'
  const inlineAllowed = INLINE_EXT.has(meta.ext)
  const disposition = buildDisposition(meta.name, meta.ext, !download && inlineAllowed)

  // 4. Stream with Range support.
  return buildFileResponse(filePath, stats.size, mime, disposition, request.headers.get('range'))
}
