import Pagination from "@/components/Pagination"
import Account from "@/components/Account"
import LinkBulletin from "@/components/LinkBulletin"
import Avatar from "@/components/Avatar"
import Timestamp from "@/components/Timestamp"
import getBulletinsData from "@/lib/data/bulletins"

export default async function Page(props) {
  let page_cursor = 1
  if (props.searchParams.page && props.searchParams.page > 1) {
    page_cursor = props.searchParams.page
  }
  const { bulletins, bulletin_size } = await getBulletinsData({ page: page_cursor })

  return (
    <div>
      <ul>
        {bulletins.map((bulletin) => (
          <li key={bulletin.hash} className="py-1">
            <div className="flex flex-row">
              <div className="flex-none">
                <Avatar str={bulletin.address} size={50} />
              </div>
              <div className="flex flex-col">
                <div>
                  <Account address={bulletin.address} />
                  <LinkBulletin hash={bulletin.hash} str={`#${bulletin.sequence}`} />
                  <Timestamp timestamp={bulletin.signed_at} />
                </div>
                <div>
                  <span className="">
                    {bulletin.content}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination url={`/bulletins`} page_size={bulletin_size} page_cursor={page_cursor}></Pagination>
    </div >
  )
}