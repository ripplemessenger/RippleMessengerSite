
import Account from "@/components/Account"
import Avatar from "@/components/Avatar"
import Timestamp from "@/components/Timestamp"
import LinkBulletin from "@/components/LinkBulletin"
import getHomeData from "@/lib/data/home"

export default async function Page() {
  const { bulletins, bulletin_size, account_size } = await getHomeData()

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
        <span>帖子总数：{bulletin_size}</span>
        <span>账户总数：{account_size}</span>
      </div>
      <h2 className="text-lg font-bold">十大热门帖子</h2>
      <ul className="space-y-2">
        {bulletins.map((bulletin) => (
          <li key={bulletin.hash} className="py-2">
            <div className="flex flex-row gap-3">
              <div className="flex-none">
                <Avatar str={bulletin.address} size={50} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div>
                  <Account address={bulletin.address} />
                  <LinkBulletin hash={bulletin.hash} str={`#${bulletin.sequence}`} />
                  <Timestamp timestamp={bulletin.signed_at} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 break-words">
                  {bulletin.content}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 