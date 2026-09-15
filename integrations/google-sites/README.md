# Google Sites Integration — Durmaz Central Data Repository

## Architecture

Google Sites is the presentation layer only. It must never store or receive repository credentials, administrative tokens, private source URLs, internal JSON, or write access.

Data flow:

1. **Macaly + Convex** — authoritative operational repository; authenticated administrative CRUD; server-side admin allowlist.
2. **Convex public endpoint** — read-only HTTPS JSON containing only records explicitly classified `public` and only the approved public fields.
3. **GitHub `docs/` bridge** — static display application; no secrets; fetches only the public endpoint.
4. **Google Sites** — embeds the hosted bridge URL. No custom JavaScript or repository credentials are placed in Google Sites.
5. **Google Drive** — source/reference documents remain under their existing Google sharing controls and are not copied into the public GitHub repository.

## Public endpoint

`https://charming-lapwing-610.eu-west-1.convex.site/repository/public`

The endpoint exposes only: `key`, `name`, `recordType`, `summary`, `status`, `version`, `tags`, and `updatedAt`.

The endpoint does **not** expose internal records, `sourceUrl`, internal `sourceSystem`, `contentJson`, authentication information, or write operations.

## GitHub bridge

Source: `docs/index.html`, `docs/styles.css`, and `docs/app.js`.

Expected Pages URL after GitHub Pages is enabled for this repository:

`https://durmazmgmt.github.io/Data-Repository/`

The bridge has a restrictive Content Security Policy and only permits browser data requests to the approved Convex public endpoint.

## Google Sites implementation

In the target Google Site:

1. Open the page where the repository should appear.
2. Select **Insert → Embed → By URL**.
3. Use the deployed bridge URL, not the raw Convex JSON URL.
4. Set the embed to full width where appropriate and allow sufficient height for the record grid.
5. Publish the Site using the intended Google Sites audience controls.
6. Verify that the embed renders public records and that no Google sign-in, Macaly sign-in, or administrative fields are displayed.

## Security rules

- Never add API keys, Convex deployment keys, GitHub tokens, passwords, OTP secrets, or other credentials to Google Sites or this public repository.
- Never place an administrative endpoint in front-end JavaScript.
- Do not embed private Google Drive documents in a public Site unless their Drive sharing settings independently authorize the same audience.
- Classify a record as `public` in Macaly only when the fields shown by the public bridge are approved for public disclosure.
- Internal repository management stays in the authenticated Macaly application.
- GitHub is treated as public source code for this integration; secrets belong in server-side environment storage only.
- All connections use HTTPS.

## Validation checklist

- Macaly/Convex admin writes reject users outside the server-side admin allowlist.
- Public feed returns only records marked `public`.
- Public feed contains no `sourceUrl` or `contentJson` fields.
- GitHub source contains no secrets.
- Google Sites embeds only the bridge URL.
- Drive files retain their existing sharing permissions.
- A private/internal test record never appears in the public embed.
