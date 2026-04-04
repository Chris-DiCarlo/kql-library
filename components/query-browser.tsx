"use client"

import { useMemo, useState } from "react"
import { Search, Copy, Check } from "lucide-react"
import { QueryItem } from "@/lib/types"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Props = {
  queries: QueryItem[]
}

const domainOptions = ["identity", "email", "endpoint", "network", "cloud"]
const useCaseOptions = ["detection", "hunting", "triage", "investigation"]
const platformOptions = ["sentinel", "defender", "entra", "zscaler", "m365"]

function FilterGroup({
  title,
  options,
  selected,
  toggle,
}: {
  title: string
  options: string[]
  selected: string[]
  toggle: (value: string) => void
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9cab91]">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button key={item} type="button" onClick={() => toggle(item)}>
            <span
              className={`px-3 py-1 text-sm rounded-full border capitalize transition ${
                selected.includes(item)
                  ? "bg-[#415540] text-[#eef3e7] border-[#70886e]"
                  : "bg-[#1a221b] text-[#b8c3ad] border-[#445443] hover:bg-[#253027]"
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CopyButton({ query }: { query: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(query)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-xl border border-[#556b57] bg-[#243025] px-3 py-2 text-sm text-[#eef3e7] hover:bg-[#314034]"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

export function QueryBrowser({ queries }: Props) {
  const [search, setSearch] = useState("")
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([])

  const dataSourceOptions = useMemo(() => {
    return Array.from(new Set(queries.flatMap((q) => q.dataSources))).sort()
  }, [queries])

  function toggleValue(
    value: string,
    current: string[],
    setter: (v: string[]) => void
  ) {
    setter(
      current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value]
    )
  }

  function matches(selected: string[], values: string[]) {
    return selected.length === 0 || selected.some((x) => values.includes(x))
  }

  const filtered = useMemo(() => {
    return queries.filter((q) => {
      const text = [
        q.title,
        q.description,
        q.query,
        q.tags.join(" "),
        q.domains.join(" "),
        q.useCases.join(" "),
        q.platforms.join(" "),
        q.dataSources.join(" "),
      ]
        .join(" ")
        .toLowerCase()

      return (
        text.includes(search.toLowerCase()) &&
        matches(selectedDomains, q.domains) &&
        matches(selectedUseCases, q.useCases) &&
        matches(selectedPlatforms, q.platforms) &&
        matches(selectedDataSources, q.dataSources)
      )
    })
  }, [
    queries,
    search,
    selectedDomains,
    selectedUseCases,
    selectedPlatforms,
    selectedDataSources,
  ])

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* FILTERS */}
      <aside className="space-y-6 rounded-[28px] border border-white/10 bg-[#1c241d]/80 p-5 shadow-2xl">
        <FilterGroup
          title="Domains"
          options={domainOptions}
          selected={selectedDomains}
          toggle={(v) => toggleValue(v, selectedDomains, setSelectedDomains)}
        />

        <FilterGroup
          title="Use Cases"
          options={useCaseOptions}
          selected={selectedUseCases}
          toggle={(v) => toggleValue(v, selectedUseCases, setSelectedUseCases)}
        />

        <FilterGroup
          title="Platforms"
          options={platformOptions}
          selected={selectedPlatforms}
          toggle={(v) => toggleValue(v, selectedPlatforms, setSelectedPlatforms)}
        />

        <FilterGroup
          title="Data Sources"
          options={dataSourceOptions}
          selected={selectedDataSources}
          toggle={(v) =>
            toggleValue(v, selectedDataSources, setSelectedDataSources)
          }
        />

        <button
          onClick={() => {
            setSelectedDomains([])
            setSelectedUseCases([])
            setSelectedPlatforms([])
            setSelectedDataSources([])
            setSearch("")
          }}
          className="text-sm text-[#9cab91] underline"
        >
          Clear filters
        </button>
      </aside>

      {/* RESULTS */}
      <section>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 text-[#8f9b85]" size={16} />
          <Input
            placeholder="Search queries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-2xl border-[#445443] bg-[#182018] pl-9 text-[#eef3e7]"
          />
        </div>

        <div className="mb-4 text-sm text-[#9cab91]">
          {filtered.length} queries
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {filtered.map((q) => (
            <AccordionItem
              key={q.id}
              value={q.id}
              className="rounded-2xl border border-white/10 bg-[#1a221b]/90 px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="w-full text-left">
                  <h2 className="text-lg font-semibold text-[#eef3e7]">
                    {q.title}
                  </h2>

                  <p className="mb-2 text-sm text-[#b8c3ad]">
                    {q.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {q.domains.map((x) => (
                      <span
                        key={x}
                        className="px-3 py-1 text-sm rounded-full border border-[#5f7a5f] bg-[#2f3f2f] text-[#dce7d2]"
                      >
                        {x}
                      </span>
                    ))}

                    {q.useCases.map((x) => (
                      <span
                        key={x}
                        className="px-3 py-1 text-sm rounded-full border border-[#4f624f] bg-[#1f2a23] text-[#b8c3ad]"
                      >
                        {x}
                      </span>
                    ))}

                    {q.platforms.map((x) => (
                      <span
                        key={x}
                        className="px-3 py-1 text-sm rounded-full border border-[#6c8a6b] bg-[#2a332b] text-[#cfe3c2]"
                      >
                        {x}
                      </span>
                    ))}

                    {q.dataSources.map((x) => (
                      <span
                        key={x}
                        className="px-3 py-1 text-sm rounded-full border border-[#4a5d4a] bg-[#101512] text-[#d7e5d0]"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="flex justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    {q.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 text-xs rounded-full border border-[#445443] text-[#a9b69c]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <CopyButton query={q.query} />
                </div>

                <pre className="rounded-xl bg-[#0d120e] p-4 text-sm text-[#dfe8d5] overflow-x-auto">
                  <code>{q.query}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}