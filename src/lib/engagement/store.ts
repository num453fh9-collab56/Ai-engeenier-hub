import fs from "fs";
import path from "path";
import type { Learner, NudgeType } from "./types";

// LOCAL DEVELOPMENT STORE — a JSON file in /data (git-ignored).
// When the site goes live with accounts, replace these four functions with
// database queries (e.g. Postgres). Nothing else in the agent needs to change.

const FILE = path.join(process.cwd(), "data", "learners.json");

function load(): Learner[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Learner[];
  } catch {
    return [];
  }
}

function save(learners: Learner[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(learners, null, 2));
}

export function listLearners(): Learner[] {
  return load();
}

export function getLearner(id: string): Learner | undefined {
  return load().find((l) => l.id === id);
}

export function recordSend(id: string, type: NudgeType, at = new Date()) {
  const all = load();
  const l = all.find((x) => x.id === id);
  if (!l) return;
  l.sends.push({ at: at.toISOString(), type });
  save(all);
}

export function setOptOut(id: string) {
  const all = load();
  const l = all.find((x) => x.id === id);
  if (!l) return false;
  l.emailOptOut = true;
  save(all);
  return true;
}
