import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Bot, Briefcase, CalendarDays, CheckCircle2, Code2, FileSearch, GitBranch, Handshake, Lightbulb,
  MessageSquareText, Search, ShieldCheck, Target, Workflow, Wrench,
} from "lucide-react";
import { Cube, Ring, Sphere } from "@/components/shapes-3d";

export const metadata: Metadata = {
  title: "AI Engineer Career Guide — roles, 90-day plan, portfolio and freelancing",
  description:
    "A practical guide from learner to paid AI work: which AI roles exist, a 90-day study-and-build plan, what to put in your portfolio, how to find freelance clients and how to prepare for interviews.",
  alternates: { canonical: "/career" },
};

const ROLES = [
  {
    icon: Code2, title: "AI Engineer (LLM applications)",
    does: "Builds products on top of LLM APIs: chat assistants, RAG search, agents, structured data extraction.",
    skills: "Python or TypeScript, APIs, prompting, RAG, evaluation, deployment.",
    tracks: [["Foundations", "/docs/01-foundations/intro"], ["RAG", "/docs/02-rag/vector-dbs"], ["Agents", "/docs/03-agents/react-pattern"]],
  },
  {
    icon: Workflow, title: "AI Automation Specialist",
    does: "Connects AI to a business's tools — email, CRM, sheets, WhatsApp — with n8n, Make or code, to remove manual work.",
    skills: "Workflow tools, APIs and webhooks, tool calling, clear communication with non-technical clients.",
    tracks: [["Agents", "/docs/03-agents/react-pattern"], ["MCP", "/docs/03-agents/mcp"]],
  },
  {
    icon: Wrench, title: "ML / LLMOps Engineer",
    does: "Fine-tunes, serves and monitors models in production; owns cost, latency and reliability.",
    skills: "Python, GPUs and serving (vLLM), fine-tuning (LoRA), monitoring, cloud.",
    tracks: [["Fine-tuning", "/docs/04-finetuning/fine-tuning"], ["MLOps", "/docs/04-finetuning/mlops"]],
  },
  {
    icon: Lightbulb, title: "AI Solutions / Product Engineer",
    does: "Turns a business problem into a working AI feature: scopes it, prototypes, measures, and explains trade-offs.",
    skills: "Everything above at a practical level, plus cost estimates, evaluation and stakeholder communication.",
    tracks: [["Benchmarks & cost", "/benchmarks"], ["Safety", "/docs/04-finetuning/safety"]],
  },
];

const PLAN = [
  { weeks: "Weeks 1–3", title: "Foundations", items: ["Finish the Foundations track", "Call an LLM from code with structured outputs", "Post one short write-up of what you built"], href: "/docs/01-foundations/intro" },
  { weeks: "Weeks 4–6", title: "RAG + Capstone 1", items: ["Finish the RAG track", "Build the Document Q&A Assistant", "Measure it with your own eval set"], href: "/capstones/document-qa-assistant" },
  { weeks: "Weeks 7–9", title: "Agents + Capstone 2", items: ["Finish the Agents track", "Build the Customer-Support Agent", "Add guardrails and a human handoff"], href: "/capstones/customer-support-agent" },
  { weeks: "Weeks 10–12", title: "Production + Launch", items: ["Fine-tuning & MLOps lessons", "Build the Multi-Agent Research Tool (or polish 1 and 2)", "Publish your portfolio and start applying / pitching"], href: "/capstones/multi-agent-research-tool" },
];

const PORTFOLIO = [
  "2–3 finished projects on GitHub — each with a README, architecture diagram and \"how to run\"",
  "Real numbers: eval scores, latency and cost per request (not just \"it works\")",
  "A live demo or a 2-minute screen recording for every project",
  "One honest \"what went wrong and how I fixed it\" section per project",
  "A short LinkedIn or blog post for each project, linking to the repo",
  "A clean GitHub profile README listing your projects and skills",
];

