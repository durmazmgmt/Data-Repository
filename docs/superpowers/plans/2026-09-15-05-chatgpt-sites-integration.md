# ChatGPT Sites Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ChatGPT Sites portfolio consume the same canonical content/brand model as Google Sites and GitHub, while preserving richer interactive experiences.

**Architecture:** Publish a target-safe site manifest and canonical read API from Convex. ChatGPT Sites consume brand, navigation, page, service, FAQ, resource, course, CTA, and form configuration by stable keys rather than duplicating copy. Interactive tools may call authenticated backend functions; secrets remain server-side.

**Tech Stack:** Convex HTTP/query layer, JSON manifests, ChatGPT Sites project configurations, GitHub validation.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- ChatGPT Sites are downstream consumers, not the canonical database.
- Public sites receive only public-approved records.
- Client/admin features require authenticated APIs and may not reuse public endpoints for private data.
- Do not modify Base44, Replit, or Lovable.

---

### Task 1: Define the ChatGPT Sites target contract

**Files:**
- Create: `integrations/chatgpt-sites/manifest.json`
- Create: `integrations/chatgpt-sites/site-map.json`
- Create: `schemas/chatgpt-site.schema.json`
- Create: `scripts/validate-chatgpt-sites.mjs`

**Interfaces:**
- Consumes: canonical brand/site/page/service/resource/course keys.
- Produces: per-site target manifests with allowed features and canonical content references.

- [ ] **Step 1: Write failing validator**

Require each ChatGPT Site target to have `siteKey`, `brandKey`, `audience`, `pageKeys`, `featureKeys`, `contentSource`, and `status`. Reject `internal` audience in public site manifests and reject inline secrets/tokens.

- [ ] **Step 2: Run and confirm failure**

Run: `node scripts/validate-chatgpt-sites.mjs`

Expected: FAIL before manifests exist.

- [ ] **Step 3: Add target manifests**

Create entries for the approved portfolio sites, including Durmaz Mgmt, EFG Accounting Group, MobileNotaryHub, TaxSeasonSupport, Addiction Skin Care, Durmaz Learning Academy, Durmaz Home Services, Maid of All Trades, Chic Chicago Homes, and the Durmaz Holdings portfolio hub.

- [ ] **Step 4: Validate**

Run: `node scripts/validate-chatgpt-sites.mjs && node scripts/validate-public-content.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add ChatGPT Sites target contracts`

### Task 2: Add a canonical site-consumption API

**Files:**
- Create: `convex/siteDelivery.ts`
- Modify: `convex/http.ts`
- Test: `__tests__/site-delivery.test.ts`

**Interfaces:**
- Consumes: normalized canonical tables from Plan 01.
- Produces: `GET /sites/public/{siteKey}`-equivalent HTTP route or query that returns one assembled, sanitized public site payload.

- [ ] **Step 1: Write failing sanitizer test**

```ts
import { describe, expect, it } from "vitest"
import { sanitizePublicSitePayload } from "../convex/siteDelivery"

it("removes restricted source metadata", () => {
  const result = sanitizePublicSitePayload({ key: "x", sourceUrl: "private", sourceSystem: "drive", contentJson: "secret" })
  expect(result).not.toHaveProperty("sourceUrl")
  expect(result).not.toHaveProperty("sourceSystem")
  expect(result).not.toHaveProperty("contentJson")
})
```

- [ ] **Step 2: Implement assembler and public route**

The assembler resolves brand, navigation, pages, content blocks, services, FAQs, resources, courses, forms, and CTAs by stable keys; only approved/published public records are returned.

- [ ] **Step 3: Verify backward compatibility**

Run: `npx vitest run __tests__/site-delivery.test.ts && .sandbox/deploy-convex-app && .sandbox/check-errors`

Expected: tests pass and live Convex contract remains backward-compatible.

- [ ] **Step 4: Commit**

Commit message: `feat: add sanitized canonical site delivery API`

### Task 3: Prepare site-specific feature mappings

**Files:**
- Create: `integrations/chatgpt-sites/features.json`
- Create: `integrations/chatgpt-sites/implementation-checklist.md`

**Interfaces:**
- Consumes: verified reusable source-system patterns and target manifests.
- Produces: explicit feature assignments without copying private source data.

- [ ] **Step 1: Map verified patterns**

Examples: professional-service sites may receive guided intake, scheduling, resource library, service estimator, and client-access entry point; Durmaz Learning Academy may receive catalog filtering, study resources, assessments, and certification alignment. Do not mark an unverified Replit feature as implemented.

- [ ] **Step 2: Define authenticated boundary**

Any portal feature (`documents`, `tasks`, `messages`, `engagement status`, `clarifications`) must be marked `requiresAuthenticatedBackend: true` and must not map to the public site delivery endpoint.

- [ ] **Step 3: Validate and commit**

Run: `node scripts/validate-chatgpt-sites.mjs`

Expected: PASS.

Commit message: `docs: add ChatGPT Sites feature mappings`
