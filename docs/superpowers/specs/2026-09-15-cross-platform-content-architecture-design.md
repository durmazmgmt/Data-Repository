# Cross-Platform Content Architecture Design

**Date:** 2026-09-15

## Purpose

Create one controlled source of truth for the Durmaz portfolio website ecosystem and distribute approved content to Google Sites, ChatGPT Sites, GitHub, SharePoint internal/external experiences, and related public-facing channels without allowing source systems to drift independently.

## Scope

This design covers:

- Universal website/content repository hosted through the existing Macaly/Convex backend.
- GitHub `durmazmgmt/Data-Repository` as the version-controlled distribution and deployment layer.
- Google Sites as a public/external presentation target.
- ChatGPT Sites as the primary modern interactive website target.
- SharePoint Internal as a staff/intranet/document-governance target.
- SharePoint External as an authenticated client/partner collaboration target.
- Existing Base44, Replit, and Lovable apps as read-only source/reference systems.
- Google Drive controlled documents as source material and provenance references.
- Uploaded logos and brand identities as authoritative visual identity inputs for the corresponding entities.

## Non-Negotiable Boundaries

1. **Base44, Replit, and Lovable remain read-only.** Their code, content, workflows, and UX patterns may be inspected and documented, but those apps are not modified by this project.
2. **One universal source of truth.** Canonical website content, brand metadata, publishing state, provenance, and target mappings are stored in the central repository rather than independently maintained in every site.
3. **Public and private data remain physically and logically separated.** Public consumers receive only approved public fields. Internal records, private source URLs, content JSON, credentials, client data, EINs not explicitly approved for public use, and authentication material are excluded from public feeds.
4. **No secrets in GitHub public content.** Tokens, passwords, connection strings, write credentials, private documents, client records, and backend admin information must never be committed to the public repository.
5. **SharePoint Internal and SharePoint External are separate experiences.** External collaboration is not a public mirror of the internal intranet.
6. **Brand assets are controlled.** Logos, theme tokens, naming, and display rules use approved brand records rather than duplicated hard-coded values across implementations.
7. **Publication is approval-driven.** A record must have an explicit audience, confidentiality classification, status, and approved version before it can be distributed to a presentation target.

## Authoritative Systems and Responsibilities

### Macaly / Convex

Macaly/Convex is the operational canonical content repository. It stores structured records, versions, target mappings, audience rules, provenance, and publication metadata.

### GitHub

GitHub is the portable version-controlled distribution layer. It contains sanitized schemas, manifests, brand token files, approved public snapshots, integration documentation, bridge code, deployment workflows, and implementation specifications. GitHub is not the source for private client or operational records.

### Google Drive

Google Drive remains a controlled source-document repository. Existing business plans, website specifications, curriculum materials, offline builds, and related controlled documents remain source evidence and provenance references. Content suitable for websites is normalized into the central repository before distribution.

### Google Sites

Google Sites receives sanitized, approved public/external content. It should consume repository-backed bridge content or controlled exports rather than become an independent master copy.

### ChatGPT Sites

ChatGPT Sites are the primary interactive public-facing implementations. They use the same canonical brand, service, page, CTA, resource, and integration records as Google Sites while supporting richer forms, calculators, portals, study tools, search, scheduling, and other interactive experiences where appropriate.

### SharePoint Internal

The internal SharePoint experience is the Durmaz operating intranet. It organizes entity governance, business plans, source documents, SOPs, templates, marketing assets, brand standards, website review queues, curriculum/source repositories, publishing status, and internal dashboards.

### SharePoint External

The external SharePoint experience is an authenticated collaboration layer for approved client and partner resources, onboarding, document exchange, engagement materials, templates/forms, selected learning resources, and service-specific resources.

### Base44 / Replit / Lovable

These platforms are reference systems only. Their strongest verified patterns are documented and translated into requirements for the canonical repository and target sites. They are not modified.

## Verified Source-System Patterns

### Base44 TaxNavigator

Verified reusable architecture concepts include:

- Clients
- Engagements
- Documents
- Tasks
- Communications
- Document interpretations
- Tax return profiles
- Clarification requests
- Source registry
- Audit logs
- Role-based user model

These concepts may inform future portals and structured workflows, but sensitive tax/client records must never be copied into the public website repository.

### Lovable Portfolio

Verified relevant projects include:

- Durmaz Management
- TaxSeasonSupport
- Durmaz Notary / Mobile Notary Hub

Verified reusable feature patterns include public service pages, scheduling, authentication, client/admin portals, dashboards, documents, tasks, messaging, consultations, analytics, and structured contact/intake experiences.

### Replit

Known projects include Tax Agent Pro, Tax Advisor AI, and Tax Agent AI. These remain catalogued source systems. No unverified functionality may be represented as implemented or migrated.

## Universal Repository Data Model

The existing `repositoryRecords` model remains supported for backward compatibility. The normalized website-content layer should add focused collections/tables for:

