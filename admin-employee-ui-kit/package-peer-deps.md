# Peer dependencies

The kit is frontend-only. It does not ship `package.json`. The host Next.js app must already provide:

| Package | Used for |
| --- | --- |
| `next` ^16 | App Router, Server Actions, `next/headers` cookies, `next/image`, `next/navigation` |
| `react` 19 | UI |
| `react-dom` 19 | UI |
| `tailwindcss` ^4 | `@theme` tokens and utilities in `tokens/portal-tokens.css` |
| `@tailwindcss/postcss` ^4 | Tailwind v4 PostCSS pipeline |
| `typescript` ^5 | Types |

## Host TypeScript paths

Kit imports use `@/` → `src/`. Example `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Not required

- `@jumpifzero/contracts`
- HMAC / gateway clients
- Database drivers
- `framer-motion`, `gsap`, Sentry
