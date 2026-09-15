# SharePoint Internal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare and, when tenant support permits, deploy a secure internal Durmaz SharePoint experience for governance, source documents, SOPs, brand/site review, curriculum, integrations, and audit information.

**Architecture:** The internal SharePoint experience receives only `internal` and specifically approved governance records from the canonical repository. GitHub holds a public-safe provisioning blueprint with no secrets; private source documents remain in controlled storage. Live site provisioning is conditional on an available SharePoint Online tenant and supported connector actions.

**Tech Stack:** Microsoft SharePoint/Graph, GitHub JSON manifests, Convex target mappings, Microsoft identity controls.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- Internal and external SharePoint experiences are separate security boundaries.
- Do not expose internal libraries to guests by inheritance.
- The currently connected Microsoft tenant may not have a usable SharePoint Online license; package preparation must complete independently of live provisioning.
- GitHub files contain structure and metadata only, never private documents or credentials.

---

### Task 1: Split the existing SharePoint blueprint into internal/external contracts

**Files:**
- Modify: `integrations/sharepoint/site-blueprint.json`
- Create: `integrations/sharepoint/internal-site.json`
- Create: `integrations/sharepoint/security-model.json`
- Create: `scripts/validate-sharepoint-blueprints.mjs`

**Interfaces:**
- Consumes: current combined blueprint and canonical audience model.
- Produces: explicit `sharepoint_internal` provisioning contract and security model.

- [ ] **Step 1: Write failing validator**

Validator must require the internal site to contain these top-level areas: `Executive Dashboard`, `Entity Directory`, `Business Plans`, `Website & Brand Governance`, `Source Documents`, `SOPs & Templates`, `Marketing Assets`, `Learning & Curriculum Repository`, `Publishing Review Queue`, `Integrations & Systems`, and `Audit & Change History`.

- [ ] **Step 2: Run and confirm failure**

Run: `node scripts/validate-sharepoint-blueprints.mjs`

- [ ] **Step 3: Add internal site and security contracts**

Security contract must require Microsoft-authenticated membership, deny anonymous access, separate owners/members/visitors, and mark external guests as prohibited by default.

- [ ] **Step 4: Validate**

Run: `node scripts/validate-sharepoint-blueprints.mjs && node scripts/validate-public-content.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: define internal SharePoint provisioning contract`

### Task 2: Define internal libraries, metadata, and canonical mappings

**Files:**
- Create: `integrations/sharepoint/internal-libraries.json`
- Create: `integrations/sharepoint/internal-content-map.json`
- Modify: `integrations/sharepoint/README.md`

**Interfaces:**
- Consumes: canonical entity, brand, source-document, version, audit, and sync records.
- Produces: document-library definitions and mapping rules.

- [ ] **Step 1: Add library definitions**

Required libraries: `Business Plans`, `Source Documents`, `SOPs and Templates`, `Marketing Assets`, `Learning and Curriculum`, and `Website Governance`.

Each definition must include: allowed audience, retention intent, required metadata (`entityKey`, `documentType`, `version`, `approvalStatus`, `sourceSystem`, `lastReviewedAt`), and guest-access policy.

- [ ] **Step 2: Add content mappings**

Map canonical internal/governance records to libraries/pages without placing private file bodies in GitHub.

- [ ] **Step 3: Validate and commit**

Run: `node scripts/validate-sharepoint-blueprints.mjs`

Expected: PASS.

Commit message: `feat: add internal SharePoint libraries and mappings`

### Task 3: Attempt live tenant deployment only when supported

**Files:**
- Create: `integrations/sharepoint/internal-deployment-checklist.md`

**Interfaces:**
- Consumes: validated provisioning package and Microsoft connector availability.
- Produces: either a verified live internal site/library structure or a precise blocked-state record.

- [ ] **Step 1: Resolve the intended SharePoint hostname/site path using the Microsoft connector**

If `get_site` or equivalent reports no SharePoint Online tenant/license, record status as `blocked_by_tenant_license` and do not claim a live deployment.

- [ ] **Step 2: When a valid site exists, enumerate site-scoped document libraries**

Use `list_site_drives` and compare actual libraries to `internal-libraries.json`.

- [ ] **Step 3: Create permitted folder structure and upload only approved package documents**

Use SharePoint connector write operations only after exact site/library targets are resolved. Never upload GitHub secrets or private source material not approved for that destination.

- [ ] **Step 4: Verify permissions and structure**

Confirm anonymous access is absent and external guests do not inherit internal library access.

- [ ] **Step 5: Commit deployment record**

Commit message: `docs: record internal SharePoint deployment status`
