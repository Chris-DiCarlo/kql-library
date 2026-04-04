import fs from "fs"
import path from "path"
import { QueryItem } from "./types"

const queriesDir = path.join(process.cwd(), "content", "queries")

export function getAllQueries(): QueryItem[] {
  const files = fs.readdirSync(queriesDir)

  return files
    .filter((file) => file.endsWith(".json"))
    .filter((file) => !file.startsWith("_"))
    .map((file) => {
      const fullPath = path.join(queriesDir, file)
      const raw = fs.readFileSync(fullPath, "utf8")
      return JSON.parse(raw) as QueryItem
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getQueryById(id: string): QueryItem | undefined {
  return getAllQueries().find((q) => q.id === id)
}