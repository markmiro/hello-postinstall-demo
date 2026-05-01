import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// POST accepts any body, drains it, responds with `{ id }` (nanoid) for the upload.
// GET and other methods -> 405 Method Not Allowed.
//
// This route is what the published `hello-postinstall` package POSTs to from
// its postinstall hook so deploys/installs can be observed in the Vercel
// dashboard. See packages/hello-postinstall/scripts/postinstall.js.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Drain the body so the request is fully consumed before we respond.
  if (request.body) {
    try {
      await request.text();
    } catch {
      // Ignore — we only care that the request arrived.
    }
  }
  const id = nanoid(10);
  const itemUrl = `${request.url}/${id}`;
  return NextResponse.json({ id, itemUrl });
}

function methodNotAllowed() {
  return new NextResponse(null, {
    status: 405,
    headers: { Allow: "POST" },
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
