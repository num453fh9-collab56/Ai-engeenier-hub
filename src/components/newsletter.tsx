"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Mail, Check, Loader2 } from "lucide-react";

interface NewsletterProps {
  variant?: "default" | "compact";
}

export function Newsletter({ variant = "default" }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (variant === "compact") {
    return (
      <div className="mt-12 rounded-lg border border-border bg-card p-5">
        <p className="text-sm font-medium mb-3">
          Get weekly AI Engineering breakdowns in your inbox.
        </p>
        {status === "success" ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="size-4" />
            <span>You&rsquo;re on the list! Check your inbox soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary",
                  status === "error" && "border-destructive"
                )}
              />
              {status === "error" && (
                <p className="mt-1 text-xs text-destructive">{errorMessage}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mail className="size-4" />
              )}
              Subscribe
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="relative rounded-2xl border border-border bg-gradient-to-b from-card to-muted/30 p-8 shadow-sm">
          <div className="absolute inset-0 rounded-2xl border border-primary/10 pointer-events-none" />

          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2.5 mb-4">
            <Mail className="size-5 text-primary" />
          </div>

          <h2 className="text-xl font-semibold tracking-tight mb-2">
            Stay in the Loop
          </h2>

          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Get weekly production-grade AI Engineering breakdowns &amp; code
            snippets in your inbox.
          </p>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 p-2">
                <Check className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                You&rsquo;re on the list! Check your inbox soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary",
                    status === "error" && "border-destructive"
                  )}
                />
                {status === "error" && (
                  <p className="mt-1.5 text-xs text-destructive text-left">{errorMessage}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Mail className="size-4" />
                )}
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
