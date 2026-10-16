# Next.js Frontend Production Rules

**Owner:** Ikram Zafar  
**Documentation reviewed:** 6 October 2026  
**Scope:** A new Next.js App Router frontend using TypeScript and compatible React packages.  
**Status:** Mandatory engineering rules for developers, reviewers, and AI coding assistants.

## 1. Authority and implementation baseline

- **MUST** means a release requirement; **SHOULD** means the default unless a concrete, documented reason justifies another approach. Never silently weaken a MUST rule.
- Use a supported stable Next.js release and its compatible React, React DOM, TypeScript, and Node.js versions. Record actual versions in the repository and commit one package-manager lockfile. Verify version-matched official documentation before using an API.
- Version-specific instructions below target Next.js 16. Recheck them when changing major versions. Do not mix Pages Router tutorials with App Router implementations. [1][2]
- The **300-line cap, feature architecture, naming conventions, and simplicity requirements are project policies**. Next.js permits several organizational approaches; it does not mandate these choices. Official sources support the framework behavior referenced throughout this document. [3]
- “No bottlenecks” means preventing avoidable work and meeting measured performance budgets. It is an engineering objective verified under load, not an untestable claim that every workload will be bottleneck-free.
- Use this document as a repository rule source. Reference it from the coding assistant's actual instruction file; storing Markdown alone does not automatically configure an editor or enforce CI.

## 2. Production code only

- Every function, component, dependency, configuration entry, and branch MUST serve a current requirement, a real correctness constraint, or an identified operational need.
- Never ship demo, prototype, placeholder, temporary, fabricated, or incomplete implementations. No fake metrics, simulated API success, hardcoded account records, unfinished buttons, dummy URLs, or “implement later” production paths.
- Approved static content is valid production content. Mocks and synthetic fixtures belong only in isolated tests or development tooling and MUST NOT become runtime substitutes for missing services.
- If a required API contract, asset, credential, or business rule is missing, report the exact blocker. Do not invent it, hide it behind a stub, or call the affected feature complete.
- Remove unused code, imports, dependencies, unreachable branches, commented-out implementations, and obsolete compatibility paths. Explain non-obvious decisions in comments; do not narrate obvious syntax.
- Do not add speculative abstractions, future features, redundant guards, extra state, automatic retries, or alternative providers without a demonstrated requirement.
- Deliver complete vertical slices: real data integration, validation, permissions, interaction states, error handling, and relevant verification together.

## 3. Clean, feature-based architecture

Organize by business capability. Keep route composition separate from reusable UI and feature behavior. These paths define responsibilities, not an instruction to create empty scaffolding. [3]

| Location | Responsibility |
| --- | --- |
| `src/app/` | Next.js route files, layouts, metadata, and route-level boundaries. |
| `src/features/account/components/` | Account-specific presentation and interactive components. |
| `src/features/account/hooks/` | Account-specific reusable React behavior, when needed. |
| `src/features/account/model/` | Feature types, input schemas, and pure business rules. |
| `src/features/account/server/` | Server-only data access, integrations, and mutation services. |
| `src/features/account/actions/` | Client-callable Server Action entry points, when needed. |
| `src/shared/ui/` | Business-independent UI primitives used across features. |
| `src/shared/lib/` | Small, cohesive utilities with established shared use. |
| `src/shared/config/` | Explicitly separated public and server-only configuration. |
| `src/server/` | Shared server infrastructure: session verification, observability, rate limiting. |
| `src/styles/` | Global styles and design tokens; feature styles stay near their feature. |
| `public/` | Public, non-sensitive static assets. |
| `tests/e2e/` | Cross-feature user journeys; other tests stay near their subject. |

- Dependency direction: routes compose features; features use shared modules and, on the server, server infrastructure. Shared modules and server infrastructure MUST NOT import routes or feature implementations.
- Keep domain rules independent of React rendering and transport details. A small feature can use a few plain functions; it does not need a class, repository, factory, and service for the same operation.
- Features MUST NOT reach into another feature's internal files. For a real cross-feature dependency, expose a narrow, documented contract and preserve an acyclic dependency graph; otherwise compose features at the route boundary.
- Extract shared code when consumers have the same responsibility and change together. Do not combine unrelated behavior merely because the code looks similar.
- Avoid giant `utils.ts`, global `types.ts`, catch-all services, and barrel files that mix server and client exports. Prefer explicit imports and type-only imports where appropriate.
- Use `@/` consistently for imports from `src`; use short relative imports within one cohesive module. Enforce boundaries with lint rules or a dependency check in CI.

