import { readFile, stat } from "node:fs/promises"
import { extname, join, relative } from "node:path"
import { readdir } from "node:fs/promises"

const roots = ["content", "assets/brand-tokens", "manifests", "integrations", "public"]
const requiredFiles = [
  "content/entities/index.json",
  "content/sites/index.json",
  "content/services/index.json",
  "content/courses/index.json",
  "content/resources/index.json",
  "schemas/public-record.schema.json",
  "manifests/repository.json",
]
const blockedKeys = new Set([
  "sourceUrl", "contentJson", "sourceSystem", "ssn", "ein", "token",
  "secret", "password", "privateKey", "internal",
])

async function exists(path) {
  try { await stat(path); return true } catch { return false }
}

async function jsonFiles(root) {
  if (!(await exists(root))) return []
  const output = []
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) await walk(path)
      else if (entry.isFile() && extname(entry.name).toLowerCase() === ".json") output.push(path)
    }
  }
  await walk(root)
  return output
}

function inspect(value, file, pointer = "$") {
  const errors = []
  if (Array.isArray(value)) {
    value.forEach((item, index) => errors.push(...inspect(item, file, `${pointer}[${index}]`)))
    return errors
  }
  if (!value || typeof value !== "object") return errors
  for (const [key, child] of Object.entries(value)) {
    if (blockedKeys.has(key)) errors.push(`${file}: blocked key ${pointer}.${key}`)
    errors.push(...inspect(child, file, `${pointer}.${key}`))
  }
  return errors
}

const errors = []
for (const path of requiredFiles) {
  if (!(await exists(path))) errors.push(`missing required distribution file: ${path}`)
}

let checked = 0
for (const root of roots) {
  for (const file of await jsonFiles(root)) {
    try {
      const value = JSON.parse(await readFile(file, "utf8"))
      errors.push(...inspect(value, relative(process.cwd(), file)))
      checked += 1
    } catch (error) {
      errors.push(`${file}: invalid JSON (${error.message})`)
    }
  }
}

if (errors.length) {
  console.error("Public content validation failed:")
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Public content validation passed for ${checked} JSON files.`)
