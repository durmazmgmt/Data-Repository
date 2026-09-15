# SharePoint Integration Runbook

## Scope

This folder defines the approved SharePoint architecture for the Durmaz cross-platform repository. The target is two separate experiences:

1. **Durmaz Operations Hub** — internal/private operations and collaboration.
2. **Durmaz Services & Resources** — external/client-facing communication and curated resource delivery.

The structured blueprint is maintained in `site-blueprint.json`.

## Current Microsoft tenant status

The connected Microsoft account authenticates successfully, but Microsoft Graph currently returns **Tenant does not have a SPO license** when SharePoint drives are requested. No SharePoint site, library, folder, permission, or page provisioning should be represented as complete until SharePoint Online is licensed and the connector can resolve a site.

## Internal experience

The internal hub is intended to contain protected operational references and collaboration structures, including:

- controlled entity and source registers;
- web/app portfolio inventory;
- business plans, SOPs, policies, and source documents;
- approved copies or snapshots from Macaly, Base44, Replit, Lovable, GitHub, and Google Drive;
- tax, notary, learning, and business-operations workspaces;
- audit/change-control evidence;
- authenticated links to application admin and client systems.

Sensitive operational areas must use restricted membership. External sharing is disabled by default. SharePoint is not a secrets vault; deployment keys, OAuth secrets, API tokens, and credentials stay in server-side secret stores.

## External experience

The external communication site is intended for approved public/client-facing material only. Its page model mirrors the Google Sites public structure:

- Home
- Business & Management Services
- Tax Services
- Notary Services
- Learning & Resources
- Forms & Templates
- Contact & Intake
- Client Access

Client Access is a navigation/deep-link function. Client records, documents, tax information, audit logs, admin tools, and authenticated application state must not be stored in public pages.

## Builder source policy

### Lovable

Approved public content may be drawn from:

- **Durmaz Management** — consulting positioning and service families.
- **TaxSeasonSupport** — approved tax-service descriptions and public educational resources.
- **Durmaz Notary - Mobile Notary Hub** — approved mobile/RON service descriptions and public process content.

Portal/admin features remain internal.

### Base44

**TaxNavigator** is classified as an internal/high-sensitivity operational source. Its schema includes client, engagement, document, tax-return-profile, communications, source-registry, audit-log, and user domains. Record data is not approved for public synchronization.

### Replit

**Tax Agent Pro** may contribute reviewed high-level educational/product concepts. Strategy, admin, case queues, research histories, staff training, risk indicators, and audit concepts remain internal.

**Tax Advisor AI** and **Tax Agent AI** remain inventory-only until directly inspectable; no content should be inferred.

## Provisioning sequence after SharePoint Online is enabled

1. Resolve the tenant SharePoint hostname and intended internal/external site paths.
2. Create or validate the two sites using Microsoft 365 administration.
3. Resolve each site through Microsoft Graph.
4. Create the internal libraries and lists from `site-blueprint.json`.
5. Apply restricted permissions before uploading protected material.
6. Load only sanitized public content into the external experience.
7. Validate external sharing, anonymous access, and inherited permissions.
8. Test both experiences with least-privilege accounts.
9. Record the final site URLs and library IDs in the private operational repository; do not expose internal identifiers in the public GitHub manifest unless they are intentionally public.

## Security baseline

- HTTPS only.
- Least privilege.
- Internal by default.
- No client tax or financial records in public GitHub, Google Sites, or external SharePoint pages.
- No credentials, private keys, tokens, or deployment secrets in SharePoint pages or documents.
- Google Drive and SharePoint permissions remain independent from website visibility.
- Security/compliance claims require supporting evidence before publication.
