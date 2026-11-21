
import Pagination from "@/components/Pagination"
import Timestamp from "@/components/Timestamp"
import Account from "@/components/Account"
import LinkBulletin from "@/components/LinkBulletin"
import Avatar from "@/components/Avatar"
import getAccountBulletinsData from "@/lib/data/account_bulletins"

export default async function Page(props) {
  let page_cursor = 1
  if (props.searchParams.page && props.searchParams.page > 1) {
    page_cursor = props.searchParams.page
  }
  const { bulletins, bulletin_size } = await getAccountBulletinsData({ address: props.params.address, page: page_cursor })

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-3 items-center">
        <div className="flex-none">
          <Avatar str={props.params.address} size={50} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">公告列表</span>
          <Account address={props.params.address} />
        </div>
      </div>
      <ul className="space-y-2">
        {bulletins.map((bulletin) => (
          <li key={bulletin.hash} className="py-2 border-b border-gray-300 dark:border-gray-600">
            <div className="flex flex-col gap-1">
              <div>
                <LinkBulletin hash={bulletin.hash} str={`#${bulletin.sequence}`} />
                <Timestamp timestamp={bulletin.signed_at} />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 break-words">
                {bulletin.content}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <Pagination url={`/accounts/${props.params.address}/bulletins`} page_size={bulletin_size} page_cursor={page_cursor} />
    </div>
  )
}