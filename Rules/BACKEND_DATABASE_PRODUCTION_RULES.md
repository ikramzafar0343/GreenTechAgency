# Backend and Database Production Rules

**Owner:** Ikram Zafar  
**Reviewed:** 13 October 2026  
**Companion:** [NEXTJS_FRONTEND_PRODUCTION_RULES.md](./NEXTJS_FRONTEND_PRODUCTION_RULES.md)  
**Applies to:** Backend services, Next.js server entry points, database access, migrations, workers, integrations, and deployment configuration.

## 1. Authority, scope, and stack selection

- MUST is a release requirement. These rules preserve the frontend document's 300-line limit, feature ownership, camelCase/PascalCase naming, SOLID where useful, DRY, KISS, and prohibition on temporary production code.
- Backend framework, database engine, ORM, and hosting have not been supplied. General requirements below are mandatory across stacks; explicitly labeled PostgreSQL and Node.js details apply when those technologies are selected. Do not pretend a database or framework has already been chosen.
- For the existing Next.js frontend, use its server capabilities as the integration boundary. Keep a modular backend in the same deployment when sufficient; introduce a separate service only for a concrete runtime, scaling, ownership, or consumer requirement. [1][2]
- Before implementation, record the selected backend/runtime, database/version, data-access library, authentication solution, deployment mode, region, connection limits, and operating budgets. Read their version-matched official documentation; do not install speculative infrastructure.
- “Everything on the server” means all authoritative business rules, security decisions, secrets, and persistence operations execute on trusted servers. Browser presentation, interaction state, and convenience validation may remain client-side; none is a security boundary.
- “No slow queries or bottlenecks” is enforced through bounded work, query-plan review, representative load tests, and production measurements. It is not an absolute performance guarantee for unknown hardware, data volume, or traffic.

## 2. Mandatory server authority

| Concern | Authoritative execution and storage |
| --- | --- |
| Authentication, sessions, roles, permissions | Trusted authentication and authorization services; enforce on each protected operation. |
| Prices, discounts, totals, ownership, quotas, workflow transitions | Server business logic using current trusted records. |
| Database queries and credentials | Server-only data-access modules and approved database infrastructure. |
| Payment, email, storage, and other provider credentials | Server secret configuration; never shipped to the browser. |
| UI data | An explicit response object containing only permitted fields. |

- Treat requests, Server Action arguments, cookies, hidden fields, headers, resource IDs, and browser calculations as untrusted. Client-supplied totals or permission flags MUST NOT determine a committed result.
- Protect Next.js database, authentication, and secret-bearing modules with `import 'server-only'`. `'use server'` declares remotely callable Server Functions; it does not authenticate their callers. [1]
- Never give browsers direct database access or unrestricted public data APIs in this architecture; only approved backend workloads may access the database. Never place credentials in `NEXT_PUBLIC_` variables, React props, HTML, public files, source maps, logs, or downloadable configuration.
- A hidden button, protected page, layout redirect, CORS rule, or `proxy.ts` check MUST NOT replace operation-level authorization. Server Components and backend-to-backend calls also require the appropriate trusted identity and permissions. [1][3]

## 3. Feature architecture and ownership

| Location in the Next.js integration | Responsibility |
| --- | --- |
| `src/app/api/.../route.ts` | File-based HTTP entry points and transport-specific responses. |
| `src/features/account/actions/` | Server Action entry points for first-party account mutations. |
| `src/features/account/model/` | Contracts, input schemas, and pure feature rules safe for their consumers. |
| `src/features/account/server/` | Authorized use cases, focused query modules, and feature integrations. |
| `src/server/db/` | Connection lifecycle, transaction support, and database configuration. |
| `src/server/auth/`, `src/server/security/` | Shared identity, authorization infrastructure, and abuse controls. |
| `database/migrations/` | Ordered schema changes under the selected migration tool. |

