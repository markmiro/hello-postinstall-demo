# hello-postinstall (Vercel app)

Minimal serverless app: `POST /api/telemetry` (empty body → `204`) so you can confirm invocations in the Vercel dashboard. Deploy with this folder as the project root (`apps/hello-postinstall`).

## Try it

A deployed instance is available at **https://hello-postinstall.vercel.app** — you can hit it without creating your own project. Example:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -X POST https://hello-postinstall.vercel.app/api/telemetry
```

You should see `204`. Check the deployment in the Vercel dashboard if you want to confirm the request was received.

## Deploy

You need a [Vercel](https://vercel.com) account. Install the CLI once (`npm i -g vercel`) or use `npx vercel` without a global install.

### Vercel CLI

From the repository root:

```bash
cd apps/hello-postinstall
vercel
```

The first run links the folder to a Vercel project and deploys a **preview**. Follow the prompts (team, scope, project name). Deploy to production with:

```bash
vercel --prod
```

Later deploys from the same directory reuse the linked project (see `.vercel` locally, which is gitignored).

### Git (dashboard)

In the Vercel dashboard, **Add New… → Project** and import this Git repository. Set **Root Directory** to `apps/hello-postinstall` so Vercel uses this app and not the monorepo root. Vercel will deploy on pushes according to your Git integration settings.

## How Vercel picks the project name

Nothing in `vercel.json` here sets the project name, and the `name` field in `package.json` is not what the Vercel CLI uses as its default suggestion.

- **Vercel CLI** (`vercel` / `vercel deploy`) from this directory: on first link, the CLI typically **suggests the current folder name** as the project name — here, **`hello-postinstall`**, if you accept the default.
- **Import from Git** in the Vercel dashboard: the new project is usually named after the **Git repository** (for this monorepo, commonly **`hello-postinstall-demo`** unless you rename it during setup).

You can always change the project name later in the Vercel project settings.
