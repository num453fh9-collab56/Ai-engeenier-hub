import { NextRequest, NextResponse } from "next/server";
import { verifyId } from "@/lib/engagement/token";
import { setOptOut } from "@/lib/engagement/store";

// Handles both the form on /unsubscribe and Gmail/Outlook "one-click" unsubscribe.
export async function POST(request: NextRequest) {
  const u = request.nextUrl.searchParams.get("u") ?? "";
  const t = request.nextUrl.searchParams.get("t") ?? "";
  if (!verifyId(u, t)) return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  setOptOut(u);
  const fromForm = (request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded")
    && !(await request.clone().text()).includes("List-Unsubscribe=One-Click");
  return fromForm
    ? NextResponse.redirect(new URL(`/unsubscribe?done=1`, request.url), 303)
    : NextResponse.json({ ok: true });
}
