import Link from "next/link"

export default function Page() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold mb-2">1、本站</h2>
        <p>本站服务地址：{process.env.SERVICE_URL}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">2、发帖 Client</h2>
        <p>
          <Link href={`https://github.com/ripplemessenger/RippleMessengerClient/releases`} className="font-bold bg-yellow-500 rounded-md px-1">
            Client 下载
          </Link>
          （Tauri on Windows）
        </p>
        <p>使用 Client，设置服务地址 {process.env.SERVICE_URL}，即可连接服务器发布帖子</p>
        <p>网站不提供账号注册或发布帖子服务，只提供展示帖子服务</p>
        <p>主要原因是账号发布帖子需要使用账号密钥签名，密钥存在个人设备中才能保障个人对账号的绝对控制</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">3、自建站点</h2>
        <p>
          <Link href={`https://github.com/ripplemessenger/RippleMessengerServer`} className="font-bold bg-yellow-500 rounded-md px-1">
            RippleMessengerServer
          </Link>
        </p>
      </section>
    </div>
  )
}

