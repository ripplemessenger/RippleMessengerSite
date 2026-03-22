import Link from "next/link"

export default function Bulletins(props) {
  return (
    <div>
      <div>
        <p>1、本站</p>
        <p>本站服务地址：{process.env.SERVICE_URL}</p>
        <p></p>
        <p></p>
      </div>
      <div>
        <p>2、发帖Client</p>
        <p><Link href={`https://github.com/ripplemessenger/RippleMessengerClient/releases`} className="font-bold bg-yellow-500 rounded-md px-1">Client下载</Link>（tauri on windows）</p>
        <p>使用Client，设置服务地址{process.env.SERVICE_URL}，即可连接服务器发布帖子</p>
        <p>网站不提供账号注册或发布帖子服务，只提供展示帖子服务</p>
        <p>主要原因是账号发布帖子需要使用账号密钥签名，密钥存在个人设备中才能保障个人对账号的绝对控制</p>
      </div>
      <div>
        <p>3、<Link href={`https://github.com/ripplemessenger/RippleMessengerServer`} className="font-bold bg-yellow-500 rounded-md px-1">自建站点</Link></p>
        <p></p>
        <p></p>
      </div>
    </div >
  )
}

