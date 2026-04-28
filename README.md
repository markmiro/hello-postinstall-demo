# hello-postinstall-demo

pnpm monorepo with three workspaces:

| Path | Name | Role |
|------|------|------|
| `packages/hello-postinstall` | **`hello-postinstall`** | Published-style library: `greet()`, optional macOS `say` on postinstall, optional telemetry `POST` when `HELLO_POSTINSTALL_TELEMETRY_URL` is set. See that folder’s README. |
| `packages/import-test` | **`import-test`** | Private sanity check: imports `hello-postinstall` via workspace and runs a tiny Node script (`pnpm run test:import` from repo root). |
| `apps/hello-postinstall` | **`hello-postinstall`** | Minimal Vercel serverless app: `POST /api/telemetry` (empty body → `204`) so you can confirm invocations in the Vercel dashboard. Deploy with project root `apps/hello-postinstall`. |

## Repo commands

```bash
pnpm install
pnpm run test:import
```
