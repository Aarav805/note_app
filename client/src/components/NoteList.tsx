import type { Note } from "../types";

interface Props {
  notes: Note[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function NoteList({
  notes,
  selectedId,
  onSelect,
  onCreate,
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <aside className="w-72 border-r border-gray-200 flex flex-col h-full bg-gray-50">
      <div className="p-3 border-b border-gray-200 flex gap-2">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={onCreate}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          title="New note"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 && (
          <p className="text-sm text-gray-400 p-4 text-center">No notes yet</p>
        )}
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => onSelect(note.id)}
            className={`w-full text-left px-3 py-2.5 border-b border-gray-100 hover:bg-gray-100 transition-colors ${
              selectedId === note.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="font-medium text-sm text-gray-800 truncate">
              {note.title || "Untitled"}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">
              {note.content.slice(0, 60) || "No content"}
            </div>
            {note.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