const GIGS = [
  { icon: FileSearch, title: "\"Chat with our documents\" bots", text: "RAG over a company's PDFs, policies or manuals — with citations.", capstone: "/capstones/document-qa-assistant" },
  { icon: MessageSquareText, title: "Support & FAQ agents", text: "Website or WhatsApp assistants that answer questions and look up orders.", capstone: "/capstones/customer-support-agent" },
  { icon: Workflow, title: "Workflow automation", text: "n8n / Make / code pipelines: summarize emails, fill CRMs, draft replies, generate reports.", capstone: "/capstones/multi-agent-research-tool" },
  { icon: Bot, title: "Data extraction", text: "Turn invoices, CVs or forms into clean structured data (JSON / spreadsheets).", capstone: "/docs/01-foundations/intro" },
];

const PITCH = [
  ["Lead with a demo", "Build a tiny version on their public data (website FAQ, sample PDF) before the first call."],
  ["Sell a small pilot", "A fixed-scope, fixed-price first project with one measurable goal — easier to say yes to."],
  ["Promise outcomes you can measure", "\"Answers 80% of FAQ questions correctly on our test set\", not \"AI-powered\"."],
  ["Be honest about limits", "Explain hallucination risk, data handling and what still needs a human. Trust wins repeat work."],
  ["Protect their data", "Never paste client data into tools they haven't approved; sign an NDA if asked."],
];

const INTERVIEW = [
  ["How would you reduce hallucinations in a RAG system?", "/docs/02-rag/rag-eval"],
  ["How do you choose a chunk size — and how do you know it's right?", "/docs/02-rag/chunking"],
  ["When is keyword search better than embeddings?", "/docs/02-rag/hybrid-search"],
  ["Walk me through an agent loop. How do you stop it running forever?", "/docs/03-agents/react-pattern"],
  ["What is MCP and why would a company use it?", "/docs/03-agents/mcp"],
  ["When would you fine-tune instead of prompting or RAG?", "/docs/04-finetuning/fine-tuning"],
  ["How do you defend against prompt injection?", "/docs/04-finetuning/safety"],
  ["How would you estimate the monthly cost of an LLM feature?", "/benchmarks"],
];

