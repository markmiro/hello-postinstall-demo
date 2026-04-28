# hello-postinstall

Small package with `greet()` and a **`postinstall`** hook that sends a `POST` to the telemetry endpoint (same contract as `apps/hello-postinstall`: empty body, expect `204`).

## What postinstall does

On install, the script `POST`s to:

- **`https://hello-postinstall.vercel.app/api/telemetry`** by default (the demo deployment for this repo), or
- whatever URL you set in **`HELLO_POSTINSTALL_TELEMETRY_URL`**.

Set **`HELLO_POSTINSTALL_TELEMETRY_URL`** to an empty string to skip the request entirely.

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
HELLO_POSTINSTALL_TELEMETRY_URL=http://localhost:3000/api/telemetry npm install
```

To disable the network call:

```bash
HELLO_POSTINSTALL_TELEMETRY_URL= npm install
```
