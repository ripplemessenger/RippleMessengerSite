import prisma from '@/lib/prisma'

export default async function getBulletinJsonData(options = {}) {
  const { hash } = options
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
    console.error(error)
    return { bulletin: null }
  }
}