- Create only needed modules. Entry points delegate to cohesive use cases; use cases own business policy and transaction boundaries; query modules own database operations. Shared infrastructure MUST NOT import feature implementations.
- Keep domain calculations independent of HTTP, React, and a specific ORM. Use narrow adapters at real external boundaries; do not add generic repositories, service locators, or pass-through layers without useful behavior.
- Keep dependencies acyclic. Expose narrow contracts for necessary cross-feature access; do not reach into another feature's private implementation or let unrelated modules write its tables arbitrarily.
- If the backend is separate, it owns its domain schema, authorization, and writes. Next.js calls its approved API through a server adapter; it MUST NOT bypass that API by accessing the same tables directly.
- A separate backend MUST verify delegated identity and permissions itself. Allowlist forwarded headers and strip spoofable identity/role headers; requests arriving through Next.js are not automatically trusted user actions.
- Server Components call an in-process authorized service or the separate backend directly. Do not send server reads through the same Next.js app's own HTTP Route Handler. Use Server Actions for mutations, not as a general query transport. [2]

## 4. Code quality, naming, and the 300-line cap

- Every hand-authored source, test, SQL migration, script, and configuration file MUST have at most 300 physical lines, including comments and blank lines. Split by responsibility before the limit; never minify or disable enforcement to pass.
- Explicitly exclude generated clients, machine-generated migrations, vendor files, lockfiles, and build output from the authoring cap; generated SQL still requires review. Do not split an already-applied migration or call hand-written code generated.
- Enforce ESLint `max-lines` with `max: 300`, `skipBlankLines: false`, and `skipComments: false`; check uncovered formats, including SQL, separately in CI. These limits are project standards, not database requirements. [29]
- Use camelCase for functions, variables, JSON fields, and source filenames such as `createAccount.ts`; PascalCase for types and necessary classes; `UPPER_SNAKE_CASE` for environment keys and fixed module constants. Keep framework filenames such as `route.ts` unchanged.
- For a new SQL schema, use consistent lowercase `snake_case` identifiers such as `account_id` and `created_at`, mapping them to camelCase in application contracts. This is a deliberate database naming policy; preserve an existing coherent schema convention.
- Enable strict typing where supported; validate runtime boundaries. No unexplained `any`, unsafe casts, ignored type errors, unused functions, TODO implementations, fake responses, test fixtures in production paths, or permissive fallback credentials.
- Apply SOLID through cohesive modules, small contracts, and substitutable adapters. Reuse business rules without merging unrelated behavior. Choose the simplest complete implementation and fail clearly when required configuration or dependencies are missing.

## 5. Authentication and session security

- Use a maintained authentication implementation with a documented session model. Require MFA for privileged administrative access and appropriate reauthentication for sensitive account changes; do not invent custom cryptography.
- For a browser-facing Next.js integration, prefer a same-origin session cookie with HttpOnly, Secure in production, explicit suitable SameSite, and the narrowest practical scope. Do not persist bearer credentials in `localStorage`. HttpOnly does not eliminate XSS or CSRF. [4]
- Rotate the session on login and privilege changes; implement server-enforced idle/absolute expiry and revocation on logout, compromise, and relevant account changes. Do not assume a browser cookie deletion revokes a server token.
- If using JWTs, verify signature, approved algorithm, issuer, audience, expiry, and required claims. Define revocation/permission-change behavior; decoding a token is not verification. Service credentials MUST NOT grant every forwarded user unrestricted access. [6]
- If passwords are managed locally, use a maintained adaptive password-hashing implementation such as Argon2id with current OWASP parameters and tested capacity. Never store plaintext, reversible passwords, or fast unsalted password hashes. [5]
- Recovery and verification tokens MUST be random, short-lived, single-use, and protected at rest. Apply abuse limits and avoid account-enumeration responses. An account-reset endpoint cannot become a bypass for MFA or authorization.

## 6. Authorization and tenant isolation

- Deny by default. Authorize the action, resource, tenant, and permitted fields on every entry point, including admin routes, background jobs, exports, WebSockets if used, and direct Server Action calls. [3]
- Derive actor identity from a verified session. Resolve tenant membership server-side; a submitted `tenantId`, `userId`, role, or opaque identifier never proves access.
- Scope reads and writes to the authorized subject/tenant in the database operation. Prevent check-then-write races through scoped conditional writes, relevant locks, or a suitable transaction; checking an object earlier does not make a later unrestricted update safe.
- For multi-tenant schemas, enforce tenant-consistent relationships, uniqueness, and ownership. Use composite keys/foreign keys or equivalent constraints where needed to prevent references to another tenant's records.
- PostgreSQL: If row-level security is adopted as defense in depth, test policies using the actual application role. Superusers and `BYPASSRLS` roles bypass it; owners normally do too unless configured otherwise. Do not treat enabled RLS as proof of isolation. [7]
- Never allow pooled connections to retain another request's tenant context. If context is carried in database settings, establish it from verified identity with transaction-local semantics and verify cleanup under the selected pooler.

