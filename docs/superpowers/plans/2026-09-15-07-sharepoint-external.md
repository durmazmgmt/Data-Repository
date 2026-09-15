# SharePoint External Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare and, when tenant support permits, deploy a separate authenticated SharePoint experience for approved client/partner collaboration and resource delivery.

**Architecture:** The external SharePoint experience consumes only records classified `external_authenticated` plus explicitly approved public resources. It has its own site/library structure and guest-access controls; it does not inherit internal SharePoint libraries or permissions.

**Tech Stack:** Microsoft SharePoint/Graph, GitHub JSON manifests, Convex audience/target mappings, Microsoft guest identity controls.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`

## Global Constraints

- No anonymous public access to the external collaboration site.
- No internal-only record may map to SharePoint External.
- Guest access must be explicit, least-privilege, and scoped to the external site/libraries.
- Public GitHub files contain only structure and sanitized metadata.

---

### Task 1: Define the external site contract and audience rules

**Files:**
- Create: `integrations/sharepoint/external-site.json`
- Create: `integrations/sharepoint/external-content-map.json`
- Modify: `integrations/sharepoint/security-model.json`
- Modify: `scripts/validate-sharepoint-blueprints.mjs`

**Interfaces:**
- Consumes: canonical `external_authenticated` content and approved public resources.
- Produces: explicit `sharepoint_external` provisioning contract.

- [ ] **Step 1: Extend the failing validator**

Validator must require these top-level areas: `Welcome`, `Engagement Resources`, `Secure Documents`, `Forms & Templates`, `Shared Tasks & Requests`, `Service Resources`, `Learning Resources`, and `Contact Guidance`.

It must fail if an external mapping has `audience: "internal"`.

- [ ] **Step 2: Run and confirm failure before the external files exist**

Run: `node scripts/validate-sharepoint-blueprints.mjs`

- [ ] **Step 3: Add external site and content mappings**

Every external content-map entry must include `canonicalKey`, `audience`, `destinationArea`, `requiresAuthentication: true`, and `sharingScope`.

- [ ] **Step 4: Validate**

Run: `node scripts/validate-sharepoint-blueprints.mjs && node scripts/validate-public-content.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: define external SharePoint collaboration contract`

### Task 2: Define external libraries and guest-access model

**Files:**
- Create: `integrations/sharepoint/external-libraries.json`
- Create: `integrations/sharepoint/external-deployment-checklist.md`

**Interfaces:**
- Consumes: external site contract.
- Produces: exact library/folder metadata and permission requirements.

- [ ] **Step 1: Define libraries**

Required libraries: `Secure Documents`, `Engagement Resources`, `Forms and Templates`, and `Learning Resources`.

Each library must specify permitted audience, guest-access behavior, owner role, metadata requirements, and whether users may upload, edit, or read only.

- [ ] **Step 2: Define least-privilege guest rules**

The checklist must require invitation-based access, expiration/review cadence where supported, no sharing links broader than intended recipients, and no inherited access to internal SharePoint content.

- [ ] **Step 3: Validate and commit**

Run: `node scripts/validate-sharepoint-blueprints.mjs`

Expected: PASS.

Commit message: `feat: add external SharePoint library security model`

### Task 3: Attempt live external deployment only when supported

**Files:**
- Create: `integrations/sharepoint/external-deployment-status.json`

**Interfaces:**
- Consumes: validated external provisioning package and Microsoft connector availability.
- Produces: verified deployment status without overstating tenant capability.

- [ ] **Step 1: Resolve the Microsoft tenant/site**

If the tenant still reports no SharePoint Online support, write `{"status":"blocked_by_tenant_license"}` plus the verified timestamp and stop live provisioning.

- [ ] **Step 2: When a valid external site exists, enumerate its drives/libraries**

Compare actual library names and permissions to `external-libraries.json`.

- [ ] **Step 3: Create only the approved external folder structure**

Do not copy internal libraries or source documents into this site.

- [ ] **Step 4: Verify guest isolation**

Test with the configured external-access model that external users cannot enumerate or access the internal site/library paths.

- [ ] **Step 5: Commit verified status**

Commit message: `docs: record external SharePoint deployment status`
