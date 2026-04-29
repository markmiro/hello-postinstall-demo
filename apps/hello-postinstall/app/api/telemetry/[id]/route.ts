import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelemetryContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: TelemetryContext) {
  const { id } = await context.params;
  return NextResponse.json({ id, ok: true });
}

export async function POST(request: Request) {
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
    headers: { Allow: "GET, POST" },
  });
}

export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
