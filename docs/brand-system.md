# Durmaz Portfolio Brand System

**Version:** 1.1.0  
**Scope:** Google Sites, ChatGPT Sites, SharePoint, GitHub-hosted presentation assets, and approved downstream web experiences.

## Source of truth

The ten logo images supplied in the approved project conversation are the authoritative visual identity inputs. Brand keys, names, taglines, web tokens, typography direction, and display rules are controlled through `content/brands/registry.json` and `assets/brand-tokens/portfolio.json`.

The logo binaries themselves are not inferred or recreated. Stable `primaryLogoAssetKey` values reserve their canonical identities; a public URL is added only after the corresponding approved logo derivative is intentionally published to controlled media storage.

## Palette extraction methodology

`scripts/extract-brand-palette.py` performs deterministic source-artwork sampling. It applies EXIF orientation, bounds the source to 256 pixels, ignores transparent and near-white pixels, uses Pillow median-cut quantization, and ranks representative sRGB colors by sampled pixel count. The raw candidates from the ten supplied logos are preserved in `assets/brand-tokens/extracted-candidates.json`.

Semantic colors are selected from those candidates for web use. A metallic gold or rose-gold effect in artwork cannot be represented by one CSS hex value; `secondary` and `accent` are therefore flat sRGB approximations sampled from the actual artwork, while gradients and highlights remain part of the logo image itself.

## Semantic token rules

- `primary`: dominant dark or core brand color used for headers, key surfaces, and primary emphasis.
- `secondary`: principal metallic, gold, rose-gold, green, or companion brand tone.
- `accent`: lighter or supporting sampled tone for focus, badges, highlights, and secondary controls.
- `surface`: light brand-aware background. Do not assume it is suitable for body text without checking contrast.
- `text`: default dark body/headline color on light surfaces.
- `muted`: subdued text, border, or supporting detail; never use for small text unless WCAG contrast is satisfied.

## Accessibility and contrast

All rendered text must meet WCAG contrast targets for its actual background. Aim for at least 4.5:1 for normal text and 3:1 for large text and essential UI boundaries. Do not assume sampled golds, greens, or muted tones meet those thresholds simply because they are brand colors. If a sampled color fails, keep it as a decorative/accent color and use the brand `text` or a darker accessible alternative for copy.

Focus indicators must remain visible against both light and dark surfaces. Buttons require a non-color-only hover/focus treatment such as a border, underline, shadow, icon, or luminance change.

## Logo-safe backgrounds

- **Durmaz Holdings LLC:** black, charcoal, or uncluttered warm-light neutral.
- **Durmaz Mgmt:** navy, white, or warm neutral; avoid low-contrast gold-on-beige placement.
- **EFG Accounting Group:** navy or light neutral; maintain separation around the gold monogram.
- **MobileNotaryHub:** midnight navy or ivory; keep the seal clear of busy imagery.
- **Durmaz Learning Academy:** navy, white, or warm neutral with generous crest clear space.
- **TaxSeasonSupport:** white or very light blue so blue/green elements retain separation.
- **Addiction Skin Care:** warm ivory, forest green, or calm natural imagery with sufficient contrast.
- **Durmaz Home Services:** navy or light neutral; keep the roof/shield silhouette unobstructed.
- **Maid of All Trades:** deep green, black, or light neutral; avoid gold over yellow-toned imagery.
- **Chic Chicago Homes:** black, charcoal, or warm light neutral; do not place detailed skyline line art over detailed photography.

## Typography

The site typography tokens are interface recommendations, not claims about the exact typefaces embedded in the source logos. Logos are treated as locked artwork. Google Sites or SharePoint may use the closest supported equivalent when a preferred web font is unavailable, but hierarchy, weight, spacing, and contrast should remain consistent with the canonical theme.

## Image treatment

Photography and supporting imagery must reinforce each entity's service context rather than imitate the logo. Avoid heavy filters that conflict with the sampled palette. Decorative metallic effects should be used sparingly; flat accessible UI colors are preferred for controls and text.

## Cross-platform implementation rule

Presentation systems consume the canonical tokens; they do not redefine them. Platform-specific theme mappings may translate unsupported fonts or component APIs, but may not change legal/display names, approved taglines, logo asset keys, or semantic brand colors without a new approved registry version.
