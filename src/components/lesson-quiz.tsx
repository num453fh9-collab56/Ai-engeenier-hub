"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@/lib/quizzes";

function subscribe(cb: () => void) {
  window.addEventListener("quiz-score", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("quiz-score", cb);
    window.removeEventListener("storage", cb);
  };
}

export function LessonQuiz({ id, questions }: { id: string; questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const key = `quiz:${id}`;
  const stored = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null
  );
  const best = stored === null ? null : Number(stored);

  const answered = picked.filter((p) => p !== null).length;
  const score = picked.filter((p, i) => p === questions[i].answer).length;
  const done = answered === questions.length;

  function pick(qi: number, oi: number) {
    const next = picked.map((v, i) => (i === qi ? oi : v));
    setPicked(next);
    if (next.every((v) => v !== null)) {
      const s = next.filter((v, i) => v === questions[i].answer).length;
      try {
        localStorage.setItem(key, String(Math.max(best ?? 0, s)));
        window.dispatchEvent(new Event("quiz-score"));
      } catch {}
    }
  }

  return (
    <section className="not-prose mt-12 rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold">Check your understanding</h2>
          <p className="text-xs text-muted-foreground">
            {questions.length} quick questions
            {best !== null && ` · best score ${best}/${questions.length}`}
          </p>
        </div>
        {answered > 0 && (
          <button
            onClick={() => setPicked(questions.map(() => null))}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Retry
          </button>
        )}
      </div>

      <ol className="space-y-6">
        {questions.map((item, qi) => {
          const p = picked[qi];
          return (
            <li key={qi}>
              <p className="text-sm font-medium mb-2.5">
                {qi + 1}. {item.q}
              </p>
              <div className="grid gap-2">
                {item.options.map((opt, oi) => {
                  const isAnswer = oi === item.answer;
                  const state =
                    p === null
                      ? "border-border hover:border-primary/40 hover:bg-primary/5"
                      : isAnswer
                        ? "border-emerald-500/60 bg-emerald-500/10"
                        : p === oi
                          ? "border-rose-500/60 bg-rose-500/10"
                          : "border-border opacity-60";
                  return (
                    <button
                      key={oi}
                      disabled={p !== null}
                      onClick={() => pick(qi, oi)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${state}`}
                    >
                      {p !== null && isAnswer && <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />}
                      {p === oi && !isAnswer && <XCircle className="size-4 shrink-0 text-rose-500" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {p !== null && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className={p === item.answer ? "text-emerald-500" : "text-rose-500"}>
                    {p === item.answer ? "Correct. " : "Not quite. "}
                  </span>
                  {item.why}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {done && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <Trophy className="size-6 text-primary shrink-0" />
          <p className="text-sm">
            You scored <strong>{score}/{questions.length}</strong>.{" "}
            {score === questions.length
              ? "Perfect — you've got this lesson down."
              : "Review the sections above, or ask the AI tutor about what you missed."}
          </p>
        </div>
      )}
    </section>
  );
}
