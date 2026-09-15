# GitHub Distribution Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `durmazmgmt/Data-Repository` into the sanitized, version-controlled distribution layer for canonical public website content and integration manifests.

**Architecture:** GitHub stores schemas, approved public snapshots, brand tokens, target manifests, source-system inventory metadata, and CI validation. It never becomes the canonical private database and never stores client/tax/private operational data.

**Tech Stack:** GitHub, JSON/JSON Schema, Node.js validation scripts, GitHub Actions, static bridge in `docs/`.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- Repository visibility is public.
- No secrets, credentials, private source URLs, client records, tax identifiers, private documents, or admin-only payloads.
- Existing GitHub bridge validation must remain green.
- Base44/Replit/Lovable content is represented only as sanitized source inventory and verified reusable concepts.

---

### Task 1: Create canonical public directory structure and schemas

**Files:**
- Create: `content/entities/index.json`
- Create: `content/sites/index.json`
- Create: `content/services/index.json`
- Create: `content/courses/index.json`
- Create: `content/resources/index.json`
- Create: `schemas/public-record.schema.json`
- Create: `manifests/repository.json`

**Interfaces:**
- Consumes: public-approved canonical backend records.
- Produces: portable static snapshots and schemas for target consumers.

- [ ] **Step 1: Create a failing repository validator**

Create `scripts/validate-public-content.mjs` that recursively scans `content/`, `assets/brand-tokens/`, `manifests/`, and `integrations/` and fails on blocked keys: `sourceUrl`, `contentJson`, `sourceSystem`, `ssn`, `ein`, `token`, `secret`, `password`, `privateKey`, or any field explicitly marked `internal`.

- [ ] **Step 2: Run and establish baseline**

Run: `node scripts/validate-public-content.mjs`

Expected: FAIL until the new structure and allowed manifests are present and compliant.

- [ ] **Step 3: Add the sanitized indexes and repository manifest**

Each exported record must use stable keys and include only fields permitted by its public JSON schema.

- [ ] **Step 4: Re-run validator**

Run: `node scripts/validate-public-content.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add sanitized public distribution structure`

### Task 2: Add deterministic public snapshot generation

**Files:**
- Create: `scripts/build-public-snapshot.mjs`
- Create: `public/repository.json`
- Modify: `manifests/repository.json`

**Interfaces:**
- Consumes: canonical public endpoint and static brand registry.
- Produces: deterministic `public/repository.json` with generation metadata and no restricted fields.

- [ ] **Step 1: Write snapshot contract assertions**

The script must require HTTP 200, `count >= 1`, unique keys, and absence of blocked fields before writing any file.

- [ ] **Step 2: Build snapshot**

Run: `node scripts/build-public-snapshot.mjs`

Expected: `public/repository.json` containing only approved public records.

- [ ] **Step 3: Run validator**

Run: `node scripts/validate-public-content.mjs`

Expected: PASS.

- [ ] **Step 4: Commit**

Commit message: `feat: add deterministic public repository snapshot`

### Task 3: Harden CI around content safety and bridge deployment

**Files:**
- Modify: `.github/workflows/deploy-google-sites-bridge.yml`
- Create: `.github/workflows/validate-repository-content.yml`

**Interfaces:**
- Consumes: validation scripts from Tasks 1-2.
- Produces: a required CI safety gate independent of whether GitHub Pages is enabled.

- [ ] **Step 1: Add content-validation workflow**

The workflow must run on pushes and pull requests affecting `content/**`, `assets/**`, `manifests/**`, `integrations/**`, `public/**`, `scripts/**`, or the workflow itself. It must run `node scripts/validate-public-content.mjs` and verify the live public feed contains no blocked fields.

- [ ] **Step 2: Keep Pages deployment non-fatal before repository Pages enablement**

Do not regress the current resilient behavior: package validation and artifact creation remain successful even if repository Pages is not provisioned.

- [ ] **Step 3: Verify workflow syntax and current bridge package**

Run the workflow on `main` and inspect job steps. Expected: repository validation succeeds, bridge package succeeds, Pages deployment either succeeds or is explicitly skipped for the known repository-level Pages setting.

- [ ] **Step 4: Commit**

Commit message: `ci: enforce public repository content safety`