## 7. API contracts and input safety

- Define each operation's input/output schema, identity requirement, permissions, limits, error codes, idempotency behavior, and freshness contract before connecting UI. Maintain a machine-readable contract for a separate HTTP API and detect frontend/backend drift in CI.
- Validate path/query/body values, content types, sizes, ranges, enumerations, array lengths, nested depth, and identifiers at the server boundary. Reject unauthorized writable fields; never spread an arbitrary request object into a database update. [8]
- Use parameterized queries or verified parameter-binding APIs. Never interpolate user input into SQL. Dynamic table names, sort expressions, and operators require fixed allowlisted mappings; value parameters do not make arbitrary SQL identifiers safe. [9]
- Return purpose-built response objects rather than raw ORM entities. Do not return password hashes, reset tokens, internal flags, database error text, stack traces, or fields the caller cannot access.
- Keep transport errors consistent: 400 for malformed requests, 401 for unauthenticated access, 403 for denied access, 404 for absent or deliberately concealed resources, 409 for conflicts, 413 for oversized requests, 429 for quotas, and suitable 5xx for service failures. [6]
- Use a documented error shape with a stable code, safe message, request ID, and field errors when applicable. Server Actions use typed action results; do not force HTTP response objects into their UI contract.
- Keep GET/HEAD free of business mutations. Protect cookie-authenticated mutations with framework-supported CSRF/origin controls or an appropriate token design; SameSite alone is not a complete defense. CORS is not authorization. [10]

## 8. Database design and integrity

- Select the database to match access patterns and consistency requirements. Relational/PostgreSQL guidance below does not justify silently choosing a different engine or imitating SQL guarantees in a store that lacks them.
- Define primary keys, required fields, uniqueness, foreign keys, and appropriate row-level checks in the database. Application validation improves error messages; constraints protect every writer, including concurrent requests. [11]
- Start with a coherent normalized model. Add denormalization only for a demonstrated read requirement with an explicit update/reconciliation owner. Avoid duplicate authoritative copies and JSON blobs that conceal core relationships.
- Store monetary values using exact decimal types or integer minor units plus currency and explicit rounding rules. Avoid floating-point money calculations and precision loss when serializing large integers/decimals to JavaScript.
- Store instants consistently using timezone-aware types where supported; preserve a named timezone separately when local calendar scheduling requires it. Define API timestamp/decimal serialization instead of relying on driver defaults.
- Define deletion, retention, and cascade behavior per relationship. Do not add universal soft deletion, cascading deletes, or nullable columns merely for convenience; ensure chosen semantics work with uniqueness and access rules.
- Store large files in an appropriate object store with database metadata and controlled access. Keep production personal data out of development fixtures; use synthetic or properly anonymized test datasets.

## 9. Query design: prevent slow work at its source

- Every production query MUST have a known purpose, bounded result or batch size, authorized scope, and finite execution budget. Avoid unbounded reads, arbitrary user-defined filters, and application-side filtering of whole tables.
- Select required columns. Eliminate N+1 access with appropriate joins, batching, or bounded relation loading; inspect ORM-generated SQL rather than assuming an ORM produces an efficient plan.
- Paginate at the database. Use a stable total order with a unique tie-breaker. Prefer keyset/cursor pagination for deep or growing datasets; allow offset pagination only for bounded use cases with measured cost. [12]
- Validate cursor structure and bind its meaning to the chosen filters/order; reapply authorization on every page. A cursor is a navigation token, not an access credential. Avoid expensive exact totals unless the UI truly needs them.
- Use query-plan evidence for critical paths and changed expensive queries against representative data distributions. Record query count, rows processed/returned, execution time, and relevant I/O; an empty local database is not evidence of scalability.
- PostgreSQL: Use `EXPLAIN` and, in a safe test environment, `EXPLAIN (ANALYZE, BUFFERS)`. `ANALYZE` executes the statement, including writes; never run an unreviewed mutation against production just to obtain a plan. [13]
- Investigate estimate errors, large sorts, spills, repeated loops, excessive reads, and lock waits. A sequential scan can be optimal; do not force indexes or ban all table scans regardless of table size and selectivity.
- Fix inefficient access patterns before adding caches, read replicas, partitioning, or larger machines. Introduce these only with measured need, operational ownership, and clear consistency behavior.

