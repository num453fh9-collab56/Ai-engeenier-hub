// Fetch topic photos for lessons from Pixabay (free for commercial use).
// Usage:
//   node scripts/fetch-lesson-photos.mjs candidates <outDir>   -> downloads 4 previews per lesson + candidates.json
//   node scripts/fetch-lesson-photos.mjs pick <candidates.json> <choices.json>
//        choices.json = { "<lessonId>": <candidateIndex> }  -> saves to public/images/lessons + src/lib/lesson-photos.json
//   PHOTO_SET=2 node scripts/... -> second, mid-lesson photo set (Editor's Choice only)
//        -> saves *-2.jpg + src/lib/lesson-photos-2.json
import fs from "node:fs";
import path from "node:path";

const env = fs.readFileSync(".env.local", "utf8");
const KEY = env.match(/^PIXABAY_API_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) throw new Error("PIXABAY_API_KEY missing in .env.local");

export const QUERIES = {
  "01-foundations/intro": "python code laptop",
  "01-foundations/prompt-engineering": "chatbot smartphone",
  "01-foundations/transformers": "neural network abstract",
  "02-rag/hybrid-search": "magnifying glass search",
  "02-rag/vector-dbs": "database server",
  "02-rag/rag-eval": "data analytics dashboard",
  "03-agents/react-pattern": "robot artificial intelligence",
  "03-agents/swarms": "robots teamwork",
  "04-finetuning/fine-tuning": "mixing console knobs",
  "04-finetuning/groq-inference": "computer chip processor",
  "04-finetuning/mlops": "data center",
  "04-finetuning/safety": "cyber security lock",
};

// Second photo set: shown in the middle of each lesson
export const QUERIES_2 = {
  "01-foundations/intro": "programmer coding",
  "01-foundations/prompt-engineering": "artificial intelligence communication",
  "01-foundations/transformers": "artificial intelligence brain",
  "02-rag/hybrid-search": "data network digital",
  "02-rag/vector-dbs": "constellation network",
  "02-rag/rag-eval": "data visualization",
  "03-agents/react-pattern": "robot hand",
  "03-agents/swarms": "drones",
  "04-finetuning/fine-tuning": "precision engineering",
  "04-finetuning/groq-inference": "light speed",
  "04-finetuning/mlops": "control room monitors",
  "04-finetuning/safety": "cyber security",
};

const SET2 = process.env.PHOTO_SET === "2";
const ACTIVE = SET2 ? QUERIES_2 : QUERIES;
const SUFFIX = SET2 ? "-2" : "";
const META_FILE = SET2 ? "src/lib/lesson-photos-2.json" : "src/lib/lesson-photos.json";
// never reuse a photo that is already on the site
const USED = new Set(
  ["src/lib/lesson-photos.json", "src/lib/lesson-photos-2.json"]
    .filter((f) => fs.existsSync(f))
    .flatMap((f) => Object.values(JSON.parse(fs.readFileSync(f, "utf8"))).map((m) => m.source))
);

async function search(q) {
  const u = new URL("https://pixabay.com/api/");
  const params = { key: KEY, q, image_type: SET2 ? "all" : "photo", orientation: "horizontal", safesearch: "true", per_page: "20", order: "popular", min_width: "1600" };
  if (SET2) params.editors_choice = "true";
  Object.entries(params)
    .forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u);
  if (!r.ok) throw new Error(`Pixabay ${r.status} for "${q}": ${(await r.text()).slice(0, 120)}`);
  return (await r.json()).hits;
}

async function download(url, file) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status}`);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
}

const [mode, a, b] = process.argv.slice(2);

if (mode === "candidates") {
  const only = b; // optional: refresh a single lesson id
  fs.mkdirSync(a, { recursive: true });
  const out = {};
  const prev = only && fs.existsSync(path.join(a, "candidates.json")) ? JSON.parse(fs.readFileSync(path.join(a, "candidates.json"), "utf8")) : {};
  Object.assign(out, prev);
  for (const [id, q] of Object.entries(ACTIVE).filter(([id]) => !only || id === only)) {
    const hits = (await search(q)).filter((h) => !USED.has(h.pageURL)).slice(0, 4);
    out[id] = hits.map((h) => ({
      id: h.id, pageURL: h.pageURL, user: h.user, tags: h.tags,
      webformatURL: h.webformatURL, largeImageURL: h.largeImageURL,
    }));
    for (let i = 0; i < hits.length; i++) {
      await download(hits[i].webformatURL, path.join(a, `${id.replace("/", "__")}__${i}.jpg`));
    }
    console.log(id, hits.length);
  }
  fs.writeFileSync(path.join(a, "candidates.json"), JSON.stringify(out, null, 2));
} else if (mode === "pick") {
  const cands = JSON.parse(fs.readFileSync(a, "utf8"));
  const choices = JSON.parse(fs.readFileSync(b, "utf8"));
  const dir = "public/images/lessons";
  fs.mkdirSync(dir, { recursive: true });
  const meta = {};
  for (const [id, idx] of Object.entries(choices)) {
    const c = cands[id][idx];
    const file = `${id.replace("/", "--")}${SUFFIX}.jpg`;
    await download(c.largeImageURL, path.join(dir, file));
    meta[id] = { src: `/images/lessons/${file}`, alt: c.tags, author: c.user, source: c.pageURL };
    console.log("saved", file);
  }
  const prevMeta = fs.existsSync(META_FILE) ? JSON.parse(fs.readFileSync(META_FILE, "utf8")) : {};
  fs.writeFileSync(META_FILE, JSON.stringify({ ...prevMeta, ...meta }, null, 2) + "\n");
} else {
  console.log("usage: candidates <dir> | pick <candidates.json> <choices.json>");
}