- `entities`
- `brands`
- `sites`
- `pages`
- `contentBlocks`
- `services`
- `offers`
- `forms`
- `callsToAction`
- `features`
- `mediaAssets`
- `navigation`
- `testimonials`
- `faqs`
- `resources`
- `courses`
- `sourceDocuments`
- `integrations`
- `publishingTargets`
- `brandThemes`
- `versions`
- `relationships`
- `auditEvents`
- `syncStatus`

Every canonical record must support, directly or through relations:

- Canonical ID / stable key
- Owning entity
- Record type
- Title/name
- Content payload
- Audience (`public`, `external_authenticated`, `internal`)
- Confidentiality classification
- Lifecycle status (`draft`, `review`, `approved`, `published`, `archived`)
- Source provenance
- Source URL/reference when private and permitted
- Current approved version
- Target destinations
- Last updated timestamp
- Approval metadata
- Tags

## Publication Model

The operating rule is:

**Create once -> review once -> approve once -> distribute by audience.**

Distribution rules:

- `public` records may flow to ChatGPT Sites, Google Sites, GitHub public snapshots, and public website feeds.
- `external_authenticated` records may flow to SharePoint External and authenticated client/partner surfaces.
- `internal` records may flow only to SharePoint Internal and authenticated administrative systems.
- No publication target may elevate a record to a less-restricted audience than its canonical classification.

## Brand System

Uploaded logos are authoritative identity inputs for the following brands where provided:

- Durmaz Holdings LLC
- Durmaz Management LLC DBA Durmaz Mgmt
- EFG Accounting Group
- Durmaz Notary Services DBA MobileNotaryHub
- Durmaz Learning Academy
- TaxSeasonSupport
- Addiction Skin Care
- Durmaz Home Services
- Maid of All Trades
- Chic Chicago Homes

Theme records should store:

- Primary logo asset
- Alternate logo asset(s)
- Primary color
- Secondary color
- Accent color
- Neutral/background colors
- Heading font family
- Body font family
- Button treatment
- Card treatment
- Image treatment
- Logo-safe background rules
- Minimum logo clear-space guidance
- Voice/tone metadata

Representative extracted visual families from the supplied artwork include:

- Deep navy / midnight blue
- Metallic gold
- Black / charcoal
- Forest/deep green
- Rose-gold/warm metallic neutrals for Addiction Skin Care
- Royal blue and green for TaxSeasonSupport

Exact implementation tokens should be sampled from final source logo files and committed as structured brand tokens.

## Entity-Specific Brand Direction

- **Durmaz Holdings LLC:** black/charcoal/gold; portfolio, governance, growth.
- **Durmaz Mgmt:** deep navy/gold; management, strategy, results.
- **EFG Accounting Group:** deep navy/gold; accounting, tax, advisory.
- **MobileNotaryHub:** midnight navy/gold/ivory; mobile, RON, signing-agent services.
- **Durmaz Learning Academy:** navy/gold; education, professional development.
- **Chic Chicago Homes:** black/gold; Chicago real estate and property services.
- **Durmaz Home Services:** navy/gold; maintenance, improvement, protection.
- **Maid of All Trades:** black/deep green/gold; cleaner spaces, brighter days.
- **Addiction Skin Care:** forest green/rose-gold/warm neutral; natural care and premium wellness.
- **TaxSeasonSupport:** royal blue/green/white; accessible tax help and guided support.

## Target Experience Architecture

### Public discovery layer

Shared public patterns should include:

- Clear entity-specific value proposition
- Service/product navigation
- Trust indicators
- Pricing or pricing guidance where appropriate
- FAQs
- Resource center
- Contact/intake pathways
- Scheduling where relevant
- Contextual calls to action
- Mobile-first responsive layout
- Accessibility-conscious typography and interaction

### Interactive service layer

Where relevant, ChatGPT Sites may add:

- Interactive estimators/calculators
- Guided intake forms
- Service recommendation flows
- Template/form libraries
- Appointment scheduling
- Search/filtering
- Resource personalization
- Client access entry points
- Status/progress indicators

### Education layer

Durmaz Learning Academy and exam/study properties may add:

- Course catalog filtering
- Learning pathways
- Assessments
- Study resources
- Certification alignment
- Resource repositories
- Progress-oriented UX

### Professional-service portal layer

Future authenticated portal capabilities may draw from verified source-system patterns:

- Client dashboard
- Documents
- Tasks
- Messages
- Intake
- Scheduling
- Engagement status
- Clarification requests

These capabilities must be implemented against the controlled backend and access model rather than copied blindly from source apps.

## SharePoint Information Architecture

### Internal SharePoint

Recommended top-level areas:

- Home / Executive Dashboard
- Entity Directory
- Business Plans
- Website & Brand Governance
- Source Documents
- SOPs & Templates
- Marketing Assets
- Learning & Curriculum Repository
- Publishing Review Queue
- Integrations & Systems
- Audit / Change History

### External SharePoint

Recommended top-level areas:

- Welcome / Client or Partner Home
- Engagement Resources
- Secure Documents
- Forms & Templates
- Shared Tasks / Requests
- Service Resources
- Learning Resources (where applicable)
- Messages / Contact Guidance