## 10. Index rules

- Design indexes around real filters, joins, authorization predicates, and ordering. Explain which query each non-constraint index supports and measure its read benefit against write/storage cost. [14]
- Choose composite-index column order from actual predicates and plans. Do not mechanically index every column, rely on an unverified universal “most selective first” rule, or keep duplicate indexes.
- PostgreSQL: Primary-key and unique constraints create supporting unique indexes. Foreign keys do not automatically create indexes on the referencing columns; assess those columns for join/delete/update needs. [11]
- Use partial, expression, covering, or specialized search indexes only when the query can benefit and the database/version supports them. Review function-wrapped filters, leading-wildcard searches, and large sorts for avoidable work.
- Review index usage over a representative workload period before removal, including rare critical reports. Keep planner statistics current and investigate regressions after data-growth or schema changes.

## 11. Connection pools, timeouts, and bounded concurrency

- Reuse the configured pool/client according to the runtime and driver lifecycle; do not create a new pool for every request. Release acquired connections on every success/failure path. [15]
- Budget total possible database connections across all instances and workers, plus migrations, monitoring, administration, and failover headroom. With direct pools, the sum of instance count × pool size must fit the allocated capacity; autoscaling cannot ignore this budget.
- For a managed proxy/pooler, separately budget its client connections and actual database backends. Verify compatibility with prepared statements, transactions, session settings, and the ORM; do not copy one pool size into every deployment.
- Set finite connection-acquisition, query/statement, lock-wait, transaction, HTTP, and upstream deadlines. Allocate inner work within the outer request budget, including queueing and cleanup; longer timeouts do not repair slow queries.
- PostgreSQL: Set appropriate role/session-level `statement_timeout`, `lock_timeout`, and `idle_in_transaction_session_timeout`; use `transaction_timeout` only on supported versions. Do not apply a short interactive timeout blindly to migrations or all database roles. [16]
- Ensure timed-out/disconnected requests do not leave expensive database work running unnecessarily. HTTP cancellation alone may not cancel a driver query; use supported cancellation and database-side timeouts.
- Bound concurrent requests, bulk batches, background workers, and wait queues. Shed overload with an explicit response; do not use unlimited `Promise.all`, unchecked queue growth, or a connection storm as scaling strategies.

## 12. Transactions, races, and idempotency

- Put related writes that must succeed together in one transaction on one connection. Keep transactions short; never hold database locks across user input, slow HTTP calls, payment requests, file uploads, or email delivery.
- Choose isolation and locking from the invariant. Default isolation does not automatically prevent lost updates, double spending, overselling, or duplicate business actions. Use constraints, atomic conditional updates, version checks, or appropriate locks. [17]
- Acquire multiple locks in a consistent order. Handle affected-row counts and conflicts explicitly; do not report a successful update when its ownership/version predicate matched nothing.
- Retry only classified transient errors within a bounded budget. A serialization failure generally requires retrying the whole transaction; never replay external side effects blindly. Timeouts can leave a write outcome uncertain. [17]
- For high-impact or repeatable mutations, implement durable idempotency scoped to actor/tenant and operation, with a payload fingerprint, atomic unique claim, defined retention, and replay behavior. Reject the same key with a different payload.
- Couple database changes to required asynchronous effects through a transactional outbox or an equivalent reliable design when needed. A separate database write followed by queue publication is not atomic by itself.
- Reconcile ambiguous provider outcomes using durable operation records and provider idempotency/status APIs. Never create a second charge or booking simply because the first response was lost.

## 13. Initial performance gates

