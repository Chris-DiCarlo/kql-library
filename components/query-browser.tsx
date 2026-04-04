"use client"

import { useMemo, useState } from "react"
import { Search, Copy, Check } from "lucide-react"
import { QueryItem } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button key={item} type="button" onClick={() => toggle(item)}>
            <Badge
              variant={selected.includes(item) ? "default" : "outline"}
              className="capitalize"
            >
              {item}
            </Badge>
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
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-muted"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
    return Array.from(
      new Set(queries.flatMap((q) => q.dataSources))
    ).sort((a, b) => a.localeCompare(b))
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

  function matchesGroup(selected: string[], values: string[]) {
    return selected.length === 0 || selected.some((item) => values.includes(item))
  }

  const filtered = useMemo(() => {
    return queries.filter((q) => {
      const searchableText = [
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

      const matchesSearch = searchableText.includes(search.toLowerCase())

      return (
        matchesSearch &&
        matchesGroup(selectedDomains, q.domains) &&
        matchesGroup(selectedUseCases, q.useCases) &&
        matchesGroup(selectedPlatforms, q.platforms) &&
        matchesGroup(selectedDataSources, q.dataSources)
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
      <aside className="space-y-6 rounded-3xl border bg-white p-5 shadow-sm dark:bg-zinc-950">
        <FilterGroup
          title="Domains"
          options={domainOptions}
          selected={selectedDomains}
          toggle={(value) =>
            toggleValue(value, selectedDomains, setSelectedDomains)
          }
        />

        <FilterGroup
          title="Use Cases"
          options={useCaseOptions}
          selected={selectedUseCases}
          toggle={(value) =>
            toggleValue(value, selectedUseCases, setSelectedUseCases)
          }
        />

        <FilterGroup
          title="Platforms"
          options={platformOptions}
          selected={selectedPlatforms}
          toggle={(value) =>
            toggleValue(value, selectedPlatforms, setSelectedPlatforms)
          }
        />

        <FilterGroup
          title="Data Sources"
          options={dataSourceOptions}
          selected={selectedDataSources}
          toggle={(value) =>
            toggleValue(value, selectedDataSources, setSelectedDataSources)
          }
        />

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDomains([])
              setSelectedUseCases([])
              setSelectedPlatforms([])
              setSelectedDataSources([])
              setSearch("")
            }}
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      </aside>

      <section>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title, tags, table, platform, MITRE, or query text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-2xl pl-9"
          />
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          {filtered.length} quer{filtered.length === 1 ? "y" : "ies"} found
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {filtered.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-2xl border px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="w-full pr-4 text-left">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold">{item.title}</span>
                    {item.severity && (
                      <Badge variant="outline" className="capitalize">
                        {item.severity}
                      </Badge>
                    )}
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.domains.map((x) => (
                      <Badge key={`${item.id}-domain-${x}`} variant="secondary" className="capitalize">
                        {x}
                      </Badge>
                    ))}
                    {item.useCases.map((x) => (
                      <Badge key={`${item.id}-use-${x}`} variant="outline" className="capitalize">
                        {x}
                      </Badge>
                    ))}
                    {item.platforms.map((x) => (
                      <Badge key={`${item.id}-platform-${x}`} className="capitalize">
                        {x}
                      </Badge>
                    ))}
                    {item.dataSources.map((x) => (
                      <Badge key={`${item.id}-source-${x}`} variant="outline">
                        {x}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={`${item.id}-tag-${tag}`} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {item.mitreTechniques?.map((mitre) => (
                      <Badge key={`${item.id}-mitre-${mitre}`} variant="outline">
                        {mitre}
                      </Badge>
                    ))}
                  </div>

                  <CopyButton query={item.query} />
                </div>

                <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-100">
                  <code>{item.query}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}