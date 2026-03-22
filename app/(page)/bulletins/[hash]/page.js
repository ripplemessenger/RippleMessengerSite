// 'use client'

import Link from "next/link"
import { notFound } from 'next/navigation'
import Account from "@/components/Account"
import LinkBulletin from "@/components/LinkBulletin"
import Avatar from "@/components/Avatar"
import Timestamp from "@/components/Timestamp"
import QRCode from "@/components/QRCode"
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
  if (!bulletin.file) {
    bulletin['file'] = '[]'
  }

  let json = JSON.parse(bulletin.json)
  let tags = []
  if (json.Tag) {
    tags = json.Tag
  }
  let quotes = []
  if (json.Quote) {
    quotes = json.Quote
  }
  let files = []
  if (json.File) {
    files = json.File
  }

  // let pk = JSON.parse(bulletin.json).PublicKey
  // let qr_json = {
  //   "Relay": process.env.BASE_URL,
  //   "PublicKey": pk
  // }
  // let qrcode = JSON.stringify(qr_json)

  return (
    <div>
      <div className="flex flex-row">
        <div className="flex-none">
          <Avatar str={bulletin.address} size={50} />
        </div>
        <div className="flex flex-col">
          <div>
            <Link href={`/bulletins/${bulletin.hash}/json`} className="inline font-bold bg-blue-500 px-2 rounded-lg">Bulletin#{bulletin.hash}</Link>
            <br />
            <Account address={bulletin.address} />
            <LinkBulletin hash={bulletin.hash} str={`#${bulletin.sequence}`} />
            <br />
            <Timestamp timestamp={bulletin.signed_at} />
          </div>
          <div>
            {
              bulletin.sequence != 1 ?
                <Link href={`/bulletins/${bulletin.pre_hash}`} className='inline font-bold bg-yellow-500 rounded-md px-0.5'>上一篇</Link> : <></>
            }
            {
              next ?
                <Link href={`/bulletins/${next.hash}`} className='inline font-bold bg-yellow-500 rounded-md px-0.5'>下一篇</Link> : <></>
            }
          </div>
          {
            tags.length > 0 ?
              <div className="flex flex-wrap">
                Tag: {tags.map((tag) => (
                  <div className="inline" key={tag}>
                    <Link href={`#`} className='font-bold bg-gray-300 rounded-md px-1'>#{tag}</Link>
                  </div>
                ))}
              </div> : <></>
          }
          {
            quotes.length > 0 ?
              <div className="flex flex-wrap">
                Quote: {quotes.map((quote) => (
                  <div className="inline" key={quote.Hash}>
                    <Link href={`/bulletins/${quote.Hash}`} className='font-bold bg-yellow-500 rounded-md px-1'>{quote.Address}#{quote.Sequence}</Link>
                  </div>
                ))}
              </div> : <></>
          }
          {
            files.length > 0 ?
              <div className="flex flex-wrap">
                File: {files.map((file) => (
                  <div className="inline" key={file.Hash}>
                    <Link href={`#`} className='font-bold bg-gray-500 rounded-md px-1'>{file.Name}{file.Ext}({file.Size})</Link>
                  </div>
                ))}
              </div> : <></>
          }
          <hr />
          <div dangerouslySetInnerHTML={{ __html: bulletin.content.replace(/\n/g, "<br>") }} className="break-all"></div>
        </div>
        <div className="flex flex-col">
          {/* <QRCode content={qrcode} /> */}
        </div>
      </div>
      <div>
        <ul>
          {replys.map((reply) => (
            <li key={reply.hash} >
              <hr />
              <div className="flex flex-row">
                <div className="flex-none">
                  <Avatar str={reply.address} size={50} />
                </div>
                <div className="flex flex-col">
                  <div>
                    <Account address={reply.address} />
                    <LinkBulletin hash={reply.hash} str={`#${reply.sequence}`} />
                    <Timestamp timestamp={reply.signed_at} />
                  </div>
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: reply.content.replace(/\n/g, "<br>") }} className="break-all"></div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div >
      <Pagination url={`/bulletins/${bulletin.hash}`} page_size={reply_size} page_cursor={page_cursor}></Pagination>
    </div>
  )
}