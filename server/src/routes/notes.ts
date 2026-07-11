import { Router, Request, Response } from "express";
import { db, Note } from "../db.js";

export const notesRouter = Router();

// GET /api/notes - list all notes (most recently updated first)
notesRouter.get("/", (_req: Request, res: Response) => {
  const notes = db
    .prepare("SELECT * FROM notes ORDER BY updated_at DESC")
    .all() as Note[];
  res.json(notes.map(formatNote));
});

// GET /api/notes/:id - fetch a single note
notesRouter.get("/:id", (req: Request, res: Response) => {
  const note = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(req.params.id) as Note | undefined;

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(formatNote(note));
});

// POST /api/notes - create a new note
notesRouter.post("/", (req: Request, res: Response) => {
  const { title, content, tags } = req.body as {
    title?: string;
    content?: string;
    tags?: string[];
  };

  const result = db
    .prepare(
      "INSERT INTO notes (title, content, tags) VALUES (?, ?, ?)"
    )
    .run(title ?? "Untitled", content ?? "", JSON.stringify(tags ?? []));

  const note = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(result.lastInsertRowid) as Note;

  res.status(201).json(formatNote(note));
});

// PUT /api/notes/:id - update an existing note
notesRouter.put("/:id", (req: Request, res: Response) => {
  const { title, content, tags } = req.body as {
    title?: string;
    content?: string;
    tags?: string[];
  };

  const existing = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(req.params.id) as Note | undefined;

  if (!existing) {
    return res.status(404).json({ error: "Note not found" });
  }

  db.prepare(
    `UPDATE notes
     SET title = ?, content = ?, tags = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title ?? existing.title,
    content ?? existing.content,
    JSON.stringify(tags ?? JSON.parse(existing.tags)),
    req.params.id
  );

  const updated = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(req.params.id) as Note;

  res.json(formatNote(updated));
});

// DELETE /api/notes/:id
notesRouter.delete("/:id", (req: Request, res: Response) => {
  const result = db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.status(204).send();
});

// GET /api/notes/search/:query - basic keyword search (Phase 1)
// Swap/augment this with semantic search in Phase 4.
notesRouter.get("/search/:query", (req: Request, res: Response) => {
  const q = `%${req.params.query}%`;
  const notes = db
    .prepare(
      "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC"
    )
    .all(q, q) as Note[];
  res.json(notes.map(formatNote));
});

function formatNote(note: Note) {
  return { ...note, tags: JSON.parse(note.tags) as string[] };
}
