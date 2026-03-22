import prisma from '@/lib/prisma'
import { PageSize, Json2Str } from '@/lib/Util'

export default async function getBulletinData(options = {}) {
  const { hash, page } = options
  try {
    let bulletin = await prisma.Bulletin.findFirst({
      where: {
        hash: hash,
      }
    })
    if (bulletin !== null) {
      bulletin = Json2Str(bulletin)
      bulletin = JSON.parse(bulletin)

      let next = await prisma.Bulletin.findFirst({
        where: {
          address: bulletin.address,
          sequence: bulletin.sequence + 1
        },
        select: {
          hash: true
        }
      })

      let replys = await prisma.Reply.findMany({
        where: {
          post_hash: bulletin.hash
        },
        skip: (page - 1) * PageSize,
        take: PageSize,
        orderBy: {
          signed_at: 'asc'
        }
      })
      let reply_bulletins_hash = replys.map((reply) => (reply.reply_hash))
      replys = await prisma.Bulletin.findMany({
        where: {
          hash: { in: reply_bulletins_hash }
        },
        select: {
          sequence: true,
          address: true,
          hash: true,
          signed_at: true,
          content: true
        }
      })
      replys = replys.map(reply => ({
        ...reply,
        signed_at: Number(reply.signed_at)
      }))

      let reply_size = await prisma.Reply.count({
        where: {
          post_hash: bulletin.hash
        }
      })
      return { bulletin: bulletin, next: next, replys: replys, reply_size: reply_size }
    } else {
      return { bulletin: bulletin }
    }
  } catch (error) {
    console.log(error)
    return { bulletin: null }
  }
}