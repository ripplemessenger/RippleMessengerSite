import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

// export const runtime = "edge"

export const metadata = {
  title: 'RM',
  description: 'RippleMessenger Bulletin Site',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className="container mx-auto bg-emerald-500 dark:bg-green-800">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}