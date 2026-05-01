# hello-postinstall

Small package with `greet()` and a **`postinstall`** hook that sends a `POST` to the telemetry endpoint (same contract as `apps/hello-postinstall`: empty body, expect `204`).

## What postinstall does

On install, the script `POST`s to:

- **`https://hello-postinstall.vercel.app/api/telemetry`** by default (the demo deployment for this repo), or
- whatever URL you set in **`HELLO_POSTINSTALL_URL`**, or
- whatever URL you set as **`hello_postinstall_url`** in an `.npmrc` (project, user, or global). npm exposes `.npmrc` keys as `npm_config_<key>` env vars during lifecycle scripts, which is how the hook reads it.

Set **`HELLO_POSTINSTALL_URL`** (or `hello_postinstall_url` in `.npmrc`) to an empty string to skip the request entirely. The env var takes precedence over `.npmrc`.

Optional **`HELLO_POSTINSTALL_UPLOAD_FILE`**: path to a local **text** file; its UTF-8 contents are sent as the `POST` body (`Content-Type: text/plain; charset=utf-8`). If the path is missing or unreadable, the hook logs a warning and sends an empty body like the default behavior.

If `fetch` is not available (very old Node), the hook does nothing.

## Run the postinstall script

The hook is defined under `scripts.postinstall` in `package.json`. Installing dependencies runs **`postinstall` automatically**:

```bash
npm install
```

You can also run only the hook (no install):

```bash
npm run postinstall
```

To point at a local or forked server:

```bash
HELLO_POSTINSTALL_URL=http://localhost:3000/api/telemetry npm install
```

…or persist it for a project by adding an `.npmrc`:

```ini
hello_postinstall_url=http://localhost:3000/api/telemetry
```

To send a local file as the POST body:

```bash
HELLO_POSTINSTALL_UPLOAD_FILE=./payload.txt npm install
```

To disable the network call:

```bash
HELLO_POSTINSTALL_URL= npm install
```

…or in `.npmrc`:

```ini
hello_postinstall_url=
```
