import Avatar from "@/components/Avatar"
import Account from "@/components/Account"
import Pagination from "@/components/Pagination"
import { PageSize } from "@/lib/Util"
import getAccountsData from "@/lib/data/accounts"

async function Accounts(props) {
  let page_cursor = 1
  if (props.searchParams.page && props.searchParams.page > 1) {
    page_cursor = props.searchParams.page
  }
  const { accounts, account_size } = await getAccountsData({ page: page_cursor })

  return (
    <div>
      <ul>
        {accounts.map((account) => (
          <li key={account.address} className="py-1">
            <div className="flex flex-row">
              <div className="flex-none">
                <Avatar str={account.address} size={50} />
              </div>
              <div className="flex flex-col">
                <div>
                  <Account address={account.address} />
                </div>
                <div>
                  <span>#{account._count.hash}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination url={`/accounts`} page_size={account_size} page_cursor={page_cursor}></Pagination>
    </div>
  )
}

export default Accounts