These are project starting budgets for ordinary same-region interactive CRUD, not official framework guarantees or measurements of this project. Validate them against realistic data and intended peak traffic; record a reviewed operation-specific budget where requirements differ.

| Measurement/control | Initial gate |
| --- | --- |
| API server duration, including auth, pool wait, and database work | p95 ≤ 300 ms; p99 ≤ 1,000 ms. |
| Routine individual database statement execution | p95 ≤ 50 ms; p99 ≤ 200 ms. |
| Slow-query investigation trigger | ≥ 250 ms, or repeated smaller queries dominating total request cost. |
| Ordinary list page | Default 25 records; maximum 100; separate reviewed export path. |
| Ordinary JSON request body | Maximum 1 MiB; smaller per-route limits where possible; uploads handled separately. |

- Measure per operation and realistic tenant/data distribution, including cold/warm states, cache misses, concurrent writes, and burst traffic. Record hardware, regions, dataset size, request mix, throughput, errors, and p95/p99; do not report only averages.
- Define expected peak throughput, test duration, acceptable failure rate, pool headroom, and worker queue lag before the release test. Heavy reports, imports, uploads, and third-party-dependent calls need separate budgets and usually asynchronous execution.
- A release MUST NOT pass with unbounded work, unexplained contention, leaking connections, or unresolved critical-path regressions. Improve the implementation or document and review a justified requirement change; do not silently raise limits until the test passes.

## 14. Cache correctness

- Cache only when repeated work and freshness requirements justify it. Define owner, key dimensions, TTL, maximum size, invalidation events, stampede protection where needed, and behavior during cache failure.
- Never mix users or tenants in shared caches. Verify authorization before protected cache access, include relevant identity/scope dimensions, and prevent private responses from entering public CDN caches.
- Cache misses and invalidation failures require bounded origin load. A cache outage must not trigger unlimited concurrent database reads; protect the source with concurrency limits and a documented availability policy.
- Invalidate or update affected cached state after committed writes; handle failed invalidation reliably where stale data would violate correctness. Do not invalidate before a transaction that might roll back.
- Do not serve stale authorization, payment outcomes, or inventory guarantees as a hidden fallback. Redis or memory caches are not authoritative durable storage for critical records unless that durability model is deliberately designed.
- For Next.js, record the installed version and caching mode, and follow that model's APIs. Route refresh is not proof that all server/data caches were invalidated. [18]

## 15. Rate limiting and abuse prevention

- Enforce quotas server-side at every reachable operation, including Server Actions and direct backend routes. Use a shared atomic limiter or managed service across replicas; an in-process counter or client debounce is insufficient. [2][19]
- Define actor/tenant/operation quotas, anonymous abuse controls, burst windows, concurrency limits, payload limits, and paid-provider budgets. Trust forwarded IP headers only from configured infrastructure, and account for shared IPs.
- Apply cheap abuse controls before expensive parsing/authentication work where feasible, then identity-based limits after verification. Login, recovery, OTP, search, uploads, exports, and paid actions require suitable individual policies.
- Return 429 and safe Retry-After timing where known; use typed results for Server Actions. Distinguish a rejected quota from limiter unavailability.
- For authentication-sensitive, privileged, or paid operations, limiter/security dependency failure MUST NOT bypass protection. Stop with an explicit temporary failure. No fallback to an unprotected write, local counter, demo response, or fake success.
- Test boundary counts, expiry, parallel attempts, multi-instance behavior, outage behavior, and cross-route quota bypass. Monitor legitimate-user rejection and cost as well as blocked requests.

## 16. Jobs, webhooks, and external effects

- Use durable workers for work that must survive a request/process ending. Do not rely on a request's unawaited promise, an in-memory timer, or serverless local disk for critical background execution.
- Jobs need bounded concurrency, retry/backoff limits, timeouts, idempotent processing, observability, and a recoverable failed-job path. Assume duplicate delivery unless the actual system contract proves otherwise.
- Authenticate job/webhook entry points. Verify provider signatures using the exact payload representation their specification requires, enforce freshness/replay protection where supported, and reject unsupported events before side effects.
- Deduplicate provider event IDs durably, acknowledge only after safe acceptance, and handle events arriving out of order. A browser redirect or supplied “paid” flag is not authoritative payment confirmation.
- Reuse domain rules across UI, jobs, and webhooks without trusting their input equally. Give workers scoped credentials, and recheck current permissions or a carefully defined durable authorization grant at execution time.

