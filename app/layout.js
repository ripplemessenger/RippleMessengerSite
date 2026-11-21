import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'RM',
  description: 'RippleMessenger Bulletin Site',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-emerald-500 dark:bg-green-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto max-w-4xl px-4 py-2">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}