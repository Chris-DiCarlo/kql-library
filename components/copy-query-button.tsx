"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CopyQueryButton({ query }: { query: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(query)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button onClick={handleCopy} variant="outline">
      {copied ? "Copied" : "Copy Query"}
    </Button>
  )
}