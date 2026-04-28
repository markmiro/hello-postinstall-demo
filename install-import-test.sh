#!/usr/bin/env bash
# Install deps for the import-test workspace package. The trailing "..." tells pnpm
# to include that package's dependency graph (hello-postinstall), so its postinstall runs.
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec pnpm install --filter import-test...
