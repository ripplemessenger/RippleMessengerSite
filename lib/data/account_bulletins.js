import { PageSize, Json2Str, ContentHeadSize } from '@/lib/Util'
import prisma from '@/lib/prisma'

export default async function getAccountBulletinsData(options = {}) {
  const { address, page } = options
  try {
    let bulletins = await prisma.Bulletin.findMany({
      skip: (page - 1) * PageSize,
      take: PageSize,
      where: {
        address: address
      },
      select: {
        sequence: true,
        hash: true,
        signed_at: true,
        content: true
      },
      orderBy: {
        signed_at: 'desc',
      }
    })
    let bulletin_size = await prisma.Bulletin.count({
      where: {
        address: address
      }
    })
    bulletins = Json2Str(bulletins)
    bulletins = JSON.parse(bulletins)
    bulletins = bulletins.map((bulletin) => ({
      sequence: bulletin.sequence,
      hash: bulletin.hash,
      signed_at: bulletin.signed_at,
      content: bulletin.content.slice(0, ContentHeadSize).trim()
    }))
    return { bulletins: bulletins, bulletin_size: bulletin_size }
  } catch (error) {
    console.log(error)
    return { bulletins: [], bulletin_size: 0 }
  }
}