import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "notes.db");

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// --- Schema ---
// This is intentionally just the Phase 0/1 schema (plain notes + tags).
// Later phases add: flashcards, note_links, embeddings — see roadmap.md.

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Untitled',
    content TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string; // JSON-encoded string array
  created_at: string;
  updated_at: string;
}
