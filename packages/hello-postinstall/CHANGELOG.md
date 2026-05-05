# hello-postinstall

## 0.0.4

### Patch Changes

- [`e740ffd`](https://github.com/markmiro/hello-postinstall-demo/commit/e740ffd05536c7dd0f9e966cbf36fa0766ca14fe) Thanks [@markmiro](https://github.com/markmiro)! - Add telemetry ID flow, browser opening, and `.npmrc`-based configuration to the postinstall script.

  - Generate and persist a per-install telemetry ID (fetched from the API) and use it in a per-ID telemetry route.
  - Open the telemetry URL in the user's browser on install.
  - Read configuration from `.npmrc` in addition to environment variables.
  - Encode file content into the URL instead of uploading a request body; show a length-limited preview.
  - Default to a random emoji when no file content is available, and log clearly when the configured file is missing.
  - Local telemetry is now the default for `import-test` installs; uploading a body is opt-in.
  - **Breaking:** rename env var `HELLO_POSTINSTALL_TELEMETRY_URL` → `HELLO_POSTINSTALL_URL`.

## 0.0.3

### Patch Changes

- [`8055082`](https://github.com/markmiro/hello-postinstall-demo/commit/80550829471ea714909948726874175ed2769d17) Thanks [@markmiro](https://github.com/markmiro)! - Postinstall now calls endpoint
