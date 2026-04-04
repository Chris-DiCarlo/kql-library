import { getAllQueries } from "@/lib/queries"
import { QueryBrowser } from "@/components/query-browser"

export default function HomePage() {
  const queries = getAllQueries()

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Detection Library
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Searchable KQL Query Library
        </h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground sm:text-lg">
          Browse KQL queries by domain, use case, platform, tags, and data
          source. Built for identity, email, endpoint, network, and cloud
          investigations.
        </p>
      </div>

      <QueryBrowser queries={queries} />
    </main>
  )
}