import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata = {
  title: "Blutosec - Cybersecurity Detection Library",
  description:
    "Blutosec is an educational cybersecurity platform providing KQL queries, powershell scripts, detection engineering resources, and threat hunting techniques for security analysts and incident responders.",
  keywords: [
    "KQL",
    "Powershell",
    "Cybersecurity",
    "Threat Hunting",
    "Detection Engineering",
    "SIEM",
    "Sentinel",
    "Incident Response"
  ],
}

function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1b241d]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide text-[#e7eddc]"
        >
          Blutosec
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-[#556b57]/60 bg-[#2a362b]/70 px-4 py-2 text-sm text-[#e7eddc] transition hover:bg-[#334235]"
          >
            Library
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-[#556b57]/60 bg-[#2a362b]/70 px-4 py-2 text-sm text-[#e7eddc] transition hover:bg-[#334235]"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-[#556b57]/60 bg-[#2a362b]/70 px-4 py-2 text-sm text-[#e7eddc] transition hover:bg-[#334235]"
          >
            Contact
          </Link>
          <Link
            href="/privacy-policy"
            className="rounded-xl border border-[#556b57]/60 bg-[#2a362b]/70 px-4 py-2 text-sm text-[#e7eddc] transition hover:bg-[#334235]"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#111712] text-[#f1f5eb]">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(88,112,92,0.30),_transparent_35%),linear-gradient(180deg,_#1a221b_0%,_#111712_55%,_#0c100d_100%)]">
          <TopNav />
          {children}
        </div>
      </body>
    </html>
  )
}