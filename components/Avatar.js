'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Avatar({ str, size }) {
  const [src, setSrc] = useState(`/avatar/${str}`)

  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={str}
      onError={() => setSrc('/assets/avatar.png')}
    />
  )
}
