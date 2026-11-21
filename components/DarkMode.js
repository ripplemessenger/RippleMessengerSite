'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function DarkMode() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setTheme(saved)
      if (saved === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  return (
    <button onClick={toggleTheme} aria-label="切换主题" className="ml-2">
      {theme === 'dark'
        ? <Image src="/assets/mode_light.png" width={40} height={30} alt="切换到亮色" />
        : <Image src="/assets/mode_dark.png" width={40} height={30} alt="切换到暗色" />
      }
    </button>
  )
}

