# hello-postinstall (Vercel app)

Next.js 15 (App Router) site for the [`hello-postinstall`](https://www.npmjs.com/package/hello-postinstall) npm package, plus the telemetry endpoint the package's `postinstall` hook POSTs to.

- **Page** (`/`) — minimal, server-rendered, JS-free landing page (title, description, install command, OWASP link). SEO via metadata + JSON-LD + `sitemap.xml` + `robots.txt`.
- **API** (`POST /api/telemetry`) — empty body → `204`; any other method → `405`. Same contract as before.

Stack: Next.js 15, React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), shadcn-style aliases (`@/components`, `@/lib`, `@/hooks`), neutral base color, Inter via `@fontsource-variable/inter`.

## Local dev

```bash
pnpm install
pnpm --filter hello-postinstall-vercel-app dev
```

## Try the API

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -X POST https://hello-postinstall.vercel.app/api/telemetry
```

Expect `204`.

## Deploy to Vercel

You need a [Vercel](https://vercel.com) account.

### Vercel CLI

From the repository root:

```bash
cd apps/hello-postinstall
vercel        # preview
vercel --prod # production
```

The first run links the folder to a Vercel project (gitignored `.vercel`). Vercel auto-detects Next.js (also pinned in `vercel.json`).

### Git (dashboard)

In the Vercel dashboard, **Add New… → Project** and import this Git repository. Set **Root Directory** to `apps/hello-postinstall`.

## Notes

- The page works with JavaScript disabled. Next.js still ships a small client runtime by default; nothing on the page depends on it.
- `app/api/telemetry/route.ts` replaces the previous `api/telemetry.js` serverless function. The contract is unchanged.
