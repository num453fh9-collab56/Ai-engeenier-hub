import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/engagement/auth";
import { sendWelcome } from "@/lib/engagement/run";

// Called by our signup flow (later: the auth provider's "user created" webhook).
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { learnerId } = (await request.json().catch(() => ({}))) as { learnerId?: string };
  if (!learnerId) return NextResponse.json({ error: "learnerId is required" }, { status: 400 });
  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";
  return NextResponse.json(await sendWelcome(learnerId, { dryRun }));
}
