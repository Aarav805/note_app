import type { Note } from "./types";

const BASE_URL = "http://localhost:3001/api";

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function fetchNote(id: number): Promise<Note> {
  const res = await fetch(`${BASE_URL}/notes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch note");
  return res.json();
}

export async function createNote(): Promise<Note> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Untitled", content: "", tags: [] }),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(
  id: number,
  updates: Partial<Pick<Note, "title" | "content" | "tags">>
): Promise<Note> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
}

export async function searchNotes(query: string): Promise<Note[]> {
  const res = await fetch(`${BASE_URL}/notes/search/${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search notes");
  return res.json();
}
