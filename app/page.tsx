import { getAllQueries } from "@/lib/queries"
import { QueryBrowser } from "@/components/query-browser"

export default function HomePage() {
  const queries = getAllQueries()

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-[28px] border border-white/10 bg-[#1c241d]/70 p-8 shadow-2xl backdrop-blur">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#a9b69c]">
          Detection Library
        </p>

      <div className="mb-8 rounded-2xl border border-[#4e614e] bg-[#182018] p-6">
        <h1 className="text-3xl font-bold text-[#eef3e7] mb-2">
          Cybersecurity Detection Library & Threat Hunting Knowledge Base
        </h1>
        <p className="text-[#c0cdb7]">
          Blutosec is an educational platform focused on cybersecurity detection engineering,
          incident response, and threat hunting. This library provides curated KQL queries, powershell scripts and
          techniques used by security analysts to identify, investigate, and respond to threats in Defender live response, and advanced hunting.
        </p>
      </div>

      <QueryBrowser queries={queries} />
    </main>
  )
}