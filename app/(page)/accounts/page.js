import Avatar from "@/components/Avatar"
import Account from "@/components/Account"
import Pagination from "@/components/Pagination"
import getAccountsData from "@/lib/data/accounts"

export default async function Page(props) {
  let page_cursor = 1
  if (props.searchParams.page && props.searchParams.page > 1) {
    page_cursor = props.searchParams.page
  }
  const { accounts, account_size } = await getAccountsData({ page: page_cursor })

  return (
    <div className="space-y-2">
      <ul className="space-y-1">
        {accounts.map((account) => (
          <li key={account.address} className="py-2">
            <div className="flex flex-row gap-3 items-center">
              <div className="flex-none">
                <Avatar str={account.address} size={50} />
              </div>
              <div className="flex flex-col min-w-0">
                <Account address={account.address} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{account._count.hash} 篇帖子</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination url={`/accounts`} page_size={account_size} page_cursor={page_cursor} />
    </div>
  )
}