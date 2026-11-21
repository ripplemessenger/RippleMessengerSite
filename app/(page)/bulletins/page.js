import Pagination from "@/components/Pagination"
import Account from "@/components/Account"
import LinkBulletin from "@/components/LinkBulletin"
import Avatar from "@/components/Avatar"
import Timestamp from "@/components/Timestamp"
import getBulletinsData from "@/lib/data/bulletins"
import getMediaFiles from "@/lib/data/media"

export default async function Page(props) {
  let page_cursor = 1
  if (props.searchParams.page && props.searchParams.page > 1) {
    page_cursor = props.searchParams.page
  }
  const { bulletins, bulletin_size } = await getBulletinsData({ page: page_cursor })

  const mediaMap = await getMediaFiles(bulletins.map((b) => b.hash))

  return (
    <div className="space-y-2">
      <ul className="space-y-1">
        {bulletins.map((bulletin) => {
          const media = mediaMap[bulletin.hash] || { image: null, video: null, audio: null }
          return (
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
                  {(media.image || media.video || media.audio) && (
                    <div className="flex gap-1">
                      {media.image && (
                        <span className="inline-flex items-center text-xs bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5">
                          🖼 图片
                        </span>
                      )}
                      {media.video && (
                        <span className="inline-flex items-center text-xs bg-black/70 text-white rounded px-1.5 py-0.5">
                          ▶ 视频
                        </span>
                      )}
                      {media.audio && (
                        <span className="inline-flex items-center text-xs bg-black/70 text-white rounded px-1.5 py-0.5">
                          ♪ 音频
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <Pagination url={`/bulletins`} page_size={bulletin_size} page_cursor={page_cursor} />
    </div>
  )
}