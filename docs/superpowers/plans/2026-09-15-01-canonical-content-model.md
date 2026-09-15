# Canonical Content Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the normalized canonical website/content model to the existing Macaly/Convex repository without breaking the live `repositoryRecords` contract.

**Architecture:** Keep `repositoryRecords` unchanged for backward compatibility and add normalized tables for entities, brands, sites, pages, reusable content, provenance, versions, target mappings, audit events, and sync state. All administrative mutations remain authenticated/authorized; public queries expose only approved public fields.

**Tech Stack:** Macaly, Convex, TypeScript, TanStack Start, Vitest, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- Base44, Replit, and Lovable are read-only source systems.
- Do not change the public signatures of existing live Convex functions in `convex/repository.ts`.
- Public data must never include private source URLs, `contentJson`, credentials, client/tax data, or administrative metadata.
- Audience values are exactly `public`, `external_authenticated`, and `internal`.
- Lifecycle values are exactly `draft`, `review`, `approved`, `published`, and `archived`.
- Administrative access requires both authentication and authorization.

---

### Task 1: Add normalized schema tables

**Files:**
- Modify: `convex/schema.ts`
- Create: `convex/contentModel.ts`
- Test: `__tests__/content-model.test.ts`

**Interfaces:**
- Consumes: existing Convex schema and `repositoryRecords` table.
- Produces: shared validators `audienceValidator`, `lifecycleValidator`, `confidentialityValidator`, and stable normalized table names used by all later plans.

- [ ] **Step 1: Write the failing validator test**

```ts
import { describe, expect, it } from "vitest"
import { PUBLIC_AUDIENCE, LIFECYCLE_STATES } from "../convex/contentModel"

describe("canonical content constants", () => {
  it("keeps the approved audience and lifecycle contracts", () => {
    expect(PUBLIC_AUDIENCE).toEqual(["public", "external_authenticated", "internal"])
    expect(LIFECYCLE_STATES).toEqual(["draft", "review", "approved", "published", "archived"])
  })
})
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `npx vitest run __tests__/content-model.test.ts`

Expected: FAIL because `convex/contentModel.ts` does not exist.

- [ ] **Step 3: Add shared validators and tables**

`convex/contentModel.ts` must export the literal arrays and Convex validators for audience, lifecycle, and confidentiality. `convex/schema.ts` must preserve `repositoryRecords` exactly and add normalized tables for `entities`, `brands`, `sites`, `pages`, `contentBlocks`, `services`, `offers`, `forms`, `callsToAction`, `features`, `mediaAssets`, `navigation`, `testimonials`, `faqs`, `resources`, `courses`, `sourceDocuments`, `integrations`, `publishingTargets`, `brandThemes`, `versions`, `relationships`, `auditEvents`, and `syncStatus`.

Every canonical content table must contain or relate to: stable key, owning entity, audience, confidentiality, lifecycle, version, tags, source provenance, and timestamps.

- [ ] **Step 4: Verify schema and tests**

Run: `npx vitest run __tests__/content-model.test.ts && .sandbox/check-errors`

Expected: PASS with zero TypeScript/Tailwind errors.

- [ ] **Step 5: Commit**

Commit message: `feat: add canonical content model schema`

### Task 2: Add authorized CRUD and publication queries

**Files:**
- Create: `convex/content.ts`
- Modify: `convex/authz.ts`
- Test: `__tests__/content-access.test.ts`

**Interfaces:**
- Consumes: normalized tables and existing admin authorization helper.
- Produces: `content.listAdmin`, `content.getByKey`, `content.upsert`, `content.archive`, and `content.listPublished`.

- [ ] **Step 1: Write failing access-policy tests**

```ts
import { describe, expect, it } from "vitest"
import { canPublishToTarget } from "../convex/content"

describe("audience publication policy", () => {
  it("prevents internal content from flowing to public targets", () => {
    expect(canPublishToTarget("internal", "google_sites")).toBe(false)
    expect(canPublishToTarget("internal", "sharepoint_internal")).toBe(true)
    expect(canPublishToTarget("external_authenticated", "sharepoint_external")).toBe(true)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run __tests__/content-access.test.ts`

Expected: FAIL because publication-policy functions do not exist.

- [ ] **Step 3: Implement minimal policy and CRUD**

Implement a pure `canPublishToTarget(audience, target)` policy plus Convex queries/mutations. Admin list/get/upsert/archive must call the existing authorization helper. `listPublished` must return only records whose lifecycle is `approved` or `published` and whose audience is allowed for the requested target.

- [ ] **Step 4: Verify**

Run: `npx vitest run __tests__/content-access.test.ts && .sandbox/check-errors`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add authorized canonical content operations`

### Task 3: Add migration/seed bridge from legacy records

**Files:**
- Modify: `convex/migrations.ts`
- Create: `convex/contentSeed.ts`
- Test: `__tests__/content-migration.test.ts`

**Interfaces:**
- Consumes: existing `repositoryRecords` and normalized tables.
- Produces: idempotent seed/migration routine for the seven approved public baseline records and two internal platform records without deleting legacy rows.

- [ ] **Step 1: Write failing idempotency test**

```ts
import { describe, expect, it } from "vitest"
import { normalizeLegacyRecord } from "../convex/contentSeed"

describe("legacy normalization", () => {
  it("maps public legacy visibility to public audience", () => {
    const result = normalizeLegacyRecord({ key: "durmaz-holdings", name: "Durmaz Holdings LLC", visibility: "public", status: "active" })
    expect(result.audience).toBe("public")
    expect(result.lifecycle).toBe("approved")
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run __tests__/content-migration.test.ts`

- [ ] **Step 3: Implement normalization and idempotent seed**

Map legacy `public` to audience `public`, legacy `internal` to `internal`, active public records to `approved`, and platform integrations to `internal`. Never delete or rewrite `repositoryRecords`; create/update normalized records by stable key only.

- [ ] **Step 4: Deploy to Convex compatibility preflight**

Run: `.sandbox/deploy-convex-app`

Expected: `Live deployed. The public Convex contract is backward-compatible.`

- [ ] **Step 5: Verify all checks**

Run: `npx vitest run && .sandbox/check-errors`

Expected: all tests pass and zero type/style errors.

- [ ] **Step 6: Commit**

Commit message: `feat: migrate legacy repository records into canonical model`
