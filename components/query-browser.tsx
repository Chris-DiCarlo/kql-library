"use client"

import { useMemo, useState } from "react"
import { Search, Copy, Check, X, ArrowUpDown } from "lucide-react"
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

type SortOption = "title-asc" | "title-desc"

function formatLabel(value: string) {
  return value
    .split(/[\s-]+/)
    .map((part) => {
      if (!part) return part
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(" ")
}

type PillVariant =
  | "default"
  | "contenttype"
  | "domain"
  | "usecase"
  | "platform"
  | "datasource"
  | "tag"
  | "mitre"
  | "detail"

function getPillClasses(variant: PillVariant, active = false) {
  if (active) {
    return "border-[#9fb397] bg-[#3a4d3b] text-[#eef3e7]"
  }

  switch (variant) {
    case "contenttype":
      return "border-[#8c7bb8] bg-[#2c2540] text-[#eee7ff]"
    case "domain":
      return "border-[#6e8d74] bg-[#253629] text-[#e2f0e0]"
    case "usecase":
      return "border-[#7c8f5d] bg-[#31381f] text-[#edf3d6]"
    case "platform":
      return "border-[#6e7f93] bg-[#25303a] text-[#e1eaf5]"
    case "datasource":
      return "border-[#8a6f97] bg-[#2d2436] text-[#f0e2f8]"
    case "tag":
      return "border-[#5f715e] bg-[#1a231b] text-[#d7e2ce]"
    case "mitre":
      return "border-[#8f7b54] bg-[#352d1d] text-[#f4e8c8]"
    case "detail":
      return "border-[#6a6a6a] bg-[#242424] text-[#efefef]"
    default:
      return "border-[#5f715e] bg-[#1a231b] text-[#d7e2ce]"
  }
}

function Pill({
  children,
  variant = "default",
  active = false,
}: {
  children: React.ReactNode
  variant?: PillVariant
  active?: boolean
}) {
  return (
    <span
      className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3 py-1 text-sm leading-none transition ${getPillClasses(
        variant,
        active
      )}`}
    >
      {children}
    </span>
  )
}

function SectionLabel({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?:
    | "default"
    | "contenttype"
    | "domain"
    | "usecase"
    | "platform"
    | "datasource"
}) {
  function getColor() {
    switch (variant) {
      case "contenttype":
        return "text-[#b8a7e6]"
      case "domain":
        return "text-[#7fa787]"
      case "usecase":
        return "text-[#b7c27a]"
      case "platform":
        return "text-[#8fa8c7]"
      case "datasource":
        return "text-[#c59ad9]"
      default:
        return "text-[#9cab91]"
    }
  }

  return (
    <div
      className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${getColor()}`}
    >
      {children}
    </div>
  )
}

function CountPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick}>
      <span
        className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1 text-sm leading-none transition ${
          active
            ? "border-[#9fb397] bg-[#3a4d3b] text-[#eef3e7]"
            : "border-[#5f715e] bg-[#1a231b] text-[#d7e2ce] hover:bg-[#243025]"
        }`}
      >
        <span>{formatLabel(label)}</span>
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs ${
            active
              ? "bg-[#556856] text-[#eef3e7]"
              : "bg-[#2a342b] text-[#c8d5bf]"
          }`}
        >
          {count}
        </span>
      </span>
    </button>
  )
}

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#9fb397] bg-[#3a4d3b] px-3 py-1 text-sm text-[#eef3e7] transition hover:bg-[#465947]"
    >
      <span>{label}</span>
      <X size={14} />
    </button>
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

function FilterGroup({
  title,
  options,
  selected,
  toggle,
  getCount,
  variant,
}: {
  title: string
  options: string[]
  selected: string[]
  toggle: (value: string) => void
  getCount: (value: string) => number
  variant: "contenttype" | "domain" | "usecase" | "platform" | "datasource"
}) {
  const visibleOptions = options.filter((item) => getCount(item) > 0)

  return (
    <div>
      <SectionLabel variant={variant}>{title}</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((item) => (
          <CountPill
            key={item}
            label={item}
            count={getCount(item)}
            active={selected.includes(item)}
            onClick={() => toggle(item)}
          />
        ))}
      </div>
    </div>
  )
}

