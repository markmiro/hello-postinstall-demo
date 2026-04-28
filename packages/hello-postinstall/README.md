# hello-postinstall

Small package with `greet()` and a **`postinstall`** hook that runs macOS `say`.

## Run the postinstall script

The hook is defined under `scripts.postinstall` in `package.json`. Installing dependencies runs **`postinstall` automatically**:

```bash
npm install
```

You can also run only the hook (no install):

```bash
npm run postinstall
```

On macOS, you should hear: “hello from postinstall script”. The `say` command is not available on other platforms unless you adapt the script.
