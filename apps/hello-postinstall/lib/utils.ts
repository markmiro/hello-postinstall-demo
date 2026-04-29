import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL = "https://hello-postinstall.vercel.app";
export const PACKAGE_NAME = "hello-postinstall";
export const INSTALL_COMMAND = `pnpm add ${PACKAGE_NAME}`;
export const OWASP_URL =
  "https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html#3-minimize-attack-surfaces-by-ignoring-run-scripts";
export const NPM_URL = `https://www.npmjs.com/package/${PACKAGE_NAME}`;
export const REPO_URL = "https://github.com/markmiro/hello-postinstall-demo";
