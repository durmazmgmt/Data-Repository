import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const PUBLIC_FEED = "https://charming-lapwing-610.eu-west-1.convex.site/repository/public"
export const BLOCKED_FIELDS = new Set([
  "sourceUrl",
  "sourceSystem",
  "contentJson",
  "ssn",
  "ein",
  "token",
  "secret",
  "password",
  "privateKey",
])

function findBlocked(value, pointer = "$") {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findBlocked(item, `${pointer}[${index}]`))
  }
  if (!value || typeof value !== "object") return []
  const violations = []
  for (const [key, child] of Object.entries(value)) {
    if (BLOCKED_FIELDS.has(key)) violations.push(`${pointer}.${key}`)
    violations.push(...findBlocked(child, `${pointer}.${key}`))
  }
  return violations
}

export function validatePublicRows(rows) {
  if (!Array.isArray(rows) || rows.length < 1) {
    throw new Error("Public feed must contain at least one record")
  }

  const keys = new Set()
  for (const [index, row] of rows.entries()) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new Error(`Public row ${index} must be an object`)
    }
    if (typeof row.key !== "string" || !row.key) {
      throw new Error(`Public row ${index} is missing a stable key`)
    }
    if (keys.has(row.key)) throw new Error(`Duplicate key in public feed: ${row.key}`)
    keys.add(row.key)

    const violations = findBlocked(row)
    if (violations.length) {
      throw new Error(`Blocked field detected in ${row.key}: ${violations.join(", ")}`)
    }
  }

  return rows
}

export function buildSnapshot(rows) {
  const safeRows = validatePublicRows(rows)
    .map((row) => ({ ...row, tags: Array.isArray(row.tags) ? [...row.tags] : [] }))
    .sort((a, b) => a.key.localeCompare(b.key))

  const updatedValues = safeRows
    .map((row) => row.updatedAt)
    .filter((value) => typeof value === "number" && Number.isFinite(value))
  const sourceUpdatedAtMax = updatedValues.length ? Math.max(...updatedValues) : 0

  return {
    snapshotVersion: "1.0.0",
    generatedFrom: "sanitized-public-feed",
    sourceUpdatedAtMax,
    generatedAt: sourceUpdatedAtMax ? new Date(sourceUpdatedAtMax).toISOString() : null,
    count: safeRows.length,
    items: safeRows,
  }
}

export async function fetchSnapshot(fetchImpl = fetch) {
  const response = await fetchImpl(PUBLIC_FEED, { headers: { accept: "application/json" } })
  if (!response.ok) throw new Error(`Public feed returned HTTP ${response.status}`)
  const payload = await response.json()
  const rows = Array.isArray(payload) ? payload : payload.items
  return buildSnapshot(rows)
}

async function main() {
  const outputPath = resolve(process.argv[2] || "public/repository.json")
  const snapshot = await fetchSnapshot()
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8")
  console.log(`Wrote ${snapshot.count} sanitized records to ${outputPath}`)
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : ""
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
