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

        <h1 className="text-4xl font-bold tracking-tight text-[#eef3e7] sm:text-5xl">
          Searchable KQL Query Library
        </h1>

        <p className="mt-4 max-w-3xl text-base text-[#b8c3ad] sm:text-lg">
          Browse KQL queries by domain, use case, platform, tags, and data
          source. Built for identity, email, endpoint, network, and cloud
          investigations.
        </p>
      </div>

      <QueryBrowser queries={queries} />
    </main>
  )
}