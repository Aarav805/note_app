import { useEffect, useState, useCallback } from "react";
import type { Note } from "./types";
import { fetchNotes, createNote, updateNote, deleteNote, searchNotes } from "./api";
import { NoteList } from "./components/NoteList";
import { NoteEditor } from "./components/NoteEditor";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async (query: string) => {
    try {
      const data = query.trim() ? await searchNotes(query) : await fetchNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(
        "Couldn't reach the server. Is the backend running on http://localhost:3001?"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => loadNotes(searchQuery), 250);
    return () => clearTimeout(timeout);
  }, [searchQuery, loadNotes]);

  const handleCreate = async () => {
    const note = await createNote();
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  };

  const handleChange = async (
    updates: Partial<Pick<Note, "title" | "content" | "tags">>
  ) => {
    if (selectedId === null) return;
    const updated = await updateNote(selectedId, updates);
    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
  };

  const handleDelete = async () => {
    if (selectedId === null) return;
    await deleteNote(selectedId);
    setNotes((prev) => prev.filter((n) => n.id !== selectedId));
    setSelectedId(null);
  };

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-sm px-8 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <NoteList
        notes={notes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreate={handleCreate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {selectedNote ? (
        <NoteEditor
          key={selectedNote.id}
          note={selectedNote}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Select a note, or create a new one to get started.
        </div>
      )}
    </div>
  );
}

export default App;