## 4. File-based routing

- Use `src/app` as the route source of truth. Do not introduce React Router, a duplicate route registry, or a custom routing engine. [3]
- Preserve reserved filenames exactly: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, and `route.ts`. Add only the files the route actually needs.
- Use lowercase kebab-case static URL segments, `[accountId]` for a dynamic segment, and route groups such as `(public)` only when useful. Groups organize layouts without adding a URL segment.
- Keep pages and layouts focused on composition. Delegate meaningful feature behavior; do not introduce one-line forwarding functions just to make the route shorter. Do not put `page.tsx` and `route.ts` at the same route segment.
- In Next.js 16, resolve asynchronous `params`, `searchParams`, `cookies()`, and `headers()` according to their documented APIs. Do not copy legacy synchronous access patterns. [2]
- Use `next/link` for ordinary internal navigation; use `next/navigation` APIs for programmatic App Router navigation. Handle missing resources with the appropriate not-found behavior.
- Add `src/proxy.ts` only when request interception is necessary. Next.js 16 uses Proxy in place of the deprecated Middleware convention. Keep its matcher narrow and its work cheap; authorization still belongs at the protected operation. [4][5]

## 5. Server and client boundaries

- Keep pages and layouts as Server Components by default. Add `'use client'` at the smallest useful interactive boundary, not automatically to every file or the root layout. [6]
- Client Components are for state, events, effects, and browser APIs. They can still participate in server prerendering, so browser globals MUST NOT be accessed unsafely during initial rendering.
- Keep secrets, privileged SDKs, and private data access in server-only modules. Guard such modules with `import 'server-only'`; a `.server.ts` filename alone does not enforce the boundary. [6][7]
- Return minimal data objects containing only fields needed by the UI. Props crossing to Client Components MUST satisfy React's supported serialization rules.
- Client code MUST NOT import ordinary server implementations. A deliberate import of a Server Action from a dedicated `'use server'` module is a supported remote-call boundary, not permission to import its underlying services.
- Use `'use server'` for Server Functions/Actions, not as a general replacement for `server-only`. Treat exported actions as remotely callable operations requiring validation and authorization. [7][8]
- Do not create self-HTTP calls from Server Components to the same application's Route Handlers. Call the authorized data-access function or upstream API directly. [9]

## 6. Naming conventions

| Item | Required convention | Illustrative name |
| --- | --- | --- |
| Components and component files | PascalCase | `AccountForm`, `AccountForm.tsx` |
| Types, interfaces, and necessary classes | PascalCase; no `I` interface prefix | `AccountProfile`, `AccountFormProps` |
| Functions, methods, variables, parameters, object fields | camelCase | `getAccount`, `accountId`, `isSubmitting` |
| Hooks and hook files | `use` + PascalCase subject | `useAccountForm`, `useAccountForm.ts` |
| Non-component source files | camelCase with a meaningful role | `accountSchema.ts`, `getAccount.ts` |
| Feature folders and static route segments | kebab-case | `account-settings` |
| Module-wide fixed constants and environment keys | UPPER_SNAKE_CASE | `MAX_UPLOAD_BYTES`, `API_BASE_URL` |
| Callback props / local handlers | `on` / `handle` prefixes | `onSubmit`, `handleSubmit` |
| Tests and component styles | Match subject plus conventional suffix | `AccountForm.test.tsx`, `AccountForm.module.css` |

- Ordinary `const` variables remain camelCase. Use positive boolean names such as `isOpen`, `hasAccess`, and `canSubmit`; function names should express an action or predicate.
- Framework-reserved filenames and exports override project casing. Preserve external API field names at the transport boundary; map them explicitly if the internal model uses different names.
- Prefer named exports for application modules. Use default exports where Next.js conventions require them. Filename casing MUST match imports on case-sensitive production systems.

## 7. Maximum file size: 300 lines

- Every hand-authored source, test, stylesheet, script, and configuration file MUST contain **no more than 300 physical lines, including comments and blank lines**. This is a ceiling, not a target.
- Split by cohesive responsibility before reaching the limit. Do not compress formatting, hide code in strings, or move arbitrary fragments into meaningless files to pass the check.
- Generated files, lockfiles, build output, vendor code, and machine-produced assets are outside this authoring rule. Maintain an explicit exclusion list; never label hand-written code “generated” to bypass enforcement.
- Enforce the following rule in the real ESLint flat configuration for JavaScript and TypeScript. The value 300 is this project's policy, even though ESLint also uses it as the rule's default. [10][11]

