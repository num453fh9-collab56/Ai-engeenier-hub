"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { MubeenAvatar } from "@/components/mubeen-avatar";
import { useProgress } from "@/lib/progress";
import { markRead, markToastShown, syncNotifications, TOAST_KINDS, useNotifications } from "@/lib/notifications";
import type { TrackInfo } from "@/lib/tracks";

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function MubeenNotifications({ tracks }: { tracks: TrackInfo[] }) {
  const progress = useProgress();
  const store = useNotifications();
  const [open, setOpen] = useState(false);
  const [toastHidden, setToastHidden] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Re-run Mubeen's rules whenever progress changes (writes to storage, not React state)
  useEffect(() => {
    syncNotifications(progress, tracks);
  }, [progress, tracks]);

  // Close the panel on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const read = new Set(store.read);
  const unread = store.items.filter((n) => !read.has(n.id));

  // One gentle pop-up per day: the newest important unread message
  const toast =
    !toastHidden && !open && store.lastToastDay !== todayKey()
      ? unread.find((n) => TOAST_KINDS.includes(n.kind))
      : undefined;
  const dismissToast = () => {
    setToastHidden(true);
    markToastShown();
  };

  return (
    <>
      <div ref={boxRef} className="relative shrink-0">
        <button
          onClick={() => {
            setOpen((o) => !o);
            if (toast) dismissToast();
          }}
          aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
          aria-expanded={open}
          className="relative flex size-8 items-center justify-center rounded-md hover:bg-accent"
        >
          <Bell className="size-4" />
          {unread.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-50 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <MubeenAvatar size={28} />
              <span className="flex-1 leading-tight">
                <span className="block text-sm font-semibold">Mubeen</span>
                <span className="block text-[11px] text-muted-foreground">your AI mentor</span>
              </span>
              {unread.length > 0 && (
                <button onClick={() => markRead(unread.map((n) => n.id))} className="text-xs font-medium text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-[60vh] overflow-y-auto">
              {store.items.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">No messages yet — start a lesson!</li>
              )}
              {store.items.map((n) => {
                const isUnread = !read.has(n.id);
                return (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => {
                        markRead([n.id]);
                        setOpen(false);
                      }}
                      className={`flex gap-3 border-b border-border/60 px-4 py-3 transition-colors hover:bg-accent/50 ${isUnread ? "bg-primary/5" : ""}`}
                    >
                      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${isUnread ? "bg-primary" : "bg-transparent"}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold leading-snug">{n.title}</span>
                        <span className="block text-xs text-muted-foreground leading-relaxed">{n.body}</span>
                        <span className="mt-1 block text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Daily pop-up (bottom-left, away from the "Ask Mubeen" button) */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-4 left-4 z-50 flex w-[min(340px,calc(100vw-2rem))] gap-3 rounded-2xl border border-border bg-card p-3 shadow-2xl animate-fade-up"
        >
          <MubeenAvatar size={40} className="shrink-0" />
          <Link
            href={toast.href}
            onClick={() => {
              markRead([toast.id]);
              dismissToast();
            }}
            className="min-w-0 flex-1"
          >
            <span className="block text-sm font-semibold leading-snug">{toast.title}</span>
            <span className="block text-xs text-muted-foreground leading-relaxed">{toast.body}</span>
          </Link>
          <button onClick={dismissToast} aria-label="Dismiss" className="self-start text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      )}
    </>
  );
}
