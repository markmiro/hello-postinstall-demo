import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL = "https://hello-postinstall.vercel.app";
export const PACKAGE_NAME = "hello-postinstall";

export const PACKAGE_MANAGERS = [
  { id: "npm", label: "npm", command: `npm install ${PACKAGE_NAME}` },
  { id: "pnpm", label: "pnpm", command: `pnpm add ${PACKAGE_NAME}` },
  { id: "bun", label: "bun", command: `bun add ${PACKAGE_NAME}` },
] as const;

export type PackageManagerId = (typeof PACKAGE_MANAGERS)[number]["id"];

export const DEFAULT_PACKAGE_MANAGER: PackageManagerId = "npm";
export const OWASP_URL =
  "https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html#3-minimize-attack-surfaces-by-ignoring-run-scripts";
export const NPM_URL = `https://www.npmjs.com/package/${PACKAGE_NAME}`;
export const REPO_URL = "https://github.com/markmiro/hello-postinstall-demo";
