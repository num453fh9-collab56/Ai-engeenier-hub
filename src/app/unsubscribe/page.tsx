import type { Metadata } from "next";
import Link from "next/link";
import { MailX, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ u?: string; t?: string; done?: string }>;
}) {
  const { u = "", t = "", done } = await searchParams;
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        {done ? (
          <>
            <CheckCircle2 className="mx-auto mb-3 size-10 text-emerald-500" />
            <h1 className="mb-2 text-xl font-bold">You&apos;re unsubscribed</h1>
            <p className="mb-6 text-sm text-muted-foreground">We won&apos;t send you learning reminders anymore. Your progress is still saved.</p>
            <Link href="/" className="text-sm font-medium text-primary hover:underline">Back to AI Engineering Hub</Link>
          </>
        ) : (
          <>
            <MailX className="mx-auto mb-3 size-10 text-muted-foreground" />
            <h1 className="mb-2 text-xl font-bold">Stop learning reminders?</h1>
            <p className="mb-6 text-sm text-muted-foreground">You&apos;ll no longer get progress and streak emails. You can keep using the site as usual.</p>
            <form method="POST" action={`/api/unsubscribe?u=${encodeURIComponent(u)}&t=${encodeURIComponent(t)}`}>
              <button className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Unsubscribe</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
