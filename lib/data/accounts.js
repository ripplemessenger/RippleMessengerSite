
import { PageSize, Json2Str } from '@/lib/Util'
import prisma from '@/lib/prisma';

export default async function getAccountsData(options = {}) {
  const { page } = options
  try {
    let accounts = await prisma.Bulletin.groupBy({
      by: ['address'],
      _count: {
        hash: true,
      },
      orderBy: {
        address: 'desc',
      }
    })
    accounts.sort(function (a, b) { return b._count.hash - a._count.hash })
    let account_size = accounts.length
    let begin_cursor = (page - 1) * PageSize
    accounts = accounts.slice(begin_cursor, begin_cursor + PageSize)
    return { accounts: accounts, account_size: account_size }
  } catch (error) {
    console.log(error)
    return { accounts: [], account_size: 0 }
  }
}