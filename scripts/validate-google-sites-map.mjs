import { readFile } from "node:fs/promises"

const allowedComponents = new Set(["hero", "services", "resources", "faq", "cta", "contact", "courses", "portfolio"])
const allowedPublication = new Set(["active", "prepared"])

const brands = JSON.parse(await readFile(new URL("../content/brands/registry.json", import.meta.url), "utf8"))
const contentMap = JSON.parse(await readFile(new URL("../integrations/google-sites/content-map.json", import.meta.url), "utf8"))
const knownBrands = new Set(brands.brands.map((brand) => brand.key))

const errors = []
if (!Array.isArray(contentMap.sites) || contentMap.sites.length === 0) {
  errors.push("content map must contain a non-empty sites array")
} else {
  const siteKeys = new Set()
  for (const site of contentMap.sites) {
    if (!site.siteKey) errors.push("mapped site is missing siteKey")
    if (siteKeys.has(site.siteKey)) errors.push(`duplicate siteKey: ${site.siteKey}`)
    siteKeys.add(site.siteKey)
    if (!knownBrands.has(site.brandKey)) errors.push(`${site.siteKey}: unknown brandKey ${site.brandKey}`)
    if (site.audience !== "public") errors.push(`${site.siteKey}: audience must be public`)
    if (!allowedPublication.has(site.publicationStatus)) errors.push(`${site.siteKey}: invalid publicationStatus`)
    if (!Array.isArray(site.pages) || site.pages.length === 0) errors.push(`${site.siteKey}: pages must be non-empty`)
    for (const page of site.pages ?? []) {
      if (!page.pageRole) errors.push(`${site.siteKey}: page is missing pageRole`)
      if (!allowedComponents.has(page.component)) errors.push(`${site.siteKey}/${page.pageRole}: unsupported component ${page.component}`)
      if (!page.view) errors.push(`${site.siteKey}/${page.pageRole}: view is required`)
    }
  }
}

if (errors.length) {
  console.error("Google Sites content-map validation failed:")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`Google Sites content map valid: ${contentMap.sites.length} mapped site(s).`)
