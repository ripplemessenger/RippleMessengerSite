import { NextResponse } from 'next/server'
import { existsSync, statSync, createReadStream } from 'fs'
import path from 'path'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(_request, { params }) {
  const address = params.address

  // Validate: address must start with 'r' followed by alphanumeric chars
  if (typeof address !== 'string' || !/^r[0-9a-zA-Z]+$/.test(address)) {
    return new NextResponse('Invalid address', { status: 400, headers: CORS_HEADERS })
  }

  const avatarDirRaw = process.env.AVATAR_DIR
  if (!avatarDirRaw) {
    return new NextResponse('Avatar service not configured (AVATAR_DIR missing)', {
      status: 500,
      headers: CORS_HEADERS,
    })
  }

  // Resolve to absolute path
  const avatarDir = path.resolve(avatarDirRaw)

  // Build the on-disk path: AVATAR_DIR/{address[1:4]}/{address[4:7]}/{address}.png
  const dir1 = address.substring(1, 4)
  const dir2 = address.substring(4, 7)
  const filePath = path.join(avatarDir, dir1, dir2, `${address}.png`)

  // Containment check
  if (!filePath.startsWith(avatarDir + path.sep)) {
    return new NextResponse('Not found', { status: 404, headers: CORS_HEADERS })
  }

  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404, headers: CORS_HEADERS })
  }

  let stats
  try {
    stats = statSync(filePath)
  } catch {
    return new NextResponse('Not found', { status: 404, headers: CORS_HEADERS })
  }

  return new NextResponse(createReadStream(filePath), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': stats.size.toString(),
      'Cache-Control': 'public, max-age=86400',
      ...CORS_HEADERS,
    },
  })
}
