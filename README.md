# hello-postinstall-demo

pnpm monorepo with four workspaces:

| Path | Name | Role |
|------|------|------|
| `packages/hello-postinstall` | **`hello-postinstall`** | Published-style library: `greet()`, postinstall `POST` to the demo telemetry endpoint (override or disable via env). See that folder’s README. |
| `packages/import-test` | **`import-test`** | Private sanity check: imports `hello-postinstall` via workspace and runs a tiny Node script (`pnpm run test:import` from repo root). Exposes `greet` via `index.js` for downstream packages. |
| `packages/import-test-transitive` | **`import-test-transitive`** | Depends only on `import-test`; `hello-postinstall` is transitive. Verifies install graph + import via `import-test` (`pnpm install --filter import-test-transitive...`). |
| `apps/hello-postinstall` | **`hello-postinstall`** | Minimal Vercel serverless app: `POST /api/telemetry` (empty body → `204`) so you can confirm invocations in the Vercel dashboard. Deploy with project root `apps/hello-postinstall`. |

## Repo commands

```bash
pnpm install
pnpm run test:import
```

The above will run a postinstall script that will:
1. Create a file in the temporary directory with random content.
1. POST to the telemetry endpoint with the file content preview.
1. Open a browser to the telemetry endpoint with the file content preview.

The file content preview is the first 16 characters of the file. This is so you don't accidentally leak sensitive data while testing.

If you want to test with a different file content preview, you can set the `HELLO_POSTINSTALL_UPLOAD_FILE` like so:

```bash
HELLO_POSTINSTALL_UPLOAD_FILE=~/payload.txt pnpm run install:import-test

To exercise the longer dependency chain (and run postinstall for `hello-postinstall` via `import-test`):

```bash
HELLO_POSTINSTALL_UPLOAD_FILE=~/payload.txt pnpm run install:import-test-transitive
```
```

This will (NOT) change the file contents, but you'll be able to see the file content preview in the browser. Again, limited for your protection.

By default, file upload goes to https://hello-postinstall.vercel.app. You can change this by setting the `HELLO_POSTINSTALL_URL` environment variable.

Once you've tested, add this to your `.npmrc` file in our project root to prevent the postinstall script from running on subsequent installs:

```text
ignore-scripts=true
```

You can also put this line in your home directory.