```json
{
  "max-lines": [
    "error",
    { "max": 300, "skipBlankLines": false, "skipComments": false }
  ]
}
```

- Add a CI line-count check for hand-authored file types ESLint does not cover, including stylesheets and configuration formats. Count consistently, without inventing an additional empty line for a trailing newline.
- Do not disable the line-limit rule to merge an oversized file. Refactor the responsibility instead.

## 8. SOLID, DRY, KISS, and design patterns

| Principle | Required practical application |
| --- | --- |
| Single Responsibility | Give each module one cohesive reason to change; separate UI, validation, data access, and policy when those responsibilities differ. |
| Open/Closed | Extend established variation points through composition or a small strategy function; do not predict every future extension. |
| Liskov Substitution | Implementations sharing a contract must preserve its behavior, error semantics, and constraints; avoid inheritance that weakens them. |
| Interface Segregation | Pass the props and operations a consumer needs; avoid giant prop bags and universal service interfaces. |
| Dependency Inversion | Keep business rules independent of a specific transport or vendor. Introduce a narrow adapter where a real external boundary warrants it. |
| DRY | Maintain one authoritative implementation of each business rule; reuse schemas where environments allow it, while still validating server inputs. |
| KISS | Choose the simplest complete implementation; prefer functions and composition over class hierarchies and generic frameworks. |

- Use a data-access layer to centralize authorized server reads and safe return values. Use an adapter for a third-party API, a reducer for complex related transitions, and a custom hook for reusable React behavior only when each solves an actual problem.
- Do not mandate a pattern per feature. Avoid abstract base components, dependency-injection containers, universal repositories, and pass-through wrappers without concrete benefit.
- Do not force SOLID's object-oriented vocabulary onto simple React functions. A clear function with an explicit contract can be the correct design.

## 9. TypeScript and function quality

- Enable TypeScript `strict`. Use `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` as additional project safeguards; account for their behavior in application code. [12]
- Use `unknown` for untrusted values and narrow or validate them. Do not use `any`, broad casts, non-null assertions, `@ts-ignore`, or disabled lint rules to conceal an unresolved correctness problem.
- Define explicit contracts for public module boundaries, API payloads, and action results. Prefer discriminated unions for mutually exclusive states; avoid combinations of booleans that permit impossible states.
- Keep functions focused, name side effects clearly, use guard clauses to reduce nesting, and make inputs and outputs understandable without reading unrelated files.
- TypeScript types do not validate runtime data. Validate incoming requests, environment configuration, and untrusted upstream responses at the appropriate boundary.
- Handle optional values only when absence is valid in the contract. Do not sprinkle optional chaining and default values over fields that are required to exist.

## 10. React rendering and state

- Keep render logic pure; do not mutate props or state or perform writes during rendering. Follow the Rules of Hooks, including the separately documented behavior of React's `use` API. [13]
- Keep state close to its owner. Derive values during rendering instead of duplicating them in state, and handle user-triggered work in the responsible event or action. [14]
- Use effects for synchronization with external systems. Supply correct dependencies and clean up timers, subscriptions, and listeners; handle cancellation or stale results where requests can race.
- Use URL state for shareable filters, sorting, and pagination. Do not add a global store for local state or duplicate the same server data in several stores.
- Add a server-state library only when requirements such as polling, optimistic cache updates, or background refresh justify it. Use one consistent solution rather than overlapping query caches.
- Use stable data-derived keys. Do not use random keys or array indices for lists whose items can be reordered, inserted, or removed.
- Add `memo`, `useMemo`, and `useCallback` for measured rendering costs or a real identity contract, not by habit. Account for React Compiler behavior when enabled; memoization must never be required for correctness. [15]

## 11. Data fetching and bottleneck prevention