export default function CareerPage() {
  return (
    <div className="flex-1 pb-20">
      <section className="bg-landing relative overflow-hidden px-4 py-14">
        <Ring className="-right-6 top-6" size={110} />
        <Cube className="left-[6%] bottom-6 hidden sm:block" size={36} delay={1} />
        <Sphere className="right-[18%] bottom-4 hidden md:block" size={30} delay={2} />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Career guide</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-5xl">From learner to paid AI work</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Learning is step one. This guide shows the roles you can aim for, a 90-day plan, what proof to build, and how
            to find your first job or freelance client.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2 text-sm">
            {[["Roles", "#roles"], ["90-day plan", "#plan"], ["Portfolio", "#portfolio"], ["Freelancing", "#freelancing"], ["Interviews", "#interviews"]].map(([l, h]) => (
              <a key={h} href={h} className="rounded-full bg-background/80 px-3 py-1 ring-1 ring-border hover:ring-primary/40">
                {l}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-12">
        {/* Roles */}
        <section id="roles" className="scroll-mt-24">
          <h2 className="mb-2 text-2xl font-bold">Which AI role fits you?</h2>
          <p className="mb-5 text-muted-foreground">Most people start as an AI engineer or automation specialist — both need coding, not a PhD.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {ROLES.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-card p-5">
                <r.icon className="mb-2 size-6 text-primary" />
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm">{r.does}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Skills: </span>
                  {r.skills}
                </p>
                <p className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  {r.tracks.map(([label, href]) => (
                    <Link key={href} href={href} className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary hover:bg-primary/15">
                      {label}
                    </Link>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Plan */}
        <section id="plan" className="scroll-mt-24">
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
            <CalendarDays className="size-6 text-primary" /> The 90-day plan
          </h2>
          <p className="mb-5 text-muted-foreground">
            About 1–2 hours a day. Set a weekly goal on your{" "}
            <Link href="/progress" className="font-medium text-primary hover:underline">Progress page</Link> to stay on track.
          </p>
          <ol className="relative space-y-4 border-l-2 border-primary/30 pl-6">
            {PLAN.map((p) => (
              <li key={p.weeks} className="relative">
                <span className="absolute -left-[33px] top-1 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.weeks}</p>
                  <h3 className="font-semibold">{p.title}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {p.items.map((i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {i}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Start <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="scroll-mt-24">
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
            <GitBranch className="size-6 text-primary" /> What a strong portfolio has
          </h2>
          <p className="mb-5 text-muted-foreground">Employers and clients trust proof. A certificate says you studied; a project with numbers shows you can deliver.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PORTFOLIO.map((p) => (
              <li key={p} className="flex gap-2.5 rounded-xl border border-border bg-card p-4 text-sm">
                <Target className="mt-0.5 size-4 shrink-0 text-primary" /> {p}
              </li>
            ))}
          </ul>
          <Link href="/capstones" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Build your 3 capstone projects <ArrowRight className="size-4" />
          </Link>
        </section>

        {/* Freelancing */}
        <section id="freelancing" className="scroll-mt-24">
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
            <Briefcase className="size-6 text-primary" /> Freelancing: your first paid AI work
          </h2>
          <p className="mb-5 text-muted-foreground">
            Small businesses want AI that saves them time — but don&apos;t know how to build it. These are the projects they
            commonly ask for, and each maps to something you build here.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {GIGS.map((g) => (
              <Link key={g.title} href={g.capstone} className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
                <g.icon className="mb-2 size-6 text-primary" />
                <h3 className="font-semibold group-hover:text-primary">{g.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{g.text}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Search className="size-4 text-primary" /> Where to find clients
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><b className="text-foreground">Freelance marketplaces</b> (Upwork, Fiverr): search for &ldquo;AI chatbot&rdquo;, &ldquo;RAG&rdquo;, &ldquo;n8n&rdquo;, &ldquo;automation&rdquo;. Start with small, well-defined jobs to earn reviews.</li>
                <li><b className="text-foreground">LinkedIn</b>: post your projects with a demo video; people who see the problem often reach out.</li>
                <li><b className="text-foreground">Local businesses</b>: clinics, schools, shops and agencies near you — offer a free 15-minute demo on their own FAQ.</li>
                <li><b className="text-foreground">Your network</b>: tell friends and family exactly what you build. Referrals are the warmest leads.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Handshake className="size-4 text-primary" /> How to win and keep them
              </h3>
              <ul className="space-y-2.5 text-sm">
                {PITCH.map(([t, d]) => (
                  <li key={t}>
                    <span className="font-semibold">{t}. </span>
                    <span className="text-muted-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            Rates and demand differ a lot by country, platform and experience, so we don&apos;t quote numbers. Check what
            similar gigs charge on the platform you use, start with a fair pilot price, and raise it as your reviews grow.
          </p>
        </section>

        {/* Interviews */}
        <section id="interviews" className="scroll-mt-24">
          <h2 className="mb-2 text-2xl font-bold">Interview questions to practise</h2>
          <p className="mb-5 text-muted-foreground">Common AI-engineering questions — each links to the lesson that answers it. Try explaining out loud first.</p>
          <ul className="space-y-2">
            {INTERVIEW.map(([q, href]) => (
              <li key={q}>
                <Link href={href} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-primary/40">
                  <span>{q}</span>
                  <ArrowRight className="size-4 shrink-0 text-primary" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Shaky on a term? The <Link href="/glossary" className="font-medium text-primary hover:underline">glossary flashcards</Link> are a quick warm-up.
          </p>
        </section>
      </div>
    </div>
  );
}
