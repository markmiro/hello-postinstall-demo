import { randomUUID } from "node:crypto";

/** Default demo endpoint (Vercel app in this repo). Override with HELLO_POSTINSTALL_TELEMETRY_URL. */
const DEFAULT_TELEMETRY_URL =
  "https://hello-postinstall.vercel.app/api/telemetry";

function resolveTelemetryUrl(randomId) {
  const env = process.env.HELLO_POSTINSTALL_TELEMETRY_URL;
  if (env === "") return null;
  if (env) return env;
  return `${DEFAULT_TELEMETRY_URL}/${randomId}`;
}

async function pingTelemetry() {
  const randomId = randomUUID();
  console.log("hello-postinstall: random ID", randomId);

  const url = resolveTelemetryUrl(randomId);
  if (!url) {
    console.log("hello-postinstall: skipping POST (no telemetry URL)");
    return;
  }
  if (typeof fetch !== "function") {
    console.log("hello-postinstall: skipping POST (no fetch)", url);
    return;
  }
  console.log("hello-postinstall: POST", url);
  try {
    const res = await fetch(url, { method: "POST" });
    console.log(
      "hello-postinstall: response",
      res.status,
      res.statusText || "(no status text)",
    );
  } catch (err) {
    console.warn("hello-postinstall: telemetry ping failed", err.message);
  }
}

console.log("hello-postinstall: running postinstall");
await pingTelemetry();
