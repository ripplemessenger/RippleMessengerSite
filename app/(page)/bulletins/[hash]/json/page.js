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
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words font-mono text-sm max-w-full">
        {bulletin.json}
      </pre>
    </div>
  )
}