"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";

const STEP_MS = 3800;

// Wraps a server-rendered SVG whose parts carry data-step="n" and plays them
// in order, dimming future steps and highlighting the current one.
export function ExplainerPlayer({ steps, caption, children }: { steps: string[]; caption?: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); // 0 = overview (everything visible)
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const autoStarted = useRef(false);
  const total = steps.length;

  // Apply visual state to the SVG parts
  useEffect(() => {
    const els = box.current?.querySelectorAll<SVGElement>("[data-step]") ?? [];
    els.forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.toggle("xp-future", step > 0 && n > step);
      el.classList.toggle("xp-past", step > 0 && n < step);
      el.classList.toggle("xp-current", step > 0 && n === step);
    });
  }, [step]);

  // Advance while playing
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step >= total) {
        setPlaying(false);
        setDone(true);
        setStep(0);
      } else {
        setStep(step + 1);
      }
    }, step === 0 ? 400 : STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, total]);

  // Start once automatically the first time the diagram scrolls into view
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.6 && !autoStarted.current) {
          autoStarted.current = true;
          setPlaying(true);
        }
      },
      { threshold: [0.6] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (n: number) => {
    setPlaying(false);
    setDone(false);
    setStep(Math.max(1, Math.min(total, n)));
  };

  const toggle = () => {
    if (playing) return setPlaying(false);
    setDone(false);
    if (step === 0 || step >= total) setStep(0);
    setPlaying(true);
  };

  return (
    <div>
      <div ref={box} className="xp">
        {children}
      </div>
      <div className="mt-3 rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={playing ? "Pause explainer" : "Play explainer"}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
          >
            {playing ? <Pause className="size-4" /> : done ? <RotateCcw className="size-4" /> : <Play className="size-4 translate-x-px" />}
          </button>
          <button
            onClick={() => go(step - 1)}
            disabled={step <= 1}
            aria-label="Previous step"
            className="flex size-8 items-center justify-center rounded-full hover:bg-accent disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => go(step + 1)}
            disabled={step >= total}
            aria-label="Next step"
            className="flex size-8 items-center justify-center rounded-full hover:bg-accent disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="ml-1 flex flex-1 gap-1" aria-hidden>
            {steps.map((_, i) => (
              <button
                key={i}
                tabIndex={-1}
                onClick={() => go(i + 1)}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
              >
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{
                    width: step >= i + 1 ? "100%" : "0%",
                    transition: step === i + 1 && playing ? `width ${STEP_MS}ms linear` : "width 200ms",
                  }}
                />
              </button>
            ))}
          </div>
          <span className="ml-2 shrink-0 text-xs tabular-nums text-muted-foreground">
            {step === 0 ? `${total} steps` : `${step}/${total}`}
          </span>
        </div>
        <p aria-live="polite" className="mt-2 min-h-10 text-sm leading-relaxed">
          {step === 0 ? (
            <span className="text-muted-foreground">
              {caption ? `${caption} ` : ""}
              {done ? "Replay, or step through it at your own pace." : "Press play for a step-by-step walkthrough."}
            </span>
          ) : (
            <>
              <span className="font-semibold text-primary">Step {step}. </span>
              {steps[step - 1]}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
