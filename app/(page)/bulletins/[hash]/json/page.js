import { notFound } from 'next/navigation'
import getBulletinJsonData from "@/lib/data/bulletin_json"

export default async function Page(props) {
  let data = await getBulletinJsonData({ hash: props.params.hash })
  let bulletin = data.bulletin
  if (!bulletin) {
    notFound()
  }

  return (
    <div className='break-all'>
      {bulletin.json}
    </div>
  )
}