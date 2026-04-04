"use client"

import { useMemo, useState } from "react"
import { toSlug } from "@/lib/slug"

type Severity = "low" | "medium" | "high" | ""

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}

export default function AddQueryPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [query, setQuery] = useState("")
  const [domains, setDomains] = useState("")
  const [useCases, setUseCases] = useState("")
  const [platforms, setPlatforms] = useState("")
  const [dataSources, setDataSources] = useState("")
  const [tags, setTags] = useState("")
  const [mitreTechniques, setMitreTechniques] = useState("")
  const [severity, setSeverity] = useState<Severity>("")
  const [author, setAuthor] = useState("")

  const fileName = useMemo(() => {
    return `${toSlug(title || "new-query")}.json`
  }, [title])

  const jsonOutput = useMemo(() => {
    const payload: Record<string, unknown> = {
      id: toSlug(title || "new-query"),
      title,
      description,
      query,
      domains: splitList(domains),
      useCases: splitList(useCases),
      platforms: splitList(platforms),
      dataSources: splitList(dataSources),
      tags: splitList(tags),
    }

    const mitre = splitList(mitreTechniques)
    if (mitre.length) payload.mitreTechniques = mitre
    if (severity) payload.severity = severity
    if (author.trim()) payload.author = author.trim()

    return JSON.stringify(payload, null, 2)
  }, [
    title,
    description,
    query,
    domains,
    useCases,
    platforms,
    dataSources,
    tags,
    mitreTechniques,
    severity,
    author,
  ])

  async function handleCopy() {
    await navigator.clipboard.writeText(jsonOutput)
  }

  function handleDownload() {
    const blob = new Blob([jsonOutput], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-2 text-4xl font-bold">Add Query</h1>
      <p className="mb-8 text-muted-foreground">
        Fill out the form and generate a JSON file for your query.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              className="w-full rounded-xl border p-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Impossible Travel Sign-ins"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded-xl border p-3"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detects suspicious sign-ins from distant locations."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Query</label>
            <textarea
              className="w-full rounded-xl border p-3 font-mono"
              rows={10}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={"SigninLogs\n| take 10"}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Domains (comma separated)
            </label>
            <input
              className="w-full rounded-xl border p-3"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              placeholder="identity,email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Use Cases (comma separated)
            </label>
            <input
              className="w-full rounded-xl border p-3"
              value={useCases}
              onChange={(e) => setUseCases(e.target.value)}
              placeholder="detection,hunting"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Platforms (comma separated)
            </label>
            <input
              className="w-full rounded-xl border p-3"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              placeholder="sentinel,entra"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Data Sources (comma separated)
            </label>
            <input
              className="w-full rounded-xl border p-3"
              value={dataSources}
              onChange={(e) => setDataSources(e.target.value)}
              placeholder="SigninLogs"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Tags (comma separated)
            </label>
            <input
              className="w-full rounded-xl border p-3"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="identity,signin,anomaly"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              MITRE Techniques (comma separated)
            </label>
            <input
              className="w-full rounded-xl border p-3"
              value={mitreTechniques}
              onChange={(e) => setMitreTechniques(e.target.value)}
              placeholder="T1078,T1110"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Severity</label>
            <select
              className="w-full rounded-xl border p-3"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
            >
              <option value="">None</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Author</label>
            <input
              className="w-full rounded-xl border p-3"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Chris"
            />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Generated JSON</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-xl border px-4 py-2 text-sm"
              >
                Copy JSON
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-xl border px-4 py-2 text-sm"
              >
                Download JSON
              </button>
            </div>
          </div>

          <div className="mb-3 text-sm text-muted-foreground">
            File name: {fileName}
          </div>

          <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-100">
            <code>{jsonOutput}</code>
          </pre>
        </section>
      </div>
    </main>
  )
}