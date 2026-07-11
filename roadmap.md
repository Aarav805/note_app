# Advanced Study Notes App — Build Roadmap

A personal note-taking app with 5 advanced features: spaced repetition, linked/graph notes, semantic search, AI summarization/quiz generation, and handwriting OCR.

**Guiding principle:** Build the boring core first and make it solid. Every advanced feature sits on top of that foundation — if the foundation is shaky, every feature above it inherits the bugs.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript + Vite | Fast dev loop, type safety catches bugs early, huge ecosystem |
| Styling | Tailwind CSS | Fast to build with, no context-switching to separate CSS files |
| Editor component | [TipTap](https://tiptap.dev) (rich text) or plain Markdown + [react-markdown](https://github.com/remarkjs/react-markdown) | TipTap gives you a real WYSIWYG editor; Markdown is simpler to store/search/diff |
| Local storage | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (Node backend) | Real relational DB, zero config, file-based — easy to inspect and back up |
| Backend | Node.js + Express (TypeScript) | Same language as frontend, minimal context switching |
| Graph visualization | [react-force-graph](https://github.com/vasturiano/react-force-graph) or D3.js directly | Force-directed graphs are the standard for Zettelkasten-style note links |
| Embeddings (semantic search) | OpenAI `text-embedding-3-small` API, or a free local model via [Transformers.js](https://huggingface.co/docs/transformers.js) | Start with the API (simpler), swap to local later if you want zero-cost/offline |
| LLM features (summarize/quiz gen) | Anthropic or OpenAI API | You already have Claude API access via your work context — same pattern applies here |
| OCR | [Tesseract.js](https://tesseract.projectnaptha.com/) (runs in-browser, free) | No server needed, works entirely client-side |

You don't need a mobile app, cloud sync, or user accounts for a personal project — resist scope creep there. Single-user, local-first, running on your own machine is enough.

---

## Phase 0: Setup (Days 1–2)

- [ ] `npm create vite@latest` → React + TypeScript template
- [ ] Set up Express backend as a separate folder (`/server`) or use Vite's proxy to a local API
- [ ] Initialize SQLite DB with a `notes` table: `id, title, content, created_at, updated_at, tags`
- [ ] Get a basic "create note → save to DB → list notes → open note" loop working end to end
- [ ] Push to a GitHub repo from day one, commit often — this is part of your application story (shows process, not just a finished product)

**Goal by end of Phase 0:** You can create, edit, and list plain text notes. Nothing fancy yet.

---

## Phase 1: Core Editor + Organization (Week 1–2)

- [ ] Rich text or Markdown editor integrated (pick TipTap or Markdown — don't build your own editor from scratch)
- [ ] Folders or tags for organizing notes (tags are more flexible and easier to build — a note can have many tags)
- [ ] Basic keyword search (SQL `LIKE` queries are fine for now — you'll upgrade this in Phase 4)
- [ ] Autosave (debounce saves so you're not hitting the DB on every keystroke)

**Goal by end of Phase 1:** This is now a usable, if basic, note-taking app. You could actually take real class notes in it.

---

## Phase 2: Spaced Repetition (Week 3–4)

This is a great feature to implement early because it's self-contained and has a well-known algorithm (SM-2, used by Anki) — you can point to a specific piece of computer science you implemented.

- [ ] Data model: a `flashcards` table linked to notes — `id, note_id, front, back, ease_factor, interval, repetitions, next_review_date`
- [ ] UI to create a flashcard from a note (e.g. select text → "make flashcard" → fill front/back)
- [ ] Implement the SM-2 algorithm:
  - After each review, the user rates recall quality (0–5)
  - Algorithm updates `ease_factor`, `interval`, and `next_review_date` based on that rating
  - [Reference for the SM-2 formula](https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm) — implement this yourself rather than copying an npm package, since being able to explain the math is the point
- [ ] A "review session" screen that pulls all cards due today and cycles through them

**Goal by end of Phase 2:** You have a working flashcard system with real spaced-repetition scheduling — genuinely useful for studying, and a strong technical talking point.

---

## Phase 3: Linked / Graph Notes (Week 5–6)

- [ ] Support `[[Note Title]]`-style linking syntax inside notes (parse this on save, store links in a `note_links` table: `source_id, target_id`)
- [ ] Auto-create a note if you link to one that doesn't exist yet (classic Zettelkasten behavior)
- [ ] "Backlinks" panel — show which other notes link to the one you're viewing
- [ ] Graph view: render notes as nodes, links as edges, using react-force-graph or D3
- [ ] Bonus: color-code nodes by tag/subject so the graph is visually organized by class

**Goal by end of Phase 3:** You can see how your notes connect across topics — useful for spotting relationships between concepts (e.g. how a Bio concept connects to a Chem one).

---

## Phase 4: Semantic Search (Week 7–8)

- [ ] On note save, send the note content to an embeddings API, store the resulting vector
- [ ] Store embeddings either in a separate table (as JSON/blob) or use [sqlite-vss](https://github.com/asg017/sqlite-vss) for proper vector search in SQLite
- [ ] On search, embed the query, compute cosine similarity against stored note embeddings, return top matches
- [ ] Combine with keyword search — semantic search alone can miss exact-term lookups, so a hybrid approach works best in practice

**Goal by end of Phase 4:** You can search "what did I write about cellular respiration" and get relevant notes even if you used different wording. This is the feature most worth explaining well in an application — it's a real, working AI application, not a toy demo.

---

## Phase 5: AI Summarization & Quiz Generation (Week 9)

This is the fastest phase since you're mostly doing prompt engineering + API calls, not new architecture.

- [ ] "Summarize this note" button → sends note content to an LLM API, displays bullet-point summary
- [ ] "Generate quiz questions" button → sends note content, asks the model to return a structured JSON array of Q&A pairs
- [ ] Optional: auto-generate flashcards from quiz questions, feeding directly into your Phase 2 spaced-repetition system (nice integration between features)
- [ ] Add a loading state and error handling — API calls fail sometimes, and handling that gracefully is a good engineering habit to demonstrate

**Goal by end of Phase 5:** Your note app can turn a wall of notes into a study-ready quiz in one click, and those questions can feed your spaced repetition engine.

---

## Phase 6: Handwriting OCR (Week 10–11)

- [ ] Add an "upload photo" option to notes
- [ ] Run the image through Tesseract.js client-side
- [ ] Display extracted text as an editable draft the user can clean up and save into a note (OCR is never perfect — let the user correct it rather than trusting it blindly)
- [ ] Store the original image alongside the note for reference

**Goal by end of Phase 6:** You can photograph handwritten notes and get searchable, editable text out of them — closing the loop between physical and digital notes.

---

## Phase 7: Polish (Week 12+)

- [ ] Clean up UI/UX inconsistencies
- [ ] Write a proper README: what the app does, your architecture decisions, what you'd do differently, screenshots/GIFs of it in action
- [ ] Deploy it (even just running locally is fine for personal use, but a live demo — e.g. via Vercel/Render — makes it much easier to show off)
- [ ] Write up your build process somewhere (blog post, or just detailed commit messages) — this becomes raw material for your application essay

---

## What Makes This Application-Ready

- **Use it for real.** Take actual class notes in it for a few weeks before your application is due. Real usage surfaces real bugs and real feature ideas — much better material than a project you built and never touched again.
- **Document your decisions.** Why SQLite over a bigger DB? Why SM-2 instead of a simpler interval scheme? Why hybrid search instead of pure semantic? Being able to explain trade-offs is what separates "I followed a tutorial" from "I engineered a solution."
- **Keep a running list of bugs you hit and how you fixed them.** The hardest bug you solved is often the most interesting thing to talk about in an interview or essay — more interesting than the final polished feature.
- **Don't feel obligated to build every phase before you stop.** If you run out of time, a genuinely solid Phase 0–4 (editor, organization, spaced repetition, graph notes, semantic search) is already an impressive, coherent project. Phases 5–6 are bonus depth, not requirements.

---

## Suggested Order If Time Gets Tight

If you need to cut scope, build in this priority order — each one is valuable on its own and they build on each other:

1. Core editor + organization (non-negotiable foundation)
2. Spaced repetition (strongest "I implemented an algorithm" story)
3. Semantic search (strongest "I built something AI-native" story)
4. Graph/linked notes (great to *show* — screenshots are visually compelling)
5. AI summarization/quiz gen (fastest to add, good to show but least deep)
6. OCR (nice-to-have, cut first if needed)