## 17. Network, secrets, and file security

- Keep databases and caches reachable only by approved workloads through private networking or tight access controls. Use encrypted transport with certificate verification; separate application, migration, backup, and administrative credentials with least privilege. [20]
- Manage secrets outside source control; validate configuration without printing secret values. Support credential rotation and environment isolation. Encrypt sensitive stored data and backups using managed keys with controlled access. [21]
- Restrict server-side outbound requests to expected destinations and protocols. For user-supplied URLs, validate resolved destinations and redirects, block internal/metadata access as appropriate, and use egress controls; naive string matching does not prevent SSRF. [22]
- Enforce upload size/type/content rules, server-controlled object names, private access where needed, and scanning or content transformation appropriate to the risk. Short-lived scoped upload URLs are allowed; authorization and final object validation remain server-owned. [23]
- Do not expose admin, diagnostics, metrics, database consoles, or stack traces publicly. Configure appropriate response security headers, allowed methods/origins, and safe cookie handling; do not reflect arbitrary headers or destinations.
- Node.js: Avoid synchronous I/O and unbounded CPU work in request handlers, including pathological regex, huge JSON, and blocking transforms. Use bounded workers/jobs where justified; adding async does not make CPU work non-blocking. [24]

## 18. Migrations and safe releases

- Apply schema changes through reviewed, versioned migrations run by one controlled deployment step. Never run auto-sync, destructive schema reset, or competing migrations from every application replica.
- Do not edit an applied migration. Use additive expand-and-contract changes for live compatibility: add supported structure, deploy compatible code, backfill in bounded resumable batches, verify, and remove old structure in a later release.
- Review lock behavior, table rewrites, index-build duration, disk headroom, and compatibility before large changes. Test on production-like data; a migration that passes against an empty database is insufficient evidence.
- PostgreSQL: Consider `CREATE INDEX CONCURRENTLY` for appropriate live index changes, accounting for extra work and failure cleanup. It cannot run inside a transaction block; configure the migration tool accordingly. [25]
- Define rollback or forward-repair actions for both application and schema changes. Do not assume destructive down-migrations can recover deleted data, or that restoring a whole database is harmless to newer valid writes.
- Validate migration ordering, checksums/status, fresh installation, upgrade from the previous release, backfill restart, and mixed-version application compatibility where rolling deployments require it.

## 19. Backups and database operations

- Define recovery-point and recovery-time objectives, backup retention, responsible owners, and a tested restore procedure before production. Automated successful backup jobs are not proof that the application can recover.
- Keep encrypted backups and recovery credentials appropriately isolated. Perform scheduled restore drills that verify schema, recent data, application access, and actual recovery duration.
- PostgreSQL: Configure base backups plus required WAL retention/archiving when point-in-time recovery is part of the recovery objective. Monitor archive failures and recovery coverage; a replica alone is not a backup. [26]
- Monitor capacity, disk/WAL growth, replication lag if applicable, locks, long transactions, and connection saturation. Maintain statistics and vacuum/autovacuum health rather than disabling maintenance to hide load. [27]
- Route reads requiring current committed state to an appropriate source. Replicas can lag; do not send read-after-write confirmation or authoritative security checks to a stale replica without a correctness mechanism.
- Patch supported runtime/database versions, isolate environments, and document incident recovery. Gracefully drain traffic/workers during shutdown and close connections using the deployment's supported lifecycle.

## 20. Errors, telemetry, and audit records

