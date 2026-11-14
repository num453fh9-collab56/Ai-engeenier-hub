"use client";

import { useSyncExternalStore } from "react";

// "My stack": tools a learner saved from the directory (kept in their browser).
const KEY = "aeh-my-stack";
const EMPTY: string[] = [];
let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    cache = [];
  }
  return cache ?? EMPTY;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      fn();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export function useMyStack(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleInStack(slug: string) {
  const now = read();
  cache = now.includes(slug) ? now.filter((s) => s !== slug) : [...now, slug];
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((fn) => fn());
}

/** Open the floating "Ask Mubeen" chat with a question already typed in. */
export function askMubeen(question: string) {
  window.dispatchEvent(new CustomEvent("ask-mubeen", { detail: { question } }));
}
