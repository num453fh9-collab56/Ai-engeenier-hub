import { Workflow } from "lucide-react";
import { AutoVideo } from "@/components/auto-video";

// What happens in the video, node by node (left → right in the n8n canvas)
const STEPS = [
  ["Trigger", "“Executes Workflow Trigger” starts the run — another workflow, a schedule or a webhook can call it."],
  ["Prompt", "“Create User Prompt” builds one clear task from the input."],
  ["3 agents in parallel", "Sales, Marketing and Product AI agents each get the same prompt but their own role. Each uses an Azure OpenAI chat model."],
  ["Structured output", "Every agent returns JSON in a fixed shape (Structured Output Parser), so the next step can read it reliably."],
  ["Process", "Each branch recalls its data and a processor node cleans the agent's result."],
  ["Bundle", "“Bundle processor” merges the three results into one final answer — the aggregation step."],
];

/** Lesson embed: n8n multi-agent workflow video + a plain explanation of each node. */
export function N8nAgentsVideo() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col sm:flex-row">
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[15rem] shrink-0 bg-black sm:mx-0 sm:w-56">
          <AutoVideo
            src="/videos/n8n-agents.mp4"
            poster="/videos/n8n-agents.jpg"
            label="n8n workflow: a trigger fans out to Sales, Marketing and Product AI agents whose outputs are processed and bundled"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <figcaption className="flex-1 p-5 text-sm">
          <p className="mb-1 inline-flex items-center gap-1.5 font-semibold">
            <Workflow className="size-4 text-primary" /> Parallel sectioning, built in n8n
          </p>
          <p className="mb-4 text-muted-foreground">
            The same pattern as the table above — no code, just nodes. Follow the glowing lines:
          </p>
          <ol className="space-y-2.5">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="flex gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                <span>
                  <span className="font-semibold">{title}: </span>
                  <span className="text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </figcaption>
      </div>
    </figure>
  );
}
