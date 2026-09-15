# Durmaz Data Repository

Central, version-controlled integration repository for the Durmaz website and application portfolio.

## Architecture

- **Macaly + Convex** — authoritative structured repository and authorization boundary.
- **GitHub** — sanitized public manifests, bridge code, deployment artifacts, integration documentation, and version history.
- **Google Sites** — public presentation layer for approved content only.
- **Google Drive** — protected source/reference documents under independent sharing controls.
- **SharePoint Internal** — planned private operations hub for approved staff and collaborators.
- **SharePoint External** — planned curated client/prospect communication experience.
- **Lovable / Base44 / Replit** — source application platforms whose content is classified before reuse.

## Key integration files

- `integrations/builders/registry.json` — sanitized source registry for Lovable, Base44, and Replit applications.
- `integrations/google-sites/manifest.json` — Google Sites bridge and publication policy.
- `integrations/google-sites/content-map.json` — approved Google Sites page/content mapping.
- `integrations/sharepoint/site-blueprint.json` — internal and external SharePoint information architecture.
- `integrations/sharepoint/README.md` — SharePoint implementation and security runbook.
- `docs/` — static bridge package used by the GitHub Pages workflow.

## Data-classification rule

This repository is treated as **public**. Do not commit client records, tax-return data, banking information, SSNs, private document links, credentials, tokens, private keys, deployment secrets, admin-only metadata, or other restricted information.

Public website layers consume only approved sanitized records. Internal operational data remains behind authenticated systems and private document permissions.

## Builder sources currently inventoried

### Lovable
- Durmaz Management
- TaxSeasonSupport
- Durmaz Notary - Mobile Notary Hub

### Base44
- TaxNavigator — internal/high-sensitivity structured tax-operations source

### Replit
- Tax Agent Pro — inspected prototype with selective public reuse after review
- Tax Advisor AI — inventory-only pending direct inspection
- Tax Agent AI — inventory-only pending direct inspection

An unrelated Lovable project, Danny's Delightful Cakes, is intentionally excluded from the controlled Durmaz portfolio until an explicit business mapping is established.

## SharePoint status

The internal and external SharePoint designs are prepared. The currently connected Microsoft tenant reports that it does not have a SharePoint Online license, so SharePoint site/library provisioning is blocked until licensing is enabled.

## GitHub Pages / Google Sites bridge

The workflow validates the static bridge package and the sanitized public feed before preparing the Pages artifact. The public feed must contain only approved public records and must exclude internal source metadata and private JSON payloads.
