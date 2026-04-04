export type QueryItem = {
  id: string
  title: string
  description: string
  query: string
  contentTypes: string[]
  domains: string[]
  useCases: string[]
  platforms: string[]
  dataSources: string[]
  tags: string[]
  mitreTechniques?: string[]
  severity?: "low" | "medium" | "high"
  author?: string
}