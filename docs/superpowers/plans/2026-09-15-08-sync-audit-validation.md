# Cross-Platform Synchronization, Audit, and Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add observable, auditable synchronization state across GitHub, Google Sites, ChatGPT Sites, and SharePoint targets while preserving source provenance and the read-only status of Base44/Replit/Lovable.

**Architecture:** Convex owns sync and audit records. GitHub receives sanitized status summaries only. Source-system inventory jobs read metadata/content for classification but never write back. Each target sync is independent so one target failure never rolls back the canonical approved record.

**Tech Stack:** Convex, TypeScript, Node validation scripts, GitHub Actions, connector-based source inventory.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- Base44, Replit, and Lovable are read-only.
- Sync failures are isolated per target.
- Public GitHub status summaries contain no private error payloads, tokens, source URLs, or client data.
- Historical versions and audit events are append-oriented and remain queryable.

---

### Task 1: Implement sync-status and audit mutations

**Files:**
- Create: `convex/sync.ts`
- Create: `convex/audit.ts`
- Test: `__tests__/sync-policy.test.ts`

**Interfaces:**
- Consumes: `syncStatus`, `auditEvents`, `versions`, and `publishingTargets` tables from Plan 01.
- Produces: `sync.begin`, `sync.succeed`, `sync.fail`, `sync.listForRecord`, and `audit.listForRecord` with admin authorization where required.

- [ ] **Step 1: Write failing state-transition tests**

```ts
import { describe, expect, it } from "vitest"
import { nextSyncState } from "../convex/sync"

describe("sync state", () => {
  it("does not convert a canonical record failure into an archive", () => {
    expect(nextSyncState("pending", "target_failed")).toBe("failed")
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run __tests__/sync-policy.test.ts`

- [ ] **Step 3: Implement target-independent sync transitions**

Allowed target states are exactly `pending`, `success`, `partial`, and `failed`. Store `target`, `canonicalVersion`, `lastAttemptedAt`, `lastSuccessfulAt`, `status`, `errorSummary`, and `retryEligible`. Never mutate the canonical content lifecycle merely because a target sync failed.

- [ ] **Step 4: Implement append-oriented audit events**

Audit events must capture action, record key, actor identity when available, target, version, timestamp, and sanitized summary. Public endpoints must not expose actor email or private error details.

- [ ] **Step 5: Verify and deploy**

Run: `npx vitest run __tests__/sync-policy.test.ts && .sandbox/deploy-convex-app && .sandbox/check-errors`

Expected: PASS and backward-compatible Convex deployment.

- [ ] **Step 6: Commit**

Commit message: `feat: add target sync and audit tracking`

### Task 2: Add read-only source-system inventory refresh

**Files:**
- Modify: `integrations/builders/registry.json`
- Create: `integrations/builders/inventory-policy.json`
- Create: `scripts/validate-builder-registry.mjs`

**Interfaces:**
- Consumes: read-only connector results from Base44, Replit, and Lovable.
- Produces: sanitized inventory metadata and verified feature/source classifications.

- [ ] **Step 1: Define inventory policy**

Each source entry must contain `platform`, `sourceId`, `name`, `portfolioStatus`, `inspectionStatus`, `lastInspectedAt`, `verifiedPatterns`, `reusePolicy`, and `writePolicy: "read_only"`.

- [ ] **Step 2: Validate read-only policy**

The validator must fail if any source-system registry entry has a write policy other than `read_only` or if unverified features are placed in `verifiedPatterns`.

- [ ] **Step 3: Refresh inventory using connectors**

List Base44 apps, Replit apps, and Lovable projects. Inspect content only through read/list/question tools. Do not call edit/update/send-message mutation tools on those source apps.

- [ ] **Step 4: Validate and commit**

Run: `node scripts/validate-builder-registry.mjs && node scripts/validate-public-content.mjs`

Expected: PASS.

Commit message: `docs: refresh read-only builder source inventory`

### Task 3: Add cross-platform release validation

**Files:**
- Create: `scripts/validate-cross-platform-release.mjs`
- Create: `.github/workflows/validate-cross-platform-release.yml`
- Create: `manifests/release-status.json`

**Interfaces:**
- Consumes: all validators from Plans 02-07 and the live public feed.
- Produces: one release gate and a sanitized release-status summary.

- [ ] **Step 1: Implement aggregate validator**

Run these checks in order: brand registry, public content safety, Google Sites map, ChatGPT Sites map, SharePoint blueprints, builder registry, live public feed safety, and static bridge package presence.

- [ ] **Step 2: Add CI workflow**

The workflow runs on `main` and pull requests affecting any cross-platform package. A failure in any safety validator fails CI. A missing SharePoint tenant does not fail the package-validation job; it is represented as a deployment capability state.

- [ ] **Step 3: Generate sanitized release status**

`manifests/release-status.json` may contain component names, versions, validation state, and deployment capability. It must not include secrets, private URLs, user emails, or client data.

- [ ] **Step 4: Verify full release gate**

Run: `node scripts/validate-cross-platform-release.mjs`

Expected: PASS before merging/publishing any coordinated release.

- [ ] **Step 5: Commit**

Commit message: `ci: add cross-platform release validation gate`

### Task 4: Final acceptance verification

**Files:**
- Create: `docs/implementation-verification.md`

**Interfaces:**
- Consumes: all eight implementation plans and the approved design spec.
- Produces: evidence checklist for the twelve design acceptance criteria.

- [ ] **Step 1: Verify every acceptance criterion with fresh evidence**

Record the exact command/tool result that proves each criterion. Do not mark a criterion complete on inference alone.

- [ ] **Step 2: Confirm source systems were not modified**

Compare source app update timestamps/commits where available against the inventory-only session actions and record that no mutation tools were invoked.

- [ ] **Step 3: Confirm public data safety**

Re-fetch the live public endpoint and run the blocked-field validator. Confirm only approved public records are returned.

- [ ] **Step 4: Commit final verification record**

Commit message: `docs: add cross-platform implementation verification`
