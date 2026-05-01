import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const DEFAULT_FILE_PREVIEW_CHARS = 16;

async function pingTelemetry() {
  // Find and read file
  const filePath = getUploadPath();
  console.log("hello-postinstall: file to upload", filePath);
  await ensureFileExists(filePath);

  // Upload file to telemetry URL
  const telemetryUrl = getTelemetryUrl();
  console.log("hello-postinstall: telemetry URL", telemetryUrl);
  const telemetryUrlWithId = await uploadFile(telemetryUrl, filePath);

  // Open browser to telemetry URL with ID
  console.log("hello-postinstall: telemetry URL with ID", telemetryUrlWithId);
  openBrowser(telemetryUrlWithId);
}

console.log("hello-postinstall: running postinstall");
await pingTelemetry();

// ---

function getTelemetryUrl() {
  // If the user has set HELLO_POSTINSTALL_URL, use it.
  const url = process.env.HELLO_POSTINSTALL_URL;
  if (url === "") return null;
  if (url) return url;

  // Otherwise, use the default endpoint.
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api/telemetry";
  } else {
    return "https://hello-postinstall.vercel.app/api/telemetry";
  }
}

function getUploadPath() {
  const uploadPath = process.env.HELLO_POSTINSTALL_UPLOAD_FILE?.trim();
  if (uploadPath) {
    return uploadPath;
  }

  return path.join(tmpdir(), "hello-postinstall.txt");
}

async function ensureFileExists(filePath) {
  try {
    const contentPreview = await readFilePrefix(
      filePath,
      getFilePreviewCharLimit(),
    );
    const textPreview = contentPreview.trim();
    console.log("hello-postinstall: file exists", filePath);
    console.log("hello-postinstall: file preview", textPreview || "(empty)");
    // If the file is not empty, return
    if (textPreview !== "") return;
  } catch {
    console.log("hello-postinstall: file does not exist", filePath);
    // ENOENT or unreadable
  }
  // If the file does not exist, create it and write a random UUID to it
  await writeFile(filePath, randomUUID(), "utf8");
  console.log("hello-postinstall: file created", filePath);
}

function getFilePreviewCharLimit() {
  const configuredLimit =
    process.env.HELLO_POSTINSTALL_FILE_PREVIEW_CHARS?.trim();
  if (!configuredLimit) return DEFAULT_FILE_PREVIEW_CHARS;

  const parsedLimit = Number.parseInt(configuredLimit, 10);
  if (Number.isInteger(parsedLimit) && parsedLimit >= 0) {
    return parsedLimit;
  }

  return DEFAULT_FILE_PREVIEW_CHARS;
}

async function readFilePrefix(filePath, charLimit) {
  if (charLimit <= 0) return "";

  let content = "";
  const stream = createReadStream(filePath, {
    encoding: "utf8",
    highWaterMark: Math.max(charLimit, DEFAULT_FILE_PREVIEW_CHARS),
  });

  for await (const chunk of stream) {
    content += chunk;
    if (content.length >= charLimit) break;
  }

  return content.slice(0, charLimit);
}

async function uploadFile(url, filePath) {
  const body = await readFile(filePath);
  const headers = { "Content-Type": "text/plain; charset=utf-8" };
  const res = await fetch(url, { method: "POST", body, headers });
  console.log(
    "hello-postinstall: response",
    res.status,
    res.statusText || "(no status text)",
  );

  // Get ID from the response JSON
  const json = await res.json();
  return json.itemUrl;
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