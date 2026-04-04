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
  const [contentTypes, setContentTypes] = useState("")
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
      contentTypes: splitList(contentTypes),
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
    contentTypes,
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
      <div className="mb-8 rounded-[28px] border border-white/10 bg-[#1c241d]/70 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-2 text-4xl font-bold text-[#eef3e7]">Add Query</h1>
        <p className="text-[#b8c3ad]">
          Fill out the form and generate a JSON file for your query.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-[#4e614e] bg-[#182018] p-5">
        <h2 className="mb-4 text-lg font-semibold text-[#eef3e7]">
          How To Think About Each Field
        </h2>

        <div className="space-y-4 text-sm text-[#c0cdb7]">
          <div>
            <div className="font-semibold text-[#b8a7e6]">Content Types</div>
            <div>What kind of artifact this is.</div>
            <div className="mt-1 text-[#9cab91]">
              KQL, PowerShell, YARA, Sigma, Bash, Splunk, Regex
            </div>
          </div>

          <div>
            <div className="font-semibold text-[#7fa787]">Domains</div>
            <div>What security area it belongs to.</div>
            <div className="mt-1 text-[#9cab91]">
              Identity, Email, Endpoint, Network, Cloud
            </div>
          </div>

          <div>
            <div className="font-semibold text-[#b7c27a]">Use Cases</div>
            <div>What you use it for.</div>
            <div className="mt-1 text-[#9cab91]">
              Detection, Hunting, Triage, Investigation
            </div>
          </div>

          <div>
            <div className="font-semibold text-[#8fa8c7]">Platforms</div>
            <div>Where it applies.</div>
            <div className="mt-1 text-[#9cab91]">
              Sentinel, Defender, Windows, Linux, Entra, Zscaler
            </div>
          </div>

          <div>
            <div className="font-semibold text-[#c59ad9]">Data Sources</div>
            <div>What telemetry or source it uses.</div>
            <div className="mt-1 text-[#9cab91]">
              SigninLogs, DeviceProcessEvents, Files, Registry, PowerShell
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Title
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Impossible Travel Sign-ins"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Description
            </label>
            <textarea
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detects suspicious sign-ins from distant locations."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Query
            </label>
            <textarea
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 font-mono text-[#eef3e7] placeholder:text-[#8f9b85]"
              rows={10}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={"SigninLogs\n| take 10"}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Content Types (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={contentTypes}
              onChange={(e) => setContentTypes(e.target.value)}
              placeholder="kql,powershell"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Domains (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              placeholder="identity,email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Use Cases (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={useCases}
              onChange={(e) => setUseCases(e.target.value)}
              placeholder="detection,hunting"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Platforms (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              placeholder="sentinel,entra"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Data Sources (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={dataSources}
              onChange={(e) => setDataSources(e.target.value)}
              placeholder="SigninLogs"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Tags (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="identity,signin,anomaly"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              MITRE Techniques (comma separated)
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={mitreTechniques}
              onChange={(e) => setMitreTechniques(e.target.value)}
              placeholder="T1078,T1110"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Severity
            </label>
            <select
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7]"
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
            <label className="mb-1 block text-sm font-medium text-[#eef3e7]">
              Author
            </label>
            <input
              className="w-full rounded-xl border border-[#4f624f] bg-[#182018] p-3 text-[#eef3e7] placeholder:text-[#8f9b85]"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Chris"
            />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#eef3e7]">
              Generated JSON
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-xl border border-[#556b57] bg-[#243025] px-4 py-2 text-sm text-[#eef3e7] transition hover:bg-[#314034]"
              >
                Copy JSON
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-xl border border-[#556b57] bg-[#243025] px-4 py-2 text-sm text-[#eef3e7] transition hover:bg-[#314034]"
              >
                Download JSON
              </button>
            </div>
          </div>

          <div className="mb-3 text-sm text-[#9cab91]">
            File name: {fileName}
          </div>

          <pre className="overflow-x-auto rounded-2xl border border-[#334235] bg-[#0d120e] p-4 text-sm text-[#dfe8d5]">
            <code>{jsonOutput}</code>
          </pre>
        </section>
      </div>
    </main>
  )
}