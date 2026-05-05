---
"hello-postinstall": patch
---

Add telemetry ID flow, browser opening, and `.npmrc`-based configuration to the postinstall script.

- Generate and persist a per-install telemetry ID (fetched from the API) and use it in a per-ID telemetry route.
- Open the telemetry URL in the user's browser on install.
- Read configuration from `.npmrc` in addition to environment variables.
- Encode file content into the URL instead of uploading a request body; show a length-limited preview.
- Default to a random emoji when no file content is available, and log clearly when the configured file is missing.
- Local telemetry is now the default for `import-test` installs; uploading a body is opt-in.
- **Breaking:** rename env var `HELLO_POSTINSTALL_TELEMETRY_URL` → `HELLO_POSTINSTALL_URL`.
