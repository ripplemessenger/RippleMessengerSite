'use client'

import React from 'react'
import Image from 'next/image'

export default function Avatar({ str, size }) {
  return (
    <Image src="/assets/avatar.png" width={size} height={size} alt={str} />
  )
}