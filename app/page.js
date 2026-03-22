
import Account from "@/components/Account"
import Avatar from "@/components/Avatar"
import Timestamp from "@/components/Timestamp"
import LinkBulletin from "@/components/LinkBulletin"
import getHomeData from "@/lib/data/home"

export default async function Page(props) {
  const { bulletins, bulletin_size, account_size } = await getHomeData()

  return (
    <div>
      <div>帖子总数：{bulletin_size}</div>
      <div>账户总数：{account_size}</div>
      <div>十大热门帖子：</div>
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
    </div >
  )
} 