External access must use Microsoft identity/guest controls and never expose internal libraries by inheritance.

## GitHub Repository Structure

Target structure:

```text
/content
  /entities
  /brands
  /sites
  /services
  /courses
  /resources
/assets
  /logos
  /brand-tokens
/schemas
/integrations
  /google-sites
  /sharepoint
  /chatgpt-sites
/manifests
/public
/docs
  /superpowers
    /specs
    /plans
```

GitHub public content must contain only sanitized approved records and non-secret configuration.

## Google Sites Integration

Google Sites should consume controlled public content through one or more of:

1. A sanitized public JSON feed.
2. A GitHub-hosted embeddable bridge.
3. Controlled generated HTML blocks/assets.
4. Manually placed Google-native content only when a direct programmatic editing surface is unavailable.

The Google Site must not receive write credentials or private repository access.

## ChatGPT Sites Integration

ChatGPT Sites should use the canonical repository for:

- Brand identity
- Navigation
- Services
- Resources
- Forms
- CTAs
- Pricing guidance
- FAQs
- Page content
- Course/study content where applicable

Interactive features may use authenticated backend functions, but secrets remain server-side.

## Security Architecture

### Public feed

Public feeds must include only a deliberately reduced schema such as:

- `key`
- `name`
- `recordType`
- `summary`
- `status`
- `tags`
- `updatedAt`

Current blocked fields include at minimum:

- `sourceUrl`
- `contentJson`
- `sourceSystem`

The public contract may be expanded only through explicit review.

### Administrative access

Administrative repository operations require authenticated and authorized access. Authorization must use an explicit admin allowlist or role model; successful authentication alone is not sufficient.

### Data protection

- TLS/HTTPS in transit.
- Provider-managed encryption at rest where supported.
- No browser-exposed secrets.
- No private tokens in GitHub.
- No sensitive client/tax data in public website content collections.
- Separate audience classifications for public, authenticated external, and internal content.
- Audit records for publishing and administrative changes.

## Versioning and Provenance

Every approved content change should produce or reference:

- Version identifier
- Source document/reference
- Change timestamp
- Changed by
- Approval status
- Publishing destinations
- Sync result

Historical versions should remain queryable without mutating the canonical approved version.

## Synchronization Strategy

The central repository is authoritative. Target platforms are downstream consumers.

- GitHub receives sanitized snapshots/manifests and integration code.
- Google Sites receives approved public content.
- ChatGPT Sites consume approved public content and server-backed interactive features.
- SharePoint Internal receives internal and governance records.
- SharePoint External receives only authenticated-external records.
- Source systems (Base44, Replit, Lovable) are periodically re-inventoried but never overwritten by this workflow.

## Failure Handling

Each target sync should maintain a `syncStatus` record with:

- Target
- Canonical version
- Last attempted time
- Last successful time
- Status (`pending`, `success`, `partial`, `failed`)
- Error summary
- Retry eligibility

A failed target publication must not roll back the canonical approved record. Target retries operate independently.

## Current Platform Constraints

- GitHub Pages first-time repository enablement may require repository-level administration outside the current connector. CI/package validation must remain successful even when Pages deployment is unavailable.
- The current Microsoft connection does not expose a provisioned SharePoint Online tenant suitable for site creation. SharePoint manifests, information architecture, content packages, and mappings can be prepared before tenant provisioning, but live SharePoint site creation must wait until the tenant supports it.
- Google Drive is available for controlled source documents. Direct Google Sites editing is not currently exposed through the connected Google tooling, so the implementation must use supported bridge/embed/export patterns until a direct Google Sites write surface is available.

## Acceptance Criteria

The implementation is acceptable when:

1. A normalized canonical content model exists without breaking the live `repositoryRecords` contract.
2. Public, external-authenticated, and internal audiences are enforced by design and tests.
3. Brand records exist for the approved entities and reference the uploaded logo assets.
4. GitHub contains sanitized schemas, manifests, tokenized brand configuration, and target-integration documentation.
5. Google Sites has a reproducible public-content integration package.
6. ChatGPT Sites can consume the same canonical content model without independent duplication.
7. SharePoint Internal and External have separate, deployable information-architecture/content packages ready for a licensed tenant.
8. Base44, Replit, and Lovable remain unmodified.
9. Source provenance and version history are retained.
10. Public feeds expose no restricted fields or private data.
11. Sync status is observable per destination.
12. Existing GitHub bridge validation remains green.

## Implementation Decomposition

This architecture should be implemented as separate but coordinated workstreams:

1. Canonical data model and migration layer.
2. Brand/logo asset registry and design tokens.
3. GitHub content/manifests/public snapshot layer.
4. Google Sites integration package.
5. ChatGPT Sites integration package.
6. SharePoint Internal package.
7. SharePoint External package.
8. Cross-platform synchronization, audit, and validation.

Each workstream must be independently testable and must preserve the security boundaries defined in this specification.
