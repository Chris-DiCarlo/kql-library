import { notFound } from "next/navigation"
import { getAllQueries, getQueryById } from "@/lib/queries"
import { Badge } from "@/components/ui/badge"
import { CopyQueryButton } from "@/components/copy-query-button"

export function generateStaticParams() {
  return getAllQueries().map((q) => ({ id: q.id }))
}

export default async function QueryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = getQueryById(id)

  if (!item) return notFound()

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">{item.title}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {item.description}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {item.domains.map((x) => (
          <Badge key={x} className="capitalize">
            {x}
          </Badge>
        ))}
        {item.useCases.map((x) => (
          <Badge key={x} variant="secondary" className="capitalize">
            {x}
          </Badge>
        ))}
        {item.platforms.map((x) => (
          <Badge key={x} variant="outline" className="capitalize">
            {x}
          </Badge>
        ))}
      </div>
    <div className="mb-4">
    <CopyQueryButton query={item.query} />
    </div>
<pre className="overflow-x-auto rounded-3xl border bg-zinc-950 p-5 text-sm text-zinc-100 shadow-sm">
  <code>{item.query}</code>
</pre>
    </main>
  )
}