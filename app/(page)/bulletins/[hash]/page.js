import Link from "next/link"
import { notFound } from 'next/navigation'
import Account from "@/components/Account"
import LinkBulletin from "@/components/LinkBulletin"
import Avatar from "@/components/Avatar"
import Timestamp from "@/components/Timestamp"
import Pagination from "@/components/Pagination"
import getBulletinData from "@/lib/data/bulletin"

export default async function Page(props) {
  let page_cursor = 1
  if (props.searchParams.page && props.searchParams.page > 1) {
    page_cursor = props.searchParams.page
  }
  let { bulletin, next, replys, reply_size } = await getBulletinData({ hash: props.params.hash, page: page_cursor })

  if (!bulletin) {
    notFound()
  }

  let json = JSON.parse(bulletin.json)
  let tags = json.Tag || []
  let quotes = json.Quote || []
  let files = json.File || []

  const IMG_EXT = /^(jpg|jpeg|png|gif|webp|svg|bmp)$/i
  const VID_EXT = /^(mp4|webm|mov|m4v)$/i
  const AUD_EXT = /^(mp3|ogg|oga|opus|wav|m4a|aac|flac)$/i
  const images = files.filter((f) => IMG_EXT.test(f.Ext))
  const videos = files.filter((f) => VID_EXT.test(f.Ext))
  const audios = files.filter((f) => AUD_EXT.test(f.Ext))

  return (
    <article className="space-y-4">
      <div className="flex flex-row gap-3">
        <div className="flex-none">
          <Avatar str={bulletin.address} size={50} />
        </div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div>
            <Link href={`/bulletins/${bulletin.hash}/json`} className="inline font-bold bg-blue-500 px-2 rounded-lg text-white">
              Bulletin#{bulletin.hash}
            </Link>
            <br />
            <Account address={bulletin.address} />
            <LinkBulletin hash={bulletin.hash} str={`#${bulletin.sequence}`} />
            <br />
            <Timestamp timestamp={bulletin.signed_at} />
          </div>
          <div className="flex gap-2">
            {bulletin.sequence !== 1 && (
              <Link href={`/bulletins/${bulletin.pre_hash}`} className='inline font-bold bg-yellow-500 rounded-md px-1'>上一篇</Link>
            )}
            {next && (
              <Link href={`/bulletins/${next.hash}`} className='inline font-bold bg-yellow-500 rounded-md px-1'>下一篇</Link>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-sm">Tag:</span>
              {tags.map((tag) => (
                <span key={tag} className='font-bold bg-gray-300 dark:bg-gray-600 rounded-md px-1 text-sm'>#{tag}</span>
              ))}
            </div>
          )}
          {quotes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-sm">Quote:</span>
              {quotes.map((quote) => (
                <Link key={quote.Hash} href={`/bulletins/${quote.Hash}`} className='font-bold bg-yellow-500 rounded-md px-1 text-sm'>
                  {quote.Address}#{quote.Sequence}
                </Link>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-1">
                <span className="text-sm">File:</span>
                {files.map((file) => (
                  <span key={file.Hash} className='font-bold bg-gray-300 dark:bg-gray-600 rounded-md px-1 text-sm'>
                    {(file.Name || 'unnamed').replace(/\.$/, '')}{file.Ext ? `.${file.Ext}` : ''} ({file.Size != null ? file.Size : '?'})
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                请使用 <Link href={`https://github.com/ripplemessenger/RippleMessengerClient/releases`} className="font-bold text-blue-500 hover:underline">RippleMessenger Client</Link> 下载文件
              </div>
            </div>
          )}
          <hr className="border-gray-300 dark:border-gray-600" />
          {(videos.length > 0 || audios.length > 0) && (
            <div className="flex flex-col gap-2">
              {videos.map((file) => (
                <div key={file.Hash} className="flex items-center gap-3 bg-black/80 text-white rounded-lg p-3">
                  {images.length > 0 && (
                    <img
                      src={`/file/${images[0].Hash}`}
                      alt=""
                      className="h-16 w-28 object-cover rounded"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-bold">▶ {file.Name || '视频'}{file.Ext ? `.${file.Ext}` : ''}</div>
                    <div className="text-sm text-gray-400">{file.Size != null ? (file.Size / 1024 / 1024).toFixed(1) + ' MB' : ''}</div>
                  </div>
                  <Link
                    href={`https://github.com/ripplemessenger/RippleMessengerClient/releases`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                  >
                    在 Client 中播放
                  </Link>
                </div>
              ))}
              {audios.map((file) => (
                <div key={file.Hash} className="flex items-center gap-3 bg-black/80 text-white rounded-lg p-3">
                  <div className="text-2xl">♪</div>
                  <div className="flex-1">
                    <div className="font-bold">{file.Name || '音频'}{file.Ext ? `.${file.Ext}` : ''}</div>
                    <div className="text-sm text-gray-400">{file.Size != null ? (file.Size / 1024 / 1024).toFixed(1) + ' MB' : ''}</div>
                  </div>
                  <Link
                    href={`https://github.com/ripplemessenger/RippleMessengerClient/releases`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                  >
                    在 Client 中播放
                  </Link>
                </div>
              ))}
            </div>
          )}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((file) => (
                <img
                  key={file.Hash}
                  src={`/file/${file.Hash}`}
                  alt={file.Name}
                  className="max-w-full max-h-96 rounded-lg"
                  loading="lazy"
                />
              ))}
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: bulletin.content.replace(/\n/g, "<br>") }} className="break-words"></div>
        </div>
      </div>

      {replys.length > 0 && (
        <section className="mt-6">
          <h3 className="text-lg font-bold mb-3">回复 ({reply_size})</h3>
          <ul className="space-y-3">
            {replys.map((reply) => (
              <li key={reply.hash} className="border-t border-gray-300 dark:border-gray-600 pt-3">
                <div className="flex flex-row gap-3">
                  <div className="flex-none">
                    <Avatar str={reply.address} size={50} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div>
                      <Account address={reply.address} />
                      <LinkBulletin hash={reply.hash} str={`#${reply.sequence}`} />
                      <Timestamp timestamp={reply.signed_at} />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: reply.content.replace(/\n/g, "<br>") }} className="break-words text-sm"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Pagination url={`/bulletins/${bulletin.hash}`} page_size={reply_size} page_cursor={page_cursor} />
    </article>
  )
}