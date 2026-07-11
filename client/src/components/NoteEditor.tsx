import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Note } from "../types";

interface Props {
  note: Note;
  onChange: (updates: Partial<Pick<Note, "title" | "content" | "tags">>) => void;
  onDelete: () => void;
}

type ViewMode = "edit" | "split" | "preview";

export function NoteEditor({ note, onChange, onDelete }: Props) {
  // Local state so typing feels instant; parent debounces the actual save.
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagInput, setTagInput] = useState(note.tags.join(", "));
  const [viewMode, setViewMode] = useState<ViewMode>("split");

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
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
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

      <div className="flex-1 flex overflow-hidden">
        {(viewMode === "edit" || viewMode === "split") && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing in Markdown... # Heading, **bold**, - list item"
            className={`p-4 resize-none focus:outline-none text-sm leading-relaxed font-mono ${
              viewMode === "split" ? "w-1/2 border-r border-gray-200" : "w-full"
            }`}
          />
        )}

        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`p-4 overflow-y-auto prose prose-sm max-w-none ${
              viewMode === "split" ? "w-1/2" : "w-full"
            }`}
          >
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
        Last updated {new Date(note.updated_at).toLocaleString()}
      </div>
    </div>
  );
}

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  const options: { value: ViewMode; label: string }[] = [
    { value: "edit", label: "Edit" },
    { value: "split", label: "Split" },
    { value: "preview", label: "Preview" },
  ];

  return (
    <div className="flex text-xs border border-gray-300 rounded-md overflow-hidden shrink-0">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 ${
            mode === opt.value
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
