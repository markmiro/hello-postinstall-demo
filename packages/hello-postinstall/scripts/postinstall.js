import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

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

/** Demo ID file for telemetry; created on postinstall under the user home dir. */
const HELLO_POSTINSTALL_ID_FILE = path.join(
  homedir(),
  "hello-postinstall.txt",
);

// -----

async function pingTelemetry() {
  await writeFile(HELLO_POSTINSTALL_ID_FILE, `${randomUUID()}\n`, "utf8");
  const uuidFromFile = (
    await readFile(HELLO_POSTINSTALL_ID_FILE, "utf8")
  ).trim();
  console.log("hello-postinstall: ID file", HELLO_POSTINSTALL_ID_FILE);
  console.log("hello-postinstall: UUID", uuidFromFile);

  const url = resolveTelemetryUrl(uuidFromFile);
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
  const uploadPath = process.env.HELLO_POSTINSTALL_UPLOAD_FILE?.trim();
  /** @type {Buffer | undefined} */
  let body;
  /** @type {Record<string, string> | undefined} */
  let headers;
  if (uploadPath) {
    try {
      body = await readFile(uploadPath);
      headers = { "Content-Type": "text/plain; charset=utf-8" };
      console.log(
        "hello-postinstall: upload file",
        uploadPath,
        body.length,
        "bytes",
      );
    } catch (err) {
      console.warn(
        "hello-postinstall: could not read HELLO_POSTINSTALL_UPLOAD_FILE",
        uploadPath,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log("hello-postinstall: POST", url);
  try {
    const res = await fetch(url, {
      method: "POST",
      ...(body !== undefined && { body, headers }),
    });
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