export function QueryBrowser({ queries }: Props) {
  const [search, setSearch] = useState("")
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("title-asc")

  const contentTypeOptions = useMemo(() => {
    return Array.from(new Set(queries.flatMap((q) => q.contentTypes))).sort(
      (a, b) => a.localeCompare(b)
    )
  }, [queries])

  const domainOptions = useMemo(() => {
    return Array.from(new Set(queries.flatMap((q) => q.domains))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [queries])

  const useCaseOptions = useMemo(() => {
    return Array.from(new Set(queries.flatMap((q) => q.useCases))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [queries])

  const platformOptions = useMemo(() => {
    return Array.from(new Set(queries.flatMap((q) => q.platforms))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [queries])

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
    const results = queries.filter((q) => {
      const text = [
        q.title,
        q.description,
        q.query,
        q.contentTypes.join(" "),
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
        matches(selectedContentTypes, q.contentTypes) &&
        matches(selectedDomains, q.domains) &&
        matches(selectedUseCases, q.useCases) &&
        matches(selectedPlatforms, q.platforms) &&
        matches(selectedDataSources, q.dataSources)
      )
    })

    return [...results].sort((a, b) => {
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title)
      }
      return a.title.localeCompare(b.title)
    })
  }, [
    queries,
    search,
    selectedContentTypes,
    selectedDomains,
    selectedUseCases,
    selectedPlatforms,
    selectedDataSources,
    sortBy,
  ])

  function getCountsForGroup(
    group: "contentTypes" | "domains" | "useCases" | "platforms" | "dataSources",
    value: string
  ) {
    return queries.filter((q) => {
      const text = [
        q.title,
        q.description,
        q.query,
        q.contentTypes.join(" "),
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

      if (!text.includes(search.toLowerCase())) return false

      const contentTypeMatch =
        group === "contentTypes"
          ? q.contentTypes.includes(value)
          : matches(selectedContentTypes, q.contentTypes)

      const domainMatch =
        group === "domains"
          ? q.domains.includes(value)
          : matches(selectedDomains, q.domains)

      const useCaseMatch =
        group === "useCases"
          ? q.useCases.includes(value)
          : matches(selectedUseCases, q.useCases)

      const platformMatch =
        group === "platforms"
          ? q.platforms.includes(value)
          : matches(selectedPlatforms, q.platforms)

      const dataSourceMatch =
        group === "dataSources"
          ? q.dataSources.includes(value)
          : matches(selectedDataSources, q.dataSources)

      return (
        contentTypeMatch &&
        domainMatch &&
        useCaseMatch &&
        platformMatch &&
        dataSourceMatch
      )
    }).length
  }

  const activeFilters = [
    ...selectedContentTypes.map((x) => ({
      key: `content-${x}`,
      label: `Content Type: ${formatLabel(x)}`,
      remove: () =>
        setSelectedContentTypes((current) =>
          current.filter((item) => item !== x)
        ),
    })),
    ...selectedDomains.map((x) => ({
      key: `domain-${x}`,
      label: `Domain: ${formatLabel(x)}`,
      remove: () =>
        setSelectedDomains((current) => current.filter((item) => item !== x)),
    })),
    ...selectedUseCases.map((x) => ({
      key: `use-${x}`,
      label: `Use Case: ${formatLabel(x)}`,
      remove: () =>
        setSelectedUseCases((current) => current.filter((item) => item !== x)),
    })),
    ...selectedPlatforms.map((x) => ({
      key: `platform-${x}`,
      label: `Platform: ${formatLabel(x)}`,
      remove: () =>
        setSelectedPlatforms((current) => current.filter((item) => item !== x)),
    })),
    ...selectedDataSources.map((x) => ({
      key: `source-${x}`,
      label: `Data Source: ${x}`,
      remove: () =>
        setSelectedDataSources((current) => current.filter((item) => item !== x)),
    })),
  ]

  const hasActiveFilters =
    activeFilters.length > 0 || search.trim().length > 0

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-6 rounded-[28px] border border-white/10 bg-[#1a211b]/85 p-5 shadow-2xl">
        <FilterGroup
          title="Content Types"
          variant="contenttype"
          options={contentTypeOptions}
          selected={selectedContentTypes}
          toggle={(v) =>
            toggleValue(v, selectedContentTypes, setSelectedContentTypes)
          }
          getCount={(v) => getCountsForGroup("contentTypes", v)}
        />

        <FilterGroup
          title="Domains"
          variant="domain"
          options={domainOptions}
          selected={selectedDomains}
          toggle={(v) => toggleValue(v, selectedDomains, setSelectedDomains)}
          getCount={(v) => getCountsForGroup("domains", v)}
        />

        <FilterGroup
          title="Use Cases"
          variant="usecase"
          options={useCaseOptions}
          selected={selectedUseCases}
          toggle={(v) => toggleValue(v, selectedUseCases, setSelectedUseCases)}
          getCount={(v) => getCountsForGroup("useCases", v)}
        />

        <FilterGroup
          title="Platforms"
          variant="platform"
          options={platformOptions}
          selected={selectedPlatforms}
          toggle={(v) => toggleValue(v, selectedPlatforms, setSelectedPlatforms)}
          getCount={(v) => getCountsForGroup("platforms", v)}
        />

        <FilterGroup
          title="Data Sources"
          variant="datasource"
          options={dataSourceOptions}
          selected={selectedDataSources}
          toggle={(v) =>
            toggleValue(v, selectedDataSources, setSelectedDataSources)
          }
          getCount={(v) => getCountsForGroup("dataSources", v)}
        />

        <button
          type="button"
          onClick={() => {
            setSelectedContentTypes([])
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
        <div className="mb-4 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-[#8f9b85]" size={16} />
            <Input
              placeholder="Search queries, tags, platforms, or tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-2xl border-[#4e614e] bg-[#182018] pl-9 text-[#eef3e7] placeholder:text-[#8f9b85]"
            />
          </div>

          <div className="flex items-center">
            <div className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#4e614e] bg-[#182018] px-4 text-sm text-[#d7e2ce]">
              <ArrowUpDown size={16} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent outline-none"
              >
                <option value="title-asc">Title A–Z</option>
                <option value="title-desc">Title Z–A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-[#4e614e] bg-[#182018] p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-[#9cab91]">
              Total Queries
            </div>
            <div className="mt-2 text-2xl font-semibold text-[#eef3e7]">
              {queries.length}
            </div>
          </div>

          <div className="rounded-2xl border border-[#4e614e] bg-[#182018] p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-[#9cab91]">
              Filtered Results
            </div>
            <div className="mt-2 text-2xl font-semibold text-[#eef3e7]">
              {filtered.length}
            </div>
          </div>

          <div className="rounded-2xl border border-[#4e614e] bg-[#182018] p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-[#9cab91]">
              Active Filters
            </div>
            <div className="mt-2 text-2xl font-semibold text-[#eef3e7]">
              {activeFilters.length + (search.trim() ? 1 : 0)}
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mb-4 rounded-2xl border border-[#4e614e] bg-[#182018] p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#9cab91]">
              Selected Filters
            </div>

            <div className="flex flex-wrap gap-2">
              {search.trim().length > 0 && (
                <ActiveFilterChip
                  label={`Search: ${search}`}
                  onRemove={() => setSearch("")}
                />
              )}

              {activeFilters.map((filter) => (
                <ActiveFilterChip
                  key={filter.key}
                  label={filter.label}
                  onRemove={filter.remove}
                />
              ))}
            </div>
          </div>
        )}

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
                        {q.contentTypes.map((x) => (
                          <Pill key={`${q.id}-content-${x}`} variant="contenttype">
                            {formatLabel(x)}
                          </Pill>
                        ))}
                        {q.domains.map((x) => (
                          <Pill key={`${q.id}-domain-${x}`} variant="domain">
                            {formatLabel(x)}
                          </Pill>
                        ))}
                        {q.useCases.map((x) => (
                          <Pill key={`${q.id}-use-${x}`} variant="usecase">
                            {formatLabel(x)}
                          </Pill>
                        ))}
                        {q.platforms.map((x) => (
                          <Pill key={`${q.id}-platform-${x}`} variant="platform">
                            {formatLabel(x)}
                          </Pill>
                        ))}
                        {q.dataSources.map((x) => (
                          <Pill key={`${q.id}-source-${x}`} variant="datasource">
                            {x}
                          </Pill>
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
                              <Pill key={`${q.id}-tag-${tag}`} variant="tag">
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
                              <Pill key={`${q.id}-mitre-${mitre}`} variant="mitre">
                                {mitre}
                              </Pill>
                            ))}
                          </div>
                        </div>
                      )}

                      {(q.severity || q.author) && (
                        <div>
                          <SectionLabel>Details</SectionLabel>
                          <div className="flex flex-wrap gap-2">
                            {q.severity && (
                              <Pill variant="detail">{formatLabel(q.severity)}</Pill>
                            )}
                            {q.author && <Pill variant="detail">{q.author}</Pill>}
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