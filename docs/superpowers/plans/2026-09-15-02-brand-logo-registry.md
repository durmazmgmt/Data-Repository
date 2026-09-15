# Brand and Logo Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the approved uploaded logos and entity identities into canonical brand records and reusable design tokens for all downstream sites.

**Architecture:** Store brand metadata and media references in Convex, while GitHub holds only public-safe token files and asset manifests. Exact image binaries remain in controlled media/storage systems; public URLs are recorded only after the asset is intentionally published.

**Tech Stack:** Convex, TypeScript, GitHub JSON manifests, Python color sampling for source artwork, Macaly media assets/Google Drive references.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- Uploaded logos are authoritative for the ten approved brands.
- Never embed image binaries as base64 in source files.
- GitHub is public; only publish-safe media URLs and design tokens may be committed.
- Brand records use controlled legal/display names from the approved entity register.
- Base44, Replit, and Lovable are not modified.

---

### Task 1: Define the canonical brand registry

**Files:**
- Create: `content/brands/registry.json`
- Create: `schemas/brand.schema.json`
- Create: `assets/brand-tokens/portfolio.json`
- Test: `scripts/validate-brand-registry.mjs`

**Interfaces:**
- Consumes: normalized `brands`, `brandThemes`, and `mediaAssets` tables from Plan 01.
- Produces: stable public brand keys and token objects consumed by Google Sites, ChatGPT Sites, and SharePoint packages.

- [ ] **Step 1: Write the validation script first**

The script must fail unless the registry contains exactly these stable keys: `durmaz-holdings`, `durmaz-management`, `efg-accounting-group`, `mobile-notary-hub`, `durmaz-learning-academy`, `tax-season-support`, `addiction-skin-care`, `durmaz-home-services`, `maid-of-all-trades`, and `chic-chicago-homes`.

```js
const required = new Set([
  "durmaz-holdings", "durmaz-management", "efg-accounting-group",
  "mobile-notary-hub", "durmaz-learning-academy", "tax-season-support",
  "addiction-skin-care", "durmaz-home-services", "maid-of-all-trades",
  "chic-chicago-homes"
])
```

- [ ] **Step 2: Run and confirm failure**

Run: `node scripts/validate-brand-registry.mjs`

Expected: FAIL because the registry does not yet exist.

- [ ] **Step 3: Add brand schema and records**

Each public brand record must include: `key`, `legalName`, `displayName`, `tagline`, `primaryLogoAssetKey`, `palette`, `typography`, `buttonStyle`, `cardStyle`, `imageStyle`, `logoBackgroundRule`, `voice`, and `status`.

- [ ] **Step 4: Validate**

Run: `node scripts/validate-brand-registry.mjs`

Expected: PASS for all ten brands.

- [ ] **Step 5: Commit**

Commit message: `feat: add canonical brand registry`

### Task 2: Sample and normalize brand colors from approved artwork

**Files:**
- Create: `scripts/extract-brand-palette.py`
- Modify: `assets/brand-tokens/portfolio.json`
- Create: `docs/brand-system.md`

**Interfaces:**
- Consumes: the ten uploaded source logos supplied in the approved conversation.
- Produces: deterministic sRGB hex tokens and documented usage rules.

- [ ] **Step 1: Implement deterministic palette extraction**

The script must resize each source image, ignore near-white/transparent pixels, cluster remaining RGB pixels, and output the top representative colors with counts. Do not modify the original files.

- [ ] **Step 2: Run against all supplied logo files**

Expected: machine-generated palette candidates for all ten brands.

- [ ] **Step 3: Normalize tokens**

For each brand, commit semantic tokens named `primary`, `secondary`, `accent`, `surface`, `text`, and `muted`. Preserve the approved visual families: navy/gold, black/gold, green/gold, rose-gold/green, and blue/green as applicable.

- [ ] **Step 4: Document contrast rules**

`docs/brand-system.md` must specify logo-safe backgrounds, text contrast requirements, and which metallic-looking colors are represented as flat web-safe approximations.

- [ ] **Step 5: Commit**

Commit message: `feat: add sampled brand design tokens`

### Task 3: Seed brand records into the canonical backend

**Files:**
- Create: `convex/brandSeed.ts`
- Modify: `convex/migrations.ts`
- Test: `__tests__/brand-seed.test.ts`

**Interfaces:**
- Consumes: GitHub-safe registry fields and canonical entity keys.
- Produces: idempotent Convex brand/theme/media metadata records.

- [ ] **Step 1: Write failing idempotency test**

```ts
import { describe, expect, it } from "vitest"
import { brandSeedKeys } from "../convex/brandSeed"

it("contains each approved brand exactly once", () => {
  expect(new Set(brandSeedKeys).size).toBe(10)
  expect(brandSeedKeys.length).toBe(10)
})
```

- [ ] **Step 2: Implement seed data keyed by stable brand key**

Do not seed unpublished local file paths. Media references must use stable asset keys and may leave the public URL absent until an intentional media publish occurs.

- [ ] **Step 3: Verify and deploy**

Run: `npx vitest run __tests__/brand-seed.test.ts && .sandbox/deploy-convex-app && .sandbox/check-errors`

Expected: tests pass, compatibility preflight passes, and no type/style errors.

- [ ] **Step 4: Commit**

Commit message: `feat: seed canonical brand metadata`
