import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const DEFAULT_FILE_PREVIEW_CHARS = 16;
const DEFAULT_FILE_NAME = "hello-postinstall.txt";
/** Emojis chosen at random when the greeting file is first created. */
const GREETING_EMOJIS = [
  "🎉",
  "✨",
  "🌟",
  "🚀",
  "💫",
  "🦋",
  "🌈",
  "🍀",
  "💖",
  "🎈",
  "☀️",
  "🌸",
  "🐙",
  "🍕",
  "🎵",
  "🪩",
  "🦄",
  "🌊",
  "🔥",
  "🎁",
  "🤝",
  "💻",
  "🌙",
  "🎨",
];

async function pingTelemetry() {
  // Find and read file
  const filePath = getUploadPath();
  console.log("hello-postinstall: file preview to upload:", filePath);
  await ensureFileExists(filePath);
  const telemetryUrl = getTelemetryUrl();

  // Open browser to telemetry URL with content preview
  const contentPreview = await readFilePrefix(
    filePath,
    getFilePreviewCharLimit(),
  );
  const urlToShow = `${telemetryUrl}/${encodeURIComponent(contentPreview)}`;
  console.log(
    "hello-postinstall: telemetry URL with content preview",
    urlToShow,
  );
  openBrowser(urlToShow);
}

console.log("hello-postinstall: running postinstall");
await pingTelemetry();

// ---

function getTelemetryUrl() {
  // If the user has set HELLO_POSTINSTALL_URL, use it.
  const envUrl = process.env.HELLO_POSTINSTALL_URL;
  if (envUrl === "") return null;
  if (envUrl) return envUrl;

  // npm exposes .npmrc keys as `npm_config_<key>` env vars during lifecycle
  // scripts, so `hello_postinstall_url=...` in .npmrc shows up here.
  const npmrcUrl = process.env.npm_config_hello_postinstall_url;
  if (npmrcUrl === "") return null;
  if (npmrcUrl) return npmrcUrl;

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

  return path.join(tmpdir(), DEFAULT_FILE_NAME);
}

async function ensureFileExists(filePath) {
  try {
    const contentPreview = await readFilePrefix(
      filePath,
      getFilePreviewCharLimit(),
    );
    const textPreview = contentPreview.trim();
    console.log("hello-postinstall: file exists: ", filePath);
    console.log("hello-postinstall: file preview:");
    console.log(textPreview || "(empty)");
    // If the file is not empty, return
    if (textPreview !== "") return;
  } catch {
    console.log("hello-postinstall: file does not exist", filePath);
    // ENOENT or unreadable
  }
  // If the file does not exist, create it with greeting + random emoji
  await writeFile(filePath, buildGreetingContent(), "utf8");
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

function buildGreetingContent() {
  const i = Math.floor(Math.random() * GREETING_EMOJIS.length);
  return `Hello 👋 ${GREETING_EMOJIS[i]}`;
}
