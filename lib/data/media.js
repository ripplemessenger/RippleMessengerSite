import prisma from '@/lib/prisma'

const IMG_EXT = /^(jpg|jpeg|png|gif|webp|svg|bmp)$/i
const VID_EXT = /^(mp4|webm|mov|m4v)$/i
const AUD_EXT = /^(mp3|ogg|oga|opus|wav|m4a|aac|flac)$/i

/**
 * For a set of bulletin hashes, find the first image, first video, and first
 * audio attachment of each (via the Bulletin↔File relation). Returns a map:
 *   { [bulletinHash]: { image: fileHash|null, video: fileHash|null, audio: fileHash|null } }
 *
 * The File table does not store the extension — it lives in the bulletin's
 * JSON — so we parse the referencing bulletin to classify each file.
 */
export default async function getMediaFiles(bulletinHashes) {
  if (!bulletinHashes || bulletinHashes.length === 0) return {}

  const files = await prisma.File.findMany({
    where: { bulletins: { some: { hash: { in: bulletinHashes } } } },
    include: { bulletins: { select: { hash: true, json: true } } },
  })

  const map = {}
  for (const f of files) {
    for (const b of f.bulletins) {
      if (!map[b.hash]) map[b.hash] = { image: null, video: null, audio: null }

      let ext = ''
      try {
        const json = JSON.parse(b.json)
        const entry = (json.File || []).find((x) => x.Hash === f.hash)
        if (entry) ext = String(entry.Ext || '').toLowerCase()
      } catch {
        // unparseable → treat as unknown (no badge)
      }

      if (IMG_EXT.test(ext) && !map[b.hash].image) {
        map[b.hash].image = f.hash
      } else if (VID_EXT.test(ext) && !map[b.hash].video) {
        map[b.hash].video = f.hash
      } else if (AUD_EXT.test(ext) && !map[b.hash].audio) {
        map[b.hash].audio = f.hash
      }
    }
  }
  return map
}