- Fetch initial route data on the server when appropriate. Avoid effect-driven request waterfalls for content that can be rendered from server data. [16]
- Start independent requests together; use `Promise.all` when all results are required. Use independent boundaries or `Promise.allSettled` only when partial results are a real product state.
- Bound concurrency for large collections. Avoid N+1 requests, sequential independent awaits, unbounded fan-out, and fetching entire datasets to display one page.
- Select only required fields, paginate at the data source, and set maximum page sizes. Coordinate query efficiency and connection pooling with the backend owner instead of masking slow APIs in the UI.
- Check HTTP status explicitly. Define finite timeouts and cancellation where supported; do not allow an upstream call to consume the entire request lifetime without a budget.
- Use existing request deduplication where applicable. Distinguish request-scoped memoization from persistent caching; do not add a second cache without identifying its lifecycle and invalidation owner. [16]
- Do not use Server Actions as a general read-query transport; their mutation-oriented dispatch can serialize work. Use Server Components or an appropriate read endpoint. [9]
- Move long-running jobs to a suitable backend worker when required. A synchronous route, busy loop, artificial sleep, or unlimited polling loop is not a production job system.

## 12. Explicit caching and freshness

- Record whether Cache Components is enabled and follow that model's version-matched documentation. Do not assume that all fetches are cached, or apply configuration from another caching model. [17]
- For each cached resource, define who may reuse it, the freshness window, the key dimensions, and the mutation or event that invalidates it. Leave sensitive request-specific data uncached by default.
- With Cache Components enabled, use supported `'use cache'`, `cacheLife`, and tagging APIs deliberately. Keep request-specific access outside shared cache scopes unless using an explicitly supported, reviewed approach.
- Shared caches MUST NOT leak account- or tenant-specific data. Authenticate before protected access; include every relevant tenant, locale, filter, and authorization dimension when scoped caching is justified.
- After successful writes, invalidate only the affected data. Where supported, `updateTag` is for immediate read-after-write behavior in Server Actions; `revalidateTag` with a profile permits controlled stale content. Choose the behavior the feature needs. [18]
- Do not treat UI refresh alone as proof that server caches were invalidated. Verify freshness after edits, deletion, logout, and permission changes relevant to the feature.
- An intentional freshness window is not an emergency fallback. Never silently serve stale permissions, balances, or transaction outcomes because an upstream system failed.

## 13. Mutations, forms, and API boundaries

- Use Server Actions for appropriate first-party UI mutations and Route Handlers for HTTP APIs, webhooks, or external consumers. Keep both as thin entry points over feature services. [8]
- On every protected operation: establish the actor, validate input, authorize the specific resource and tenant, enforce the applicable quota, and then perform the mutation. Apply cheap edge and payload limits before expensive processing.
- Client validation improves usability; the server is authoritative. Reject unknown or unauthorized writable fields rather than spreading arbitrary client objects into updates.
- Return typed validation and expected business errors. Preserve form input, expose a pending state, and show success only after the authoritative operation succeeds.
- Disabling a button is not duplicate protection. Require backend idempotency for operations whose repetition would cause harm, and handle conflicting concurrent changes explicitly.
- Use optimistic UI only when rollback or reconciliation is implemented. Do not display irreversible success before confirmation.
- For Route Handlers, use meaningful HTTP statuses. Server Actions should expose typed action results rather than pretending they are custom HTTP response handlers.

## 14. Rate limiting and resource controls

Rate limiting is server-side infrastructure. Browser debounce, disabled buttons, and local storage cannot protect an endpoint. Apply controls at every public entry point, including Server Actions, and keep shared business quotas consistent across routes. [7][9][19]

- Use a managed limiter or an atomic shared store appropriate to the deployment. Never rely on an in-memory `Map` as the production limit across multiple instances or serverless invocations.
- When a separate backend owns an endpoint, enforce its authoritative quota there as well. A frontend or Next.js gateway limit cannot protect an upstream endpoint that clients can call directly.
- Define a policy per operation: verified identity/key, burst allowance, sustained quota/window, concurrency cap where necessary, cost ceiling, and observable rejection behavior. Choose actual values from business needs and load evidence; there is no universal Next.js rate limit.
- Key authenticated limits by verified actor and tenant where applicable. Add trusted source-IP or broader abuse controls for anonymous traffic; accept forwarded IPs only from configured trusted infrastructure.
- Use atomic increments and expiry. Bound key cardinality and retention, avoid sensitive raw identifiers in keys/logs, and prevent concurrency races from exceeding the quota.
- For HTTP endpoints, return `429` when the quota is exhausted and a valid `Retry-After` when known. For Server Actions, return a typed rate-limit result with safe retry timing. [9]
- If the limiter is unavailable, high-risk or paid operations MUST stop with an explicit temporary-unavailability result; do not report successful enforcement or bypass the limit. A low-risk read needs a deliberately documented availability policy.
- Limit request/body sizes, upload sizes, query complexity, page size, execution time, and paid-provider spending separately from request count. Add host-level abuse protection where available. [19]
- Test quota boundaries, concurrent attempts, tenant isolation, expiry, and store outages. Monitor rejection rates and legitimate-user impact, including users sharing an IP.

