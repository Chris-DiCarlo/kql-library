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

function formatLabel(value: string) {
  return value
    .split(/[\s-]+/)
    .map((part) => {
      if (!part) return part
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(" ")
}

function Pill({
  children,
  active = false,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm leading-none transition ${
        active
          ? "border-[#8ea184] bg-[#314131] text-[#eef3e7]"
          : "border-[#5f715e] bg-[#1a231b] text-[#d7e2ce]"
      }`}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9cab91]">
      {children}
    </div>
  )
}

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
      <SectionLabel>{title}</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button key={item} type="button" onClick={() => toggle(item)}>
            <Pill active={selected.includes(item)}>{formatLabel(item)}</Pill>
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
      type="button"
      onClick={handleCopy}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#6d816d] bg-[#223024] px-4 text-sm font-medium text-[#eef3e7] transition hover:bg-[#2d3d2f]"
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
    return Array.from(new Set(queries.flatMap((q) => q.dataSources))).sort(
      (a, b) => a.localeCompare(b)
    )
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
        q.mitreTechniques?.join(" ") ?? "",
        q.author ?? "",
        q.severity ?? "",
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
      <aside className="space-y-6 rounded-[28px] border border-white/10 bg-[#1a211b]/85 p-5 shadow-2xl">
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
          type="button"
          onClick={() => {
            setSelectedDomains([])
            setSelectedUseCases([])
            setSelectedPlatforms([])
            setSelectedDataSources([])
            setSearch("")
          }}
          className="text-sm text-[#a8b69e] underline underline-offset-4"
        >
          Clear Filters
        </button>
      </aside>

      <section>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 text-[#8f9b85]" size={16} />
          <Input
            placeholder="Search queries, tags, platforms, or tables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-2xl border-[#4e614e] bg-[#182018] pl-9 text-[#eef3e7] placeholder:text-[#8f9b85]"
          />
        </div>

        <div className="mb-4 text-sm text-[#9cab91]">
          {filtered.length} {filtered.length === 1 ? "Query" : "Queries"}
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {filtered.map((q) => (
            <AccordionItem
              key={q.id}
              value={q.id}
              className="rounded-2xl border border-[#5b6a5a] bg-[#202822] px-5 shadow-lg"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="w-full pr-4 text-left">
                  <h2 className="text-xl font-semibold text-[#eef3e7]">
                    {q.title}
                  </h2>

                  <p className="mt-2 mb-4 text-sm text-[#c0cdb7]">
                    {q.description}
                  </p>

                  <div className="grid gap-3">
                    <div>
                      <SectionLabel>Summary</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {q.domains.map((x) => (
                          <Pill key={`${q.id}-domain-${x}`}>{formatLabel(x)}</Pill>
                        ))}
                        {q.useCases.map((x) => (
                          <Pill key={`${q.id}-use-${x}`}>{formatLabel(x)}</Pill>
                        ))}
                        {q.platforms.map((x) => (
                          <Pill key={`${q.id}-platform-${x}`}>{formatLabel(x)}</Pill>
                        ))}
                        {q.dataSources.map((x) => (
                          <Pill key={`${q.id}-source-${x}`}>{x}</Pill>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-5 pt-2">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                    <div className="space-y-4">
                      {q.tags.length > 0 && (
                        <div>
                          <SectionLabel>Tags</SectionLabel>
                          <div className="flex flex-wrap gap-2">
                            {q.tags.map((tag) => (
                              <Pill key={`${q.id}-tag-${tag}`}>
                                {formatLabel(tag)}
                              </Pill>
                            ))}
                          </div>
                        </div>
                      )}

                      {q.mitreTechniques && q.mitreTechniques.length > 0 && (
                        <div>
                          <SectionLabel>MITRE</SectionLabel>
                          <div className="flex flex-wrap gap-2">
                            {q.mitreTechniques.map((mitre) => (
                              <Pill key={`${q.id}-mitre-${mitre}`}>{mitre}</Pill>
                            ))}
                          </div>
                        </div>
                      )}

                      {(q.severity || q.author) && (
                        <div>
                          <SectionLabel>Details</SectionLabel>
                          <div className="flex flex-wrap gap-2">
                            {q.severity && <Pill>{formatLabel(q.severity)}</Pill>}
                            {q.author && <Pill>{q.author}</Pill>}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-start md:justify-end">
                      <CopyButton query={q.query} />
                    </div>
                  </div>

                  <div>
                    <SectionLabel>KQL Query</SectionLabel>
                    <pre className="overflow-x-auto rounded-2xl border border-[#344334] bg-[#0d120e] p-4 text-sm text-[#dfe8d5]">
                      <code>{q.query}</code>
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}