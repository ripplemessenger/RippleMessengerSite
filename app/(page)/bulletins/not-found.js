import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">404 — 未找到</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">找不到该公告</p>
      <Link href="/" className="font-bold bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors">
        返回首页
      </Link>
    </div>
  )
}