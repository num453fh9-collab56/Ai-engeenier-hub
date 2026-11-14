"use client";

import { useSyncExternalStore } from "react";

// Capstone progress (ticked tasks + project links), kept in this browser.
export const CAPSTONE_KEY = "aeh-capstones";

export interface CapstoneState {
  done: string[];  // task ids like "2-1" (milestone index - task index)
  repo?: string;
  demo?: string;
}
type Store = Record<string, CapstoneState>;

const EMPTY: Store = {};
let cache: Store | null = null;
const listeners = new Set<() => void>();

function read(): Store {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(CAPSTONE_KEY) ?? "{}");
  } catch {
    cache = {};
  }
  return cache ?? EMPTY;
}

function write(next: Store) {
  cache = next;
  try {
    localStorage.setItem(CAPSTONE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useCapstones(): Store {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleTask(slug: string, taskId: string) {
  const s = read();
  const cur = s[slug] ?? { done: [] };
  const done = cur.done.includes(taskId) ? cur.done.filter((t) => t !== taskId) : [...cur.done, taskId];
  write({ ...s, [slug]: { ...cur, done } });
}

export function setLink(slug: string, field: "repo" | "demo", url: string) {
  const s = read();
  const cur = s[slug] ?? { done: [] };
  write({ ...s, [slug]: { ...cur, [field]: url.trim() || undefined } });
}

/** Only accept normal web links (no javascript: or data: URLs). */
export function safeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}