- Keep expected validation/business errors distinct from infrastructure exceptions. Never convert a failed query into an empty result, zero balance, missing account, or successful mutation.
- Use structured logs and correlated traces across request, query, worker, and provider calls. Measure errors, timeouts, throughput, latency distributions, pool wait, lock wait, query count, cache behavior, and queue delay.
- PostgreSQL: Use `pg_stat_statements` or managed equivalents for high-total-cost query fingerprints and execution statistics. Obtain p95/p99 from suitable duration histograms/traces; an aggregate mean is not a percentile. [28]
- Redact secrets, session tokens, sensitive query parameters, and unnecessary personal data. Restrict log access and retention; logging full request bodies or bind values by default is prohibited. [30]
- Record important authentication, permission, administrative, and sensitive data changes in access-controlled audit records with actor, target, action, time, and outcome. Protect audit integrity without turning the primary request path into unbounded logging work.
- Log unexpected failures at the responsible boundary, alert on actionable symptoms, and avoid retry/log storms. Health/readiness checks MUST be cheap and must not create a database load spike during an incident.

## 21. Frontend-to-backend integration procedure

1. Inventory actual frontend data needs and mutations. Choose same-deployment services or a separate backend, and record one authoritative owner per operation; avoid duplicate business implementations.
2. Define schemas, permission rules, allowed response fields, pagination, error mapping, limits, and transaction/idempotency requirements. Implement the database constraints and efficient access paths these contracts require.
3. Implement authorized server services first. Expose required Server Actions or file-based Route Handlers; when the backend is separate, add one focused server adapter and authenticate both the calling workload and relevant user context.
4. Fetch initial server-rendered data through authorized services. For client-initiated reads/mutations, use the approved entry point; never import the database driver or service credentials into a Client Component.
5. Connect forms and interactions to real typed results. Preserve pending, validation, permission, not-found, conflict, rate-limit, and failure states. Display success only after the committed or explicitly accepted outcome.
6. Verify cache behavior and read-after-write consistency, remove temporary datasets and unused adapters, and confirm private information is absent from browser responses and bundles.
7. Test real complete journeys against the production-like backend/database, including tampered inputs and direct endpoint calls. Keep the existing frontend design and routing intact unless a required integration change is explicitly part of the task.

## 22. Required verification and definition of done

- CI MUST enforce formatting, strict types, lint, naming/import boundaries, the 300-line cap, dependency/secret checks, contract checks, relevant tests, migration validation, and the production build. Never suppress checks to make a release pass.
- Use real database integration tests for constraints, transactions, queries, and isolation. Test unauthenticated access, role/tenant/object/field denial, CSRF, input tampering, duplicate submission, and meaningful race conditions.
- Test database/provider/limiter timeouts, rollback, cancellation, uncertain write outcomes, duplicate/out-of-order webhooks, worker restarts, and pool exhaustion where applicable. Add behavioral regression checks rather than superficial implementation tests.
- Run representative load tests and inspect critical query plans. Supply evidence for the Section 13 budgets and deployment capacity; do not call the system fast or secure merely because the happy path works locally.
- Verify restore capability, migration safety, monitoring, secrets, least-privilege credentials, and a usable incident/rollback procedure before release. Review high-risk authentication or sensitive-operation changes proportionately.
- Completion requires real integrations, enforced server authority, bounded work, correct persistence, verified frontend behavior, and passing applicable gates. Report exact blockers and unrun checks; never fill gaps with temporary code or claim tests that were not performed.

## Official references

Sources describe framework behavior and security/database techniques. Naming, file length, architecture choices, and initial numeric budgets above are explicit project policies. Follow the selected versions; documentation at these URLs may evolve.

1. Next.js data security
2. Next.js backend for frontend
3. OWASP authorization
4. OWASP session management
5. OWASP password storage
6. OWASP REST security
7. PostgreSQL row security
8. OWASP input validation
9. OWASP SQL injection prevention
10. OWASP CSRF prevention
11. PostgreSQL constraints
12. PostgreSQL LIMIT and OFFSET
13. PostgreSQL EXPLAIN
14. PostgreSQL multicolumn indexes
15. node-postgres pool sizing
16. PostgreSQL timeouts and connection defaults
17. PostgreSQL transaction isolation
18. Next.js caching
19. OWASP unrestricted resource consumption
20. OWASP database security
21. OWASP secrets management
22. OWASP SSRF prevention
23. OWASP file upload security
24. Node.js event loop and worker pool
25. PostgreSQL CREATE INDEX
26. PostgreSQL continuous archiving and recovery
27. PostgreSQL routine vacuuming
28. PostgreSQL pg_stat_statements
29. ESLint max-lines
30. OWASP logging
