import Link from "next/link"
import { cal_page_count } from '@/lib/Util'

function Pagination({ url, page_size, page_cursor }) {
  const page_count = cal_page_count(page_size)

  if (page_count <= 1) return null

  // Show a window of at most 7 page numbers around the current page.
  const WINDOW = 7
  let start = Math.max(1, page_cursor - Math.floor(WINDOW / 2))
  let end = Math.min(page_count, start + WINDOW - 1)
  start = Math.max(1, end - WINDOW + 1)

  const items = []
  for (let i = start; i <= end; i++) {
    if (i === page_cursor) {
      items.push(
        <li key={i} className="inline font-bold px-2">
          <span className='text-blue-500'>{` ${i} `}</span>
        </li>
      )
    } else {
      items.push(
        <li key={i} className="inline font-bold bg-blue-500 px-2 rounded-lg">
          <Link href={`${url}?page=${i}`}>{` ${i} `}</Link>
        </li>
      )
    }
  }

  return <ul className='py-2 flex gap-1 justify-center'>{items}</ul>
}
export default Pagination