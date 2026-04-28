import { execFile } from "node:child_process";

function sayHello() {
  if (process.platform !== "darwin") return Promise.resolve();
  return new Promise((resolve) => {
    execFile("say", ["hello from postinstall script"], { stdio: "ignore" }, () =>
      resolve()
    );
  });
}

async function pingTelemetry() {
  const url = process.env.HELLO_POSTINSTALL_TELEMETRY_URL;
  if (!url || typeof fetch !== "function") return;
  try {
    await fetch(url, { method: "POST" });
  } catch (err) {
    console.warn("hello-postinstall: telemetry ping failed", err.message);
  }
}

await sayHello();
await pingTelemetry();
