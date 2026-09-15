# Cross-Platform Implementation Plan Index

This directory contains the implementation plans for the approved specification at `docs/superpowers/specs/2026-09-15-cross-platform-content-architecture-design.md`.

## Execution Order

1. `2026-09-15-01-canonical-content-model.md` — normalized Macaly/Convex content model, access policy, and legacy migration bridge.
2. `2026-09-15-02-brand-logo-registry.md` — controlled brand registry, logo/media references, sampled design tokens, and backend brand seed.
3. `2026-09-15-03-github-distribution-layer.md` — sanitized public content structure, schemas, snapshots, and CI safety gates.
4. `2026-09-15-04-google-sites-integration.md` — brand-aware read-only bridge, content maps, embed catalog, and Google operator package.
5. `2026-09-15-05-chatgpt-sites-integration.md` — ChatGPT Sites target contracts, sanitized canonical site delivery, and interactive feature mappings.
6. `2026-09-15-06-sharepoint-internal.md` — secure internal intranet blueprint, libraries, content mappings, and conditional tenant deployment.
7. `2026-09-15-07-sharepoint-external.md` — isolated authenticated external collaboration blueprint, libraries, guest controls, and conditional tenant deployment.
8. `2026-09-15-08-sync-audit-validation.md` — target-independent synchronization status, audit history, read-only source inventory refresh, release validation, and final acceptance evidence.

## Dependency Rules

- Plan 01 is required before Plans 02, 04, 05, 06, 07, and 08 because it defines the canonical data and audience contracts.
- Plan 02 is required before presentation-layer branding is finalized.
- Plan 03 provides the public distribution/validation layer used by Plans 04 and 05.
- Plans 06 and 07 may complete their deployable packages even when the connected Microsoft tenant cannot provision SharePoint; live deployment status must remain explicit and evidence-based.
- Plan 08 is the final integration/release gate and cannot be marked complete until all implementable acceptance criteria have fresh verification evidence.

## Non-Negotiable Project Rule

Base44, Replit, and Lovable remain read-only source/reference systems. Their useful content, workflows, and UX patterns may be inventoried and incorporated into the canonical target architecture, but this implementation must not modify those source applications.
