import { NextResponse } from "next/server";

// Keep behavior identical to the previous serverless handler:
//   - POST with any (or empty) body  -> 204 No Content
//   - any other method               -> 405 Method Not Allowed
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
  return new NextResponse(null, { status: 204 });
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
