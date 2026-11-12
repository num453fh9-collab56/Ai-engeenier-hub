// Fetch topic photos for lessons from Pixabay (free for commercial use).
// Usage:
//   node scripts/fetch-lesson-photos.mjs candidates <outDir>   -> downloads 4 previews per lesson + candidates.json
//   node scripts/fetch-lesson-photos.mjs pick <candidates.json> <choices.json>
//        choices.json = { "<lessonId>": <candidateIndex> }  -> saves to public/images/lessons + src/lib/lesson-photos.json
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

async function search(q) {
  const u = new URL("https://pixabay.com/api/");
  Object.entries({ key: KEY, q, image_type: "photo", orientation: "horizontal", safesearch: "true", per_page: "20", order: "popular", min_width: "1600" })
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
  for (const [id, q] of Object.entries(QUERIES).filter(([id]) => !only || id === only)) {
    const hits = (await search(q)).slice(0, 4);
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
    const file = `${id.replace("/", "--")}.jpg`;
    await download(c.largeImageURL, path.join(dir, file));
    meta[id] = { src: `/images/lessons/${file}`, alt: c.tags, author: c.user, source: c.pageURL };
    console.log("saved", file);
  }
  fs.writeFileSync("src/lib/lesson-photos.json", JSON.stringify(meta, null, 2) + "\n");
} else {
  console.log("usage: candidates <dir> | pick <candidates.json> <choices.json>");
}
