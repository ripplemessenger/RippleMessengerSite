import prisma from '@/lib/prisma'

export default async function getBulletinJsonData(options = {}) {
  const { hash, page } = options
  try {
    let bulletin = await prisma.Bulletin.findFirst({
      where: {
        hash: hash,
      },
      select: {
        json: true
      }
    })
    return { bulletin: bulletin }
  } catch (error) {
    console.log(error)
    return { bulletin: null }
  }
}