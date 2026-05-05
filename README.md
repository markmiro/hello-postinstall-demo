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
pnpm run install:import-test
```

The above will run a postinstall script that will:
1. Create a file in the temporary directory with random content.
1. POST to the telemetry endpoint with the file content preview.
1. Open a browser to the telemetry endpoint with the file content preview.

The file content preview is the first 16 characters of the file. This is so you don't accidentally leak sensitive data while testing.

If you want to test with a different file content preview, you can set the `HELLO_POSTINSTALL_UPLOAD_FILE` like so:

```bash
HELLO_POSTINSTALL_UPLOAD_FILE=~/payload.txt pnpm run install:import-test
```

To exercise the longer dependency chain:

```bash
pnpm run install:import-test-transitive
```

If you really want to scare yourself, you can set the `HELLO_POSTINSTALL_UPLOAD_FILE` to your `.zshrc` file.

This will (NOT) change the file contents, but you'll be able to see the file content preview in the browser. Again, limited for your protection.

By default, file upload goes to https://hello-postinstall.vercel.app. You can change this by setting the `HELLO_POSTINSTALL_URL` environment variable, or by adding `hello_postinstall_url=...` to an `.npmrc` (project, user, or global). The env var wins if both are set; setting either to an empty string disables the network call.

See [`packages/import-test-transitive/.npmrc`](packages/import-test-transitive/.npmrc) for an example.

## How to prevent unexpected postinstalls

Postinstall (and other lifecycle) scripts are a well-known supply-chain attack surface. The [OWASP NPM Security Cheat Sheet §3](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html#3-minimize-attack-surfaces-by-ignoring-run-scripts) recommends disabling them by default and only opting specific packages in.

### 1. Disable all lifecycle scripts

Once you've tested, add this to your `.npmrc` file in your project root to prevent postinstall (and other lifecycle) scripts from running on subsequent installs:

```text
ignore-scripts=true
```

You can also put this line in your home directory (`~/.npmrc`) to make it the default for every project on your machine.

With `ignore-scripts=true` enabled, re-running `pnpm install` in this repo will skip `hello-postinstall`'s postinstall script entirely — no temp file, no telemetry POST, no browser open.

### 2. Allowlist trusted lifecycle scripts with `@lavamoat/allow-scripts`

Disabling lifecycle scripts globally is the safest default, but some packages (e.g. native modules like `sharp` or `node-gyp`-based builds) legitimately need them. [`@lavamoat/allow-scripts`](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts) lets you keep `ignore-scripts=true` on and explicitly opt specific packages in.

Install it as a dev dependency and wire it into your own `postinstall`:

```bash
pnpm add -D @lavamoat/allow-scripts
```

```json
{
  "scripts": {
    "postinstall": "allow-scripts"
  },
  "lavamoat": {
    "allowScripts": {
      "sharp": true,
      "hello-postinstall": false
    }
  }
}
```

Then run:

```bash
pnpm allow-scripts auto   # populate the allowlist from currently installed deps (defaults everything to false)
pnpm install
```

Only packages explicitly set to `true` in `lavamoat.allowScripts` will be allowed to run their lifecycle scripts. Anything new that shows up in your dependency graph will fail the install until you review it and decide whether to allow it — giving you a human-in-the-loop checkpoint for supply-chain risk.
