import Link from "next/link"
import DarkMode from "./DarkMode"

const navItems = [
  { href: '/', label: '首页' },
  { href: '/bulletins', label: '帖子' },
  { href: '/accounts', label: '账号' },
  { href: '/about', label: '关于' },
]

export default function Header() {
  return (
    <nav className="flex items-center justify-between py-3 mb-4 border-b border-gray-300 dark:border-gray-600">
      <div className="flex items-center gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-bold text-lg text-gray-800 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <DarkMode />
    </nav>
  )
}