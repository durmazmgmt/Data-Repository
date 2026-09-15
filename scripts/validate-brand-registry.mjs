import { readFile } from "node:fs/promises"

const registryPath = new URL("../content/brands/registry.json", import.meta.url)
const required = new Set([
  "durmaz-holdings",
  "durmaz-management",
  "efg-accounting-group",
  "mobile-notary-hub",
  "durmaz-learning-academy",
  "tax-season-support",
  "addiction-skin-care",
  "durmaz-home-services",
  "maid-of-all-trades",
  "chic-chicago-homes",
])

function fail(message) {
  console.error(`Brand registry validation failed: ${message}`)
  process.exit(1)
}

let registry
try {
  registry = JSON.parse(await readFile(registryPath, "utf8"))
} catch (error) {
  fail(`unable to read registry (${error.message})`)
}

if (!Array.isArray(registry.brands)) fail("brands must be an array")

const keys = registry.brands.map((brand) => brand.key)
const keySet = new Set(keys)
if (keys.length !== keySet.size) fail("brand keys must be unique")
if (keySet.size !== required.size) fail(`expected ${required.size} brands, found ${keySet.size}`)
for (const key of required) if (!keySet.has(key)) fail(`missing required brand key: ${key}`)
for (const key of keySet) if (!required.has(key)) fail(`unexpected brand key: ${key}`)

const requiredFields = [
  "key", "legalName", "displayName", "tagline", "primaryLogoAssetKey",
  "palette", "typography", "buttonStyle", "cardStyle", "imageStyle",
  "logoBackgroundRule", "voice", "status",
]
for (const brand of registry.brands) {
  for (const field of requiredFields) {
    if (!(field in brand)) fail(`${brand.key ?? "unknown"} is missing ${field}`)
  }
  for (const token of ["primary", "secondary", "accent", "surface", "text", "muted"]) {
    if (!/^#[0-9A-F]{6}$/i.test(brand.palette?.[token] ?? "")) fail(`${brand.key} has invalid palette.${token}`)
  }
}

console.log(`Brand registry valid: ${registry.brands.length} approved brands.`)
