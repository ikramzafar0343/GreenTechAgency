# CMS / Admin Integration — Production Contract

**First inspect the current CMS**. Extend existing landing section/card/media models instead of spawning a new CMS solely for this component.

## Section record

```ts
type ImpactSectionRecord = {
  id: string;
  eyebrow: string;                 // user-controlled label
  heading: string;                 // semantic H2
  description: string;
  isPublished: boolean;
  cards: ImpactCardRecord[];       // ordered, published, approved only
};
```

## Card record

```ts
type ImpactCardRecord = {
  id: string;                      // stable database id; React key
  order: number;                   // integer, unique within section
  isPublished: boolean;
  kind: 'image' | 'metric' | 'statement' | 'cta';
  size: 'tall' | 'medium' | 'compact';
  theme?: 'dark' | 'light' | 'muted';
  primaryText?: string;            // heading, metric, label or CTA lead
  secondaryText?: string;          // context/body
  imageMediaId?: string;           // relation to existing Media table
  imageAlt?: string;
  imageObjectPosition?: string;    // validated CSS position
  linkHref?: string;               // validated internal/approved absolute URL
  linkText?: string;
  claimSourceUrl?: string;         // internally stored evidence for results
  claimReviewDate?: string;        // optional date, not shown by default
};
```

A discriminated TypeScript interface is included in `src/components/impactMadeVisible/impact.types.ts` and intentionally narrower than the CMS storage record: conversion to UI props occurs in the service/server layer.

## Validation rules

- Public query: `WHERE isPublished = true`, sorted by `order` and `id`.
- `metric` requires real primaryText + secondaryText, and source evidence in editorial workflow. A zero or missing metric is not a reason to invent one.
- `image` requires media asset, alt, and optional caption. Neither image URL nor alt is allowed to be bogus.
- `cta` requires approved link `href` + `linkText`; link should point to an actual route.
- Do not duplicate the set of CMS rows for marquee effect. **Duplicate only the rendered presentation**, with `aria-hidden` and untabbable duplicate links.
- Empty/invalid cards are rejected at save time or safely excluded by the server query. No silent fake fallback values.
- Use current CMS image transformations; avoid hotlinking other agencies' photographs.
- Sanitize rich text or avoid rich text for these short copy fields.
- Support draft/published, order controls, real media selection, and accessible alt-text editing **only if current admin already has these features or they are explicitly within the requested feature scope**.
- Do not invent analytics results from CMS design itself.

## SEO, GEO, AEO

Section heading and explanatory paragraph remain selectable server-rendered text. Use one section H2 within page heading hierarchy; card titles may be `<h3>` where semantically appropriate. Impact figures must connect to real case-study detail pages if linkable, and genuine outcomes should be contextualized with methodology. Do not add fake `Review`, `AggregateRating`, `FAQPage`, `HowTo`, or `ClaimReview` schemas. Avoid stuffing keywords into repeated decorative cards; second render is `aria-hidden`.

## Operational consideration

If the app has no CMS for landing sections, accept `cards` as server-side props from the current trusted content layer. Do not add an admin panel/database just to make this screenshot-style component work unless separately requested.