## 15. Necessary states; no hidden fallbacks

- Implement genuine loading, empty, validation, denied-access, not-found, and failure states where they can occur. Required `loading.tsx`, Suspense, and error-boundary UI are production behavior. [20]
- Never catch an error and return an empty array, zero, a fabricated object, cached success, or `true` unless that value truthfully represents the defined result. Empty data and failed data retrieval are different states.
- Use explicit results for expected errors and appropriate boundaries for unexpected failures. Do not turn operational exceptions into apparently successful responses.
- Do not swallow framework control flow such as `redirect()` or `notFound()` inside generic catch blocks. Keep control flow outside broad catches or use the documented handling for the installed version.
- Add retries only for identified transient failures: bounded attempts, a total time budget, backoff, and idempotency where needed. Do not retry authentication, validation, or non-idempotent mutations automatically.
- Log a failure once at the responsible boundary with a correlation identifier and safe context. Display an actionable user message; never expose stack traces, tokens, or raw provider errors.

## 16. Performance budgets and media

- Measure representative production builds and real user traffic. Investigate slow rendering, long tasks, large bundles, repeated requests, cache misses, and backend latency before choosing an optimization. [1]
- Adopt the following Core Web Vitals targets at the 75th percentile, evaluated separately for mobile and desktop: **LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, CLS ≤ 0.1**. Lab scores help diagnose issues; they do not replace field data. [21]
- Before release, set numeric route budgets for transferred client JavaScript, key API latency, payload size, error rate, and expected concurrent load. Store the measurement method and baseline; no invented “universal” bundle budget.
- Keep browser bundles small by preserving server boundaries and reviewing dependency cost. Lazy-load substantial optional client features when it improves the measured critical path. Do not disable SSR as a generic performance fix. [22]
- Use `next/image` where applicable, accurate dimensions or a stable fill container, useful `sizes`, and narrowly scoped remote-image rules. Do not lazy-load the primary above-the-fold image; prioritize it using the installed version's supported API. [23]
- Use `next/font` for suitable fonts and load only required families and weights. Reserve media space, avoid layout shifts, and defer non-essential scripts. [24]
- Avoid blocking computations, unnecessary global context updates, giant DOM lists, and layout-thrashing animations. Paginate or virtualize large lists when evidence warrants it; prefer transforms and opacity for animation.

## 17. Accessibility and UI consistency

- Target WCAG 2.2 AA. Use semantic HTML, accessible names, associated labels, keyboard navigation, visible focus, suitable contrast, and understandable form errors. [25]
- Use buttons for actions and links for navigation. Provide appropriate image alternatives, focus management for dialogs, and announcements for important asynchronous status changes.
- Respect reduced-motion preferences. Avoid motion that blocks essential interaction; test responsive behavior, zoom, touch input, and overflow on real content.
- Use one styling strategy and shared design tokens. Build reusable primitives around recurring behavior; avoid copying whole components or creating universal components with dozens of unrelated flags.
- Loading and disabled states MUST preserve usability. Do not solve visual defects by removing focus outlines, hiding meaningful content, or suppressing hydration warnings.

## 18. Security, configuration, and metadata

- Use a maintained authentication solution when authentication is needed. Validate access near protected data and operations; hiding UI or redirecting in a layout/Proxy is insufficient. Use appropriately configured secure session cookies. [5]
- Separate public and private environment schemas. Treat every `NEXT_PUBLIC_` value as public; never place credentials in client bundles, URLs, public assets, analytics, or logs. Fail clearly for missing required configuration. [7]
- Keep cookie-based mutation protections intact, restrict trusted origins appropriately, validate redirect destinations, and constrain server-side requests built from user input. CORS is not authorization.
- Sanitize permitted rich HTML with a maintained sanitizer before rendering it. Configure CSP and relevant security headers for the actual application and deployment; test compatibility and any rendering/cache tradeoffs. [26]
- For indexable routes, supply accurate metadata, canonical URLs, social previews, and applicable sitemap/robots files using Next.js conventions. Never publish fabricated structured data; robots rules do not protect private information. [27]
- Configure logs, error monitoring, and performance telemetry with redaction, retention, and correlation identifiers appropriate to the product. Collect only data needed to operate the application.

