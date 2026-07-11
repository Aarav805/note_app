# Study Notes App

A personal note-taking app with spaced repetition, linked notes, semantic search, AI-assisted summarization/quiz generation, and handwriting OCR.

This is the **Phase 0/1 scaffold**: a working notes app (create, edit, tag, search, delete) with a clean architecture ready for the advanced features. See `roadmap.md` for the full build plan.

## Project Structure

```
note-app/
├── client/          React + TypeScript + Vite + Tailwind frontend
├── server/          Express + TypeScript + SQLite backend
└── roadmap.md        the full phased build plan
```

## Getting Started (VS Code)

You'll run two terminals side by side — one for the backend, one for the frontend. In VS Code, open a terminal (`` Ctrl+` ``) and split it (the split-terminal icon) so you can see both running at once.

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

This starts the API at `http://localhost:3001`. It creates `server/notes.db` (a SQLite file) automatically on first run — nothing else to configure.

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

This starts the app at `http://localhost:5173`. Open that URL in your browser — you should see the notes app, with a "+" button to create your first note.

## How It Works

- **Frontend** (`client/`): React app with a note list sidebar and an editor pane. Talks to the backend over `fetch` calls (see `client/src/api.ts`).
- **Backend** (`server/`): Express REST API backed by SQLite (`server/src/db.ts` and `server/src/routes/notes.ts`). All notes live in a single `notes` table for now.
- **Autosave**: the editor debounces changes (waits 500ms after you stop typing) before saving, so it's not hitting the database on every keystroke.
- **Search**: currently a basic SQL `LIKE` keyword search. This gets upgraded to semantic search in Phase 4.

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/notes` | List all notes |
| GET | `/api/notes/:id` | Get a single note |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| GET | `/api/notes/search/:query` | Keyword search |

## Next Steps

Follow `roadmap.md` starting at **Phase 2: Spaced Repetition**. The foundation here (notes table, API, editor) is built so each later phase adds new tables and routes without needing to rework what's already here.

A few things worth doing before you move on to Phase 2:
- [ ] Push this to a GitHub repo and make your first real commit
- [ ] Use the app for a few real notes to make sure the basics feel right
- [ ] Skim through `server/src/db.ts` and `server/src/routes/notes.ts` so you're comfortable with the pattern — Phase 2 (flashcards) follows the exact same shape (a table + a router file)
