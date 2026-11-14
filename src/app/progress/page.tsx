import type { Metadata } from "next";
import { getTracks } from "@/lib/tracks";
import { ProgressDashboard } from "@/components/progress-dashboard";
import { quizzes } from "@/lib/quizzes";

export const metadata: Metadata = {
  title: "My Progress",
  description: "Your learning dashboard: lessons, streaks, weekly goal, quiz scores, badges and certificates.",
  robots: { index: false },
};

export default function ProgressPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight mb-2">My Progress</h1>
      <p className="text-muted-foreground mb-8">
        Lessons, streaks, quiz scores and badges — finish every lesson in a track to unlock its certificate.
      </p>
      <ProgressDashboard tracks={getTracks()} quizSizes={Object.fromEntries(Object.entries(quizzes).map(([id, q]) => [id, q.length]))} />
    </div>
  );
}