## 19. Tooling, tests, and release gates

- Use one package manager, a frozen-lockfile CI install, a documented runtime version, and supported dependency versions. Justify new packages by capability, maintenance, compatibility, and bundle impact.
- Configure `eslint-config-next/core-web-vitals` and its TypeScript support, hook checks, unused-code checks, naming/import-boundary enforcement, and the line cap. Run `eslint . --max-warnings 0` through the project's package manager. [10]
- In Next.js 16, lint runs separately: `next lint` is removed and `next build` does not run it. Never disable TypeScript build errors or weaken checks to make a deployment pass. [2]
- CI MUST run formatting checks, lint, type checking, the complete file-length check, relevant automated tests, and a production build. Generate Next.js route types before standalone type checking when the selected version requires it.
- Write unit tests for meaningful pure logic, integration tests for boundaries and failure behavior, and browser tests for critical journeys. Prefer behavior assertions over implementation snapshots or arbitrary coverage targets. [28]
- Exercise server-rendered flows in an actual Next.js environment; use end-to-end coverage where the chosen unit tools do not support async Server Components. Keep fixtures isolated from production. [28]
- Verify authorization, cross-account access denial, validation, rate limiting, mutation correctness, and cache isolation wherever those risks exist. Test loading/error states and keyboard behavior in affected journeys.
- For a reversible copy or styling change, run relevant checks and visual inspection; do not invent a redundant test suite. Fixing a behavioral defect should include a regression check that can detect the defect.
- Validate the production artifact, not just the dev server. Inspect hydration warnings, browser errors, responsive layouts, direct route visits, refreshes, and the affected performance budgets.
- Before release, verify deployment secrets, runtime capabilities, health monitoring, and a usable rollback path. Record actual verification outcomes; never claim unrun checks passed.

## 20. Definition of done and AI coding workflow

- Inspect existing routes, conventions, dependencies, and contracts before editing. Consult version-matched official docs when framework behavior is uncertain.
- Implement the smallest complete change in the correct feature. Do not rewrite unrelated code or add unused scaffolding to demonstrate an architecture.
- A change is complete only when the real integration works, relevant states are handled, naming and boundaries conform, authored files meet the 300-line cap, and required checks pass.
- Review the diff for dead code, speculative wrappers, duplicate rules, unsafe data exposure, hidden fallbacks, and new serial work. Fix concrete issues before handoff.
- Report what changed, how it was verified, and any actual remaining blocker. Missing verification or unresolved requirements MUST remain visible; they cannot be replaced by confidence claims.

## Official references

The rules above combine documented framework behavior with explicitly chosen project standards. Consult the documentation for the exact versions installed; these links can evolve.

1. [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
2. [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
3. [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
4. [Next.js Proxy convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
5. [Next.js authentication](https://nextjs.org/docs/app/guides/authentication)
6. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
7. [Next.js data security](https://nextjs.org/docs/app/guides/data-security)
8. [Next.js mutations](https://nextjs.org/docs/app/getting-started/mutating-data)
9. [Next.js backend for frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
10. [Next.js ESLint configuration](https://nextjs.org/docs/app/api-reference/config/eslint)
11. [ESLint max-lines rule](https://eslint.org/docs/latest/rules/max-lines)
12. [TypeScript strict mode](https://www.typescriptlang.org/tsconfig/strict.html)
13. [Rules of React](https://react.dev/reference/rules)
14. [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
15. [React memo and React Compiler guidance](https://react.dev/reference/react/memo)
16. [Next.js fetching data](https://nextjs.org/docs/app/getting-started/fetching-data)
17. [Next.js caching](https://nextjs.org/docs/app/getting-started/caching)
18. [Next.js revalidation](https://nextjs.org/docs/app/getting-started/revalidating)
19. [OWASP API resource-consumption controls](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/)
20. [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling)
21. [Google Web Vitals](https://web.dev/articles/vitals)
22. [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading)
23. [Next.js image optimization](https://nextjs.org/docs/app/getting-started/images)
24. [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts)
25. [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
26. [Next.js Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)
27. [Next.js metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
28. [Next.js testing](https://nextjs.org/docs/app/guides/testing)
