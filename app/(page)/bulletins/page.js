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

  // First image / first video per bulletin, for thumbnails + badges.
  const mediaMap = await getMediaFiles(bulletins.map((b) => b.hash))

  return (
    <div>
      <ul>
        {bulletins.map((bulletin) => {
          const media = mediaMap[bulletin.hash] || { image: null, video: null, audio: null }
          return (
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
                  <div className="flex flex-row items-start gap-2">
                    <span className="">
                      {bulletin.content}
                    </span>
                    {media.image && (
                      <img
                        src={`/file/${media.image}`}
                        alt=""
                        className="h-12 w-12 object-cover rounded"
                        loading="lazy"
                      />
                    )}
                    {media.video && (
                      <span className="inline-flex items-center gap-0.5 text-xs bg-black/70 text-white rounded px-1.5 py-0.5">
                        ▶ 视频
                      </span>
                    )}
                    {media.audio && (
                      <span className="inline-flex items-center gap-0.5 text-xs bg-black/70 text-white rounded px-1.5 py-0.5">
                        ♪ 音频
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <Pagination url={`/bulletins`} page_size={bulletin_size} page_cursor={page_cursor}></Pagination>
    </div >
  )
}