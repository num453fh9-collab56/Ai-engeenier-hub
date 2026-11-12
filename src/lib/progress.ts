"use client";

import { useSyncExternalStore } from "react";

// Client-only learning progress, stored per browser.
export interface Progress {
  completed: Record<string, string>; // lessonId -> ISO date completed
  days: string[]; // YYYY-MM-DD days with activity (sorted, unique)
}

const KEY = "aeh:progress";
const EVT = "aeh:progress";
const EMPTY: Progress = { completed: {}, days: [] };

let cacheRaw: string | null = null;
let cache: Progress = EMPTY;

function read(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const p = raw ? (JSON.parse(raw) as Progress) : EMPTY;
    cache = { completed: p.completed ?? {}, days: p.days ?? [] };
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
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

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function recordActivity() {
  const p = read();
  const t = today();
  if (p.days.includes(t)) return;
  write({ ...p, days: [...p.days, t].sort().slice(-400) });
}

export function setCompleted(lessonId: string, done: boolean) {
  const p = read();
  const completed = { ...p.completed };
  if (done) completed[lessonId] = completed[lessonId] ?? new Date().toISOString();
  else delete completed[lessonId];
  const t = today();
  write({ completed, days: p.days.includes(t) ? p.days : [...p.days, t].sort().slice(-400) });
}

// Consecutive active days ending today (or yesterday, so the streak isn't
// lost before the learner has had a chance to study today).
export function streak(days: string[]): number {
  if (!days.length) return 0;
  const set = new Set(days);
  const d = new Date();
  const fmt = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  if (!set.has(fmt(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(fmt(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
