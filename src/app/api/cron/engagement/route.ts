import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/engagement/auth";
import { runEngagement } from "@/lib/engagement/run";

// Runs twice a week (see vercel.json). Add ?dryRun=1 to preview without sending,
// and &preview=1 to include the rendered HTML in the response.
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1" || process.env.ENGAGEMENT_DRY_RUN === "1";
  const withHtml = request.nextUrl.searchParams.get("preview") === "1";
  const results = await runEngagement({ dryRun });
  return NextResponse.json({
    dryRun,
    summary: {
      sent: results.filter((r) => r.action === "sent").length,
      previewed: results.filter((r) => r.action === "preview").length,
      skipped: results.filter((r) => r.action === "skipped").length,
      errors: results.filter((r) => r.action === "error").length,
    },
    results: results.map((r) => (withHtml ? r : { ...r, html: undefined })),
  });
}
