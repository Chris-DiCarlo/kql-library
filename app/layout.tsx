import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "KQL Library",
  description: "Searchable KQL query library for detection and hunting",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}