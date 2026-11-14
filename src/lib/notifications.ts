"use client";

import { useSyncExternalStore } from "react";
import { streak, type Progress } from "@/lib/progress";
import type { TrackInfo } from "@/lib/tracks";

// Mubeen's on-site notifications. Built in the browser from the learner's
// saved progress (no login needed). Each notification has a stable id, so the
// same message is never created twice.

export type NotifKind = "welcome" | "near_certificate" | "certificate" | "streak_risk" | "streak_milestone" | "comeback" | "new_lesson";

export interface Notif {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  href: string;
  createdAt: string; // ISO
}

interface Store {
  items: Notif[];
  read: string[];
  seenLessons: string[] | null; // null = first visit (don't announce existing lessons)
  lastToastDay: string;
  lastVisitDay: string;
}

/** Messages worth a small pop-up (at most one per day). */
export const TOAST_KINDS: NotifKind[] = ["near_certificate", "certificate", "streak_risk", "new_lesson", "streak_milestone"];

const KEY = "aeh:notifications";
const EVT = "aeh:notifications";
const EMPTY: Store = { items: [], read: [], seenLessons: null, lastToastDay: "", lastVisitDay: "" };
const MAX_ITEMS = 20;
const MILESTONES = [3, 7, 14, 30, 60, 100];

const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const daysBetween = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);

let cacheRaw: string | null = null;
let cache: Store = EMPTY;

function read(): Store {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as Store) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    cache = s; // storage blocked: keep it for this tab
  }
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useNotifications(): Store {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function markRead(ids: string[]) {
  const s = read();
  write({ ...s, read: Array.from(new Set([...s.read, ...ids])).slice(-200) });
}

export function markToastShown() {
  write({ ...read(), lastToastDay: dayKey() });
}

/** The rules: decide which notifications should exist for this learner right now. */
export function syncNotifications(progress: Progress, tracks: TrackInfo[], now = new Date()) {
  const s = read();
  const today = dayKey(now);
  const nowIso = now.toISOString();
  const allLessons = tracks.flatMap((t) => t.lessons);
  const done = new Set(Object.keys(progress.completed));
  const next = allLessons.find((l) => !done.has(l.id));
  const fresh: Notif[] = [];
  const add = (n: Omit<Notif, "createdAt">) => fresh.push({ ...n, createdAt: nowIso });

  // 1) Welcome — very first visit
  if (s.seenLessons === null && allLessons[0]) {
    add({
      id: "welcome",
      kind: "welcome",
      title: "Hi, I'm Mubeen 👋",
      body: `I'll guide you from your first API call to production agents. Start with "${allLessons[0].title}".`,
      href: allLessons[0].href,
    });
  }

  // 2) New lessons since the last visit (not on the very first visit)
  if (s.seenLessons !== null) {
    const seen = new Set(s.seenLessons);
    for (const l of allLessons.filter((x) => !seen.has(x.id))) {
      add({ id: `new:${l.id}`, kind: "new_lesson", title: "New lesson 📢", body: `"${l.title}" is now live.`, href: l.href });
    }
  }

  // 3) Certificates: earned, or one lesson away
  for (const t of tracks) {
    const remaining = t.lessons.filter((l) => !done.has(l.id));
    const finished = t.lessons.length - remaining.length;
    if (remaining.length === 0 && t.lessons.length > 0) {
      add({ id: `cert:${t.category}`, kind: "certificate", title: `You finished ${t.label}! 🎓`, body: "Your certificate is ready — add your name and save it as a PDF.", href: `/certificate/${t.category}` });
    } else if (remaining.length === 1 && finished > 0) {
      add({ id: `near:${t.category}:${remaining[0].id}`, kind: "near_certificate", title: "One lesson to your certificate 🏆", body: `Finish "${remaining[0].title}" to complete ${t.label}.`, href: remaining[0].href });
    }
  }

  // 4) Streaks
  const s7 = streak(progress.days);
  const lastActive = progress.days.at(-1);
  const milestone = [...MILESTONES].reverse().find((m) => s7 >= m);
  if (milestone) {
    add({ id: `streak:${milestone}`, kind: "streak_milestone", title: `${milestone}-day streak! ⭐`, body: "Consistency is how real skills are built. Keep going!", href: "/progress" });
  }
  if (s7 >= 2 && lastActive && lastActive !== today && next) {
    add({ id: `risk:${today}`, kind: "streak_risk", title: `Keep your ${s7}-day streak 🔥`, body: `A few minutes on "${next.title}" today keeps it alive.`, href: next.href });
  }

  // 5) Coming back after a break
  if (s.lastVisitDay && daysBetween(s.lastVisitDay, today) >= 3 && next) {
    add({ id: `back:${today}`, kind: "comeback", title: "Welcome back! 👋", body: `Your progress is saved. Pick up with "${next.title}".`, href: next.href });
  }

  // Merge: keep existing, add only new ids, newest first
  const known = new Set(s.items.map((n) => n.id));
  const added = fresh.filter((n) => !known.has(n.id));
  const changed =
    added.length > 0 || s.seenLessons === null || s.lastVisitDay !== today || s.seenLessons.length !== allLessons.length;
  if (!changed) return;

  write({
    ...s,
    items: [...added.reverse(), ...s.items].slice(0, MAX_ITEMS),
    seenLessons: allLessons.map((l) => l.id),
    lastVisitDay: today,
  });
}
