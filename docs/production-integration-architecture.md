# Production integration architecture

Version 1.0.0 — 2026-09-15

## Governing rule

Macaly/Convex remains the canonical operational content and protected-data layer. GitHub stores versioned schemas, manifests, automation, and sanitized public distribution artifacts. Presentation, analytics, monitoring, design, and CRM platforms must not become competing content repositories.

## Platform responsibilities

| Platform | Responsibility | Data-authority boundary |
|---|---|---|
| Macaly/Convex | Canonical operational content, protected records, and backend services | System of record |
| GitHub | Version control, sanitized public distribution, schemas, manifests, and deployment automation | Distribution record |
| Vercel | Production and preview frontend deployment | Runtime only |
| Railway | Backend services, workers, bridges, and failover | Runtime only |
| Google Sites | Approved public presentation | Non-canonical consumer |
| ChatGPT Sites | Interactive public presentation and prototypes | Non-canonical consumer |
| SharePoint | Internal and external authenticated collaboration | Non-canonical consumer |
| Semrush | SEO research and search-performance auditing | Analytics only |
| Datadog | Errors, latency, availability, API health, backend failures, and deployment regressions | Telemetry only |
| Amplitude | Privacy-conscious visitor behavior and conversion funnels | Analytics only |
| Figma | Design tokens, components, layouts, responsive patterns, and cross-brand governance | Design specification |
| HubSpot | Optional downstream lead and follow-up workflows | CRM workflow only |
| Jotform | Optional advanced intake, application, signature, and form workflows | Form workflow only |
| Base44, Replit, Lovable | Read-only source and reference extraction | Non-canonical sources |

## Priority additions

1. Datadog: establish availability, error-rate, latency, failed-job, API-health, and deployment-regression monitoring.
2. Amplitude: establish a governed event taxonomy for landing-page, service-page, estimator, form, scheduling, resource, and course funnels.
3. Figma: create one reusable cross-brand design system from approved brand tokens and component rules.
4. HubSpot: activate only when centralized lead ownership, consultation pipelines, or automated follow-up is required.
5. Jotform: activate selectively for form workflows that exceed the native site forms.

## Guardrails

- Never send SSNs, EINs, tax documents, notarial records, authentication credentials, form free text, or protected client information to analytics platforms.
- Analytics events use stable event names and non-sensitive identifiers.
- Monitoring logs must redact authorization headers, query secrets, cookies, tokens, and protected payloads.
- Figma governs presentation tokens and component specifications but does not become a content database.
- HubSpot receives only consented lead data required for the active business workflow.
- Public deployments consume only sanitized records that pass repository validation.
- Supabase, Airtable, additional CMS products, and additional databases remain excluded unless a documented capability gap is approved.

## Implementation sequence

1. Verify platform ownership, installation scope, and environments.
2. Define environment names and deployment ownership across Vercel, Railway, and GitHub Pages.
3. Add Datadog service names, health checks, dashboards, and alert thresholds.
4. Add Amplitude event names, properties, consent behavior, and exclusion rules.
5. Publish Figma variables and components mapped to the repository brand registry.
6. Connect downstream CRM or advanced forms only after data classification and consent review.
7. Validate every integration in preview before production release.
8. Record the verified connection state in `integrations/platform-roles.json`.

## GitHub access note

The current GitHub App installation is scoped to the personal account `durmazmgmt`. The `Durmaz-Holdings` organization or enterprise is not visible to that installation. Organization repositories must be added through a separate organization-level GitHub App installation or transferred into the currently connected account before this automation can access them.
