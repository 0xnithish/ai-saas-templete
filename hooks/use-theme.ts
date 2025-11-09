"use client"

import * as React from "react"
import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  const { theme, systemTheme, setTheme } = useNextTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === "system" ? systemTheme : theme

  return {
    theme: currentTheme,
    setTheme,
    mounted,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
  }
}

export type Theme = "dark" | "light" | "system"
