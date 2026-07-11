import { useEffect, useState } from "react";
import type { Note } from "../types";

interface Props {
  note: Note;
  onChange: (updates: Partial<Pick<Note, "title" | "content" | "tags">>) => void;
  onDelete: () => void;
}

export function NoteEditor({ note, onChange, onDelete }: Props) {
  // Local state so typing feels instant; parent debounces the actual save.
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagInput, setTagInput] = useState(note.tags.join(", "));

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTagInput(note.tags.join(", "));
  }, [note.id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      onChange({ title, content, tags });
    }, 500); // debounce autosave
    return () => clearTimeout(timeout);
  }, [title, content, tagInput]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-semibold flex-1 focus:outline-none"
        />
        <button
          onClick={onDelete}
          className="text-sm text-red-500 hover:text-red-700 shrink-0"
        >
          Delete
        </button>
      </div>

      <div className="px-4 pt-3">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="tags, comma, separated"
          className="text-xs text-gray-500 focus:outline-none w-full"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 p-4 resize-none focus:outline-none text-sm leading-relaxed"
      />

      <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
        Last updated {new Date(note.updated_at).toLocaleString()}
      </div>
    </div>
  );
}
