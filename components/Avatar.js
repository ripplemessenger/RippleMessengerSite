'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Avatar({ str, size }) {
  const [src, setSrc] = useState(`/avatar/${str}`)

  useEffect(() => {
    setSrc(`/avatar/${str}`)
  }, [str])

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
