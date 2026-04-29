import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

/** Default demo endpoint (Vercel app in this repo). Override with HELLO_POSTINSTALL_URL. */
const DEFAULT_TELEMETRY_URL =
  "https://hello-postinstall.vercel.app/api/telemetry";
const LOCAL_TELEMETRY_URL = "http://localhost:3000/api/telemetry";

function getDefaultTelemetryUrl() {
  if (process.env.NODE_ENV === "development") return LOCAL_TELEMETRY_URL;
  return DEFAULT_TELEMETRY_URL;
}

function resolveTelemetryUrl(randomId) {
  const env = process.env.HELLO_POSTINSTALL_URL;
  if (env === "") return null;
  if (env) return env;
  return `${getDefaultTelemetryUrl()}/${randomId}`;
}

function openBrowser(url) {
  const commands = {
    darwin: ["open", [url]],
    linux: ["xdg-open", [url]],
    win32: ["cmd", ["/c", "start", "", url]],
  };
  const [command, args] = commands[process.platform] || commands.linux;
  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore",
  });

  child.on("error", (err) => {
    console.warn("hello-postinstall: failed to open browser", err.message);
  });
  child.unref();
}

async function pingTelemetry() {
  const randomId = randomUUID();
  console.log("hello-postinstall: random ID", randomId);

  const url = resolveTelemetryUrl(randomId);
  if (!url) {
    console.log("hello-postinstall: skipping POST (no telemetry URL)");
    return;
  }
  console.log("hello-postinstall: opening", url);
  openBrowser(url);

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
