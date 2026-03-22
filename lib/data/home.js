import { Json2Str, ContentHeadSize } from '@/lib/Util'
import prisma from '@/lib/prisma'

export default async function getHomeData() {
  try {
    //bulletin size
    let bulletin_size = await prisma.Bulletin.count()
    //account size
    let accounts = await prisma.Bulletin.groupBy({
      by: ['address'],
      _count: {
        hash: true,
      }
    })
    const account_size = accounts.length
    //hot bulletin
    let hot_bulletins_hash = await prisma.Reply.groupBy({
      by: ['post_hash'],
      _count: {
        reply_hash: true,
      }
    })
    hot_bulletins_hash.sort(function (a, b) { return b._count.reply_hash - a._count.reply_hash })
    hot_bulletins_hash = hot_bulletins_hash.map((bulletin) => (bulletin.post_hash)).slice(0, 10)
    let bulletins = await prisma.Bulletin.findMany({
      where: {
        hash: { in: hot_bulletins_hash }
      },
      select: {
        sequence: true,
        address: true,
        hash: true,
        signed_at: true,
        content: true
      }
    })
    bulletins = Json2Str(bulletins)
    bulletins = JSON.parse(bulletins)
    bulletins = bulletins.map((bulletin) => ({
      address: bulletin.address,
      sequence: bulletin.sequence,
      hash: bulletin.hash,
      signed_at: bulletin.signed_at,
      content: bulletin.content.slice(0, ContentHeadSize).trim()
    }))
    bulletins.sort(function (a, b) { return hot_bulletins_hash.indexOf(a.hash) - hot_bulletins_hash.indexOf(b.hash) })
    return {
      bulletins,
      bulletin_size,
      account_size,
    }
  } catch (error) {
    console.log(error)
    return {
      bulletins: [],
      bulletin_size: 0,
      account_size: 0,
    }
  }
}