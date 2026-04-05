import { getAllQueries } from "@/lib/queries"
import { QueryBrowser } from "@/components/query-browser"

export default function HomePage() {
  const queries = getAllQueries()

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Intro Section */}
      <div className="mb-8 rounded-2xl border border-[#4e614e] bg-[#182018] p-6">
        <h1 className="mb-2 text-3xl font-bold text-[#eef3e7]">
          Cybersecurity Detection Library & Threat Hunting Knowledge Base
        </h1>
        <p className="text-[#c0cdb7]">
          Blutosec is an educational platform focused on cybersecurity detection
          engineering, incident response, and threat hunting. This library provides
          curated KQL queries, Powershell scripts and techniques used by security analysts to identify,
          investigate, and respond to threats in Defender Live Response, and Advanced hunting.
        </p>
      </div>

      {/* Query Browser */}
      <QueryBrowser queries={queries} />
    </main>
  )
}