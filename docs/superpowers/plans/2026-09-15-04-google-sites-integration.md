# Google Sites Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide a reproducible, secure Google Sites integration that displays approved canonical public content without giving Google Sites write credentials or private backend access.

**Architecture:** Extend the existing GitHub-hosted bridge and Google Sites manifest/content map. Google Sites remains a presentation consumer: it embeds the bridge or uses controlled generated content, while the canonical content lives in Convex and sanitized snapshots live in GitHub.

**Tech Stack:** GitHub static HTML/CSS/JS, Convex public endpoint, Google Drive documentation, Google Sites embed workflow.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- Direct Google Sites editing is not exposed by the current connector; implementation must use bridge/embed/export patterns.
- Google Sites receives public content only.
- No admin tokens, cookies, private source URLs, or backend write operations in browser code.
- Bridge rendering must use safe DOM APIs (`textContent`) and a restrictive CSP.

---

### Task 1: Expand the Google Sites content map by brand/site

**Files:**
- Modify: `integrations/google-sites/manifest.json`
- Modify: `integrations/google-sites/content-map.json`
- Modify: `integrations/google-sites/README.md`
- Test: `scripts/validate-google-sites-map.mjs`

**Interfaces:**
- Consumes: canonical site/brand keys and public snapshot contract.
- Produces: a deterministic map from canonical site sections to Google Sites pages/embeds.

- [ ] **Step 1: Write failing map validator**

The validator must require every mapped site to reference a known brand key, only `public` audience content, and a supported component type from `hero`, `services`, `resources`, `faq`, `cta`, `contact`, `courses`, or `portfolio`.

- [ ] **Step 2: Run and confirm current map gaps**

Run: `node scripts/validate-google-sites-map.mjs`

Expected: FAIL until the expanded content map is compliant.

- [ ] **Step 3: Expand manifest and content map**

Add mappings for the approved public portfolio brands and mark unavailable/not-yet-public destinations explicitly as `publicationStatus: "prepared"` rather than inventing live URLs.

- [ ] **Step 4: Validate**

Run: `node scripts/validate-google-sites-map.mjs && node scripts/validate-public-content.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: expand Google Sites canonical content map`

### Task 2: Make the static bridge brand-aware

**Files:**
- Modify: `docs/index.html`
- Modify: `docs/app.js`
- Modify: `docs/styles.css`
- Test: `.github/workflows/deploy-google-sites-bridge.yml`

**Interfaces:**
- Consumes: canonical public endpoint, brand tokens, and Google Sites content map.
- Produces: embeddable read-only views selected by query parameters such as `?site=durmaz-management&view=services`.

- [ ] **Step 1: Add a failing bridge-package validation case**

Update CI validation so it fails if the bridge lacks a safe site/view selector, uses `innerHTML` with remote content, or attempts a non-GET request to the canonical endpoint.

- [ ] **Step 2: Implement site/view routing in the bridge**

Only allow site/view values present in the committed content map. Unknown values render a neutral not-found state and do not expose raw payloads.

- [ ] **Step 3: Apply canonical brand tokens**

Load only approved static token values from the repository; do not load arbitrary CSS or style strings from remote data.

- [ ] **Step 4: Verify the workflow**

Run the GitHub Actions workflow. Expected: bridge package validation passes, public feed security validation passes, artifact uploads, and deployment is either successful or explicitly skipped if Pages is still disabled.

- [ ] **Step 5: Commit**

Commit message: `feat: make Google Sites bridge brand aware`

### Task 3: Produce the Google Sites operator package

**Files:**
- Create: `integrations/google-sites/embed-catalog.json`
- Create: `integrations/google-sites/implementation-checklist.md`
- Update: Google Drive document `Durmaz Cross-Platform Web, Google Sites & SharePoint Content Master v1.0`

**Interfaces:**
- Consumes: validated bridge views.
- Produces: exact embed catalog and reproducible operator steps for the Google Sites editor.

- [ ] **Step 1: Generate one embed definition per approved public site/view**

Each definition must include `brandKey`, `pageRole`, `bridgePath`, `audience`, `minimumEmbedHeight`, and `status`.

- [ ] **Step 2: Add operator checklist**

Checklist must cover inserting the embed URL, responsive sizing, accessibility title, verifying HTTPS, testing mobile/desktop, and confirming no private data appears.

- [ ] **Step 3: Synchronize the controlled Google Drive implementation guide**

Update the existing cross-platform master document to reference the canonical repository and current embed catalog rather than duplicating site copy.

- [ ] **Step 4: Verify**

Run both Google map and public-content validators. Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `docs: add Google Sites implementation package`
