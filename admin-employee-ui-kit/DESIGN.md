# Admin + Employee UI kit

Portable Admin and Employee frontends for a Next.js App Router app whose **user/public site already exists**. No backend and no database. Pages run on the in-memory mock layer in `src/lib/portal/`.

Follow this file when attaching the kit. Do not nest portal chrome under marketing layouts. Recolor by changing tokens only.

## 1. Token map

Source file: `tokens/portal-tokens.css`. Import it into the host `globals.css` **after** `@import "tailwindcss"` and **without** copying marketing fonts or public-site utilities.

Remap these CSS variables to the new project palette:

```css
--color-brand
--color-brand-deep
--color-secondary
--color-secondary-deep
--color-cream
--color-black
--color-white
```

Utilities the portals use:

- `bg-brand`, `text-brand`, `hover:bg-brand-deep`
- `bg-cream`, `text-cream`
- `bg-secondary`, `text-secondary`, `ring-secondary`
- `text-logo-gradient`, `bg-logo-gradient`

If the host already defines the same `--color-*` keys, keep the host values and only add missing keys plus the two logo-gradient utilities and the print rules (invoice/salary A4).

Do not overwrite host `@font-face` or `--font-sans` / marketing font tokens. Portals inherit the host body font.

Replace `public/portal/logo.png` with the new brand mark. Shells, login screens, and print documents read `/portal/logo.png`.

Branding strings live in `src/constants/site.ts` (`name`, `legalName`, `tagline`, `description`). If the host already has `src/constants/site.ts`, **keep the host file** and skip the kit copy. Login watermarks are in `src/constants/adminAuth.ts`, `src/constants/employeeAuth.ts`, and `src/constants/login.ts`.

## 2. Attach steps

1. Unzip so the folder `admin-employee-ui-kit/` is available.
2. Copy into the host app (typical `src/` layout):

   | Kit path | Host path |
   | --- | --- |
   | `src/app/admin/` | `src/app/admin/` |
   | `src/app/employee/` | `src/app/employee/` |
   | `src/components/admin/` | `src/components/admin/` |
   | `src/components/employee/` | `src/components/employee/` |
   | `src/components/ui/EmptyState.tsx` | merge; do not clobber a different host `EmptyState` |
   | `src/components/invoices/` | `src/components/invoices/` |
   | `src/components/salaries/` | `src/components/salaries/` |
   | `src/components/chat/` | `src/components/chat/` |
   | `src/components/dashboard/` | `src/components/dashboard/` |
   | `src/components/login/` | `src/components/login/` |
   | `src/components/sales/` | `src/components/sales/` |
   | `src/constants/admin.ts` and `employee.ts` (plus auth/demo/sales/login) | `src/constants/` — skip `site.ts` when the host already has it |
   | `src/lib/` (entire tree, including `portal/` and the `@/lib/data/*` + `submit*` shims) | `src/lib/` |
   | `src/schemas/` | `src/schemas/` |
   | `public/portal/` | `public/portal/` |
   | `tokens/portal-tokens.css` | host styles folder, then import from globals |

3. In host `globals.css`, add:

   ```css
   @import "./portal-tokens.css";
   ```

   (adjust the relative path). Do not paste kit tokens over existing marketing `@theme` fonts.

4. Confirm `@/*` maps to `src/*` (see `package-peer-deps.md`).
5. Register `/admin` and `/employee` as siblings of existing public routes. Do not put them inside a marketing route group.

## 3. Layout attachment

`src/app/admin/(panel)/layout.tsx` wraps pages in `AdminShell`. `src/app/employee/(panel)/layout.tsx` wraps pages in `EmployeeShell`. Print routes under `src/app/admin/(document)/` have no shell.

The host **root** `app/layout.tsx` must stay chrome-free: `html` / `body`, fonts, and CSS only. Move marketing header/footer into a `(site)` (or similar) route group that does **not** wrap `/admin` or `/employee`.

Do not nest `AdminShell` / `EmployeeShell` under the public site layout.

## 4. Theming recipe

Change colors only in `tokens/portal-tokens.css` (and host `@theme` if those vars already live there). Portal surfaces use `bg-cream` / `bg-brand` / `bg-brand-deep` rather than hardcoded JumpIfZero greens.

Print documents still use a gold header treatment; restyle those classes in `InvoiceDocument.tsx` / `SalarySlipDocument.tsx` only if the new brand needs a different print chrome.

## 5. Later API wiring

Until a backend exists, keep `src/lib/portal/`:

- `types.ts` — DTO shapes the UI expects
- `mockStore.ts` — in-memory seed data
- `session.ts` — `portal-session` cookie; any valid email + non-empty password signs in
- `actions.ts` — server actions matching current names (`createSalarySlipAction`, `loadAdminDomainAction`, …)

UI files import `@/lib/data/*` and `@/lib/submit*` shims. Those shims re-export portal actions. To wire a real API, replace the bodies of `src/lib/portal/actions.ts` and `src/lib/portal/session.ts`. Keep function names, result shapes (`{ ok: true } | { ok: false, reason }`), and component props unchanged.

### Mock login

- `/admin/login` — any email containing `@` and any password
- `/employee/login` — same; if the email contains `sales` (case-insensitive) the session is sales, otherwise delivery

Forgot-password submits succeed without sending mail.

## 6. Nav pruning

Admin groups are declared in `src/constants/admin.ts` as `adminNavGroups` (`home`, `ops`, `cms`, `people`). Employee nav is `employeeNavForKind` in `src/constants/employee.ts`.

To drop CMS or freight CRM from a leaner project:

1. Remove the group/items from `adminNavGroups` (and employee items if unused).
2. Delete the matching App Router group folders, for example:
   - CMS: `src/app/admin/(panel)/(cms-catalog)/`, `(cms-site)/`, `(cms-team)/`, `(cms-contact)/`, `(cms-callbacks)/`
   - CRM: `src/app/admin/(panel)/(crm-sales)/`, `(crm-leads)/` and employee `sales/`, `leads/`
3. Leave `AdminShell` / `EmployeeShell` as-is; they render whatever remains in the constants.

Do not leave a nav href whose page file was deleted.

## Mock data

`src/lib/portal/mockStore.ts` seeds one client, one invoice, one salary slip, delivery + sales employees, and a service page so lists are not empty. Mutations stay in process memory and reset on server restart.
