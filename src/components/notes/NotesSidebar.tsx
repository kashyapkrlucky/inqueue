import { useState } from "react";
import { useNoteStore } from "../../store/useNoteStore";
import { PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";

export default function NotesSidebar({
  isSidebarOpen,
  createNewNote,
  isNewNote,
}: {
  isSidebarOpen: boolean;
  createNewNote: () => void;
  isNewNote: boolean;
}) {
  const { currentNote, setCurrentNote, notes, deleteNote } =
    useNoteStore();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const tempId = "TempId";

  const handleDeleteNote = (_id: string) => {
    deleteNote(_id);
  };

  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-0"} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
          <button
            onClick={createNewNote}
            aria-label="New Note"
            disabled={isNewNote}
            className="p-2 disabled:opacity-50"
          >
            <PlusIcon size={20} />
          </button>
        </div>
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            onClick={() => {
              setCurrentNote(note);
              //   setIsEditing(false);
            }}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              currentNote?._id === note._id ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 truncate">
                {note.title || "Untitled Note"}
              </h3>
              {note._id !== tempId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note._id);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1"
                  aria-label="Delete note"
                >
                  <Trash2Icon size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {note.content.substring(0, 60) || "No content"}
            </p>
            <p className="text-xs text-gray-400 mt-2">{note?.updatedAt}</p>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? "No matching notes found" : "No notes yet"}
          </div>
        )}
      </div>
    </div>
  );
}
