#!/usr/bin/env bash
# Install deps for import-test-transitive and its subgraph (import-test → hello-postinstall).
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec pnpm install --filter import-test-transitive...
