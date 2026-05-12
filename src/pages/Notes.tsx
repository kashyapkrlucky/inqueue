import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import type { INoteCreate } from "../types/index.types";
import { useNoteStore } from "../store/useNoteStore";
import { Button } from "../components/ui/Button";
import NotesSidebar from "../components/notes/NotesSidebar";
import NotesActions from "../components/notes/NotesActions";

export default function Notes() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewNote, setIsNewNote] = useState(false);
  const {
    getNotes,
    currentNote,
    setCurrentNote,
    addNote,
    updateNote,
    insertNote,
  } = useNoteStore();

  const tempId = "TempId";

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const createNewNote = () => {
    if (isNewNote) {
      return;
    }
    const newNote: INoteCreate = {
      _id: tempId,
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    insertNote(newNote);
    setIsEditing(true);
    setIsNewNote(true);
  };

  const saveNote = (title: string, content: string) => {
    if (currentNote?._id === tempId) {
      addNote(title, content);
    } else {
      updateNote(currentNote!._id, title, content);
    }
    setIsNewNote(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <NotesSidebar
        isSidebarOpen={isSidebarOpen}
        createNewNote={createNewNote}
        isNewNote={isNewNote}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {currentNote ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <NotesActions
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              saveNote={saveNote}
            />
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {isEditing ? (
                <textarea
                  value={currentNote.content}
                  onChange={(e) =>
                    setCurrentNote({ ...currentNote, content: e.target.value })
                  }
                  className="w-full h-full focus:outline-none resize-none text-gray-800 leading-relaxed"
                  placeholder="Start writing your note here..."
                  autoFocus
                />
              ) : (
                <div
                  className="whitespace-pre-wrap text-gray-800 leading-relaxed min-h-full"
                  onClick={() => setIsEditing(true)}
                >
                  {currentNote.content || (
                    <p className="text-gray-400 italic">
                      Empty note. Click to edit.
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="p-2 text-xs text-gray-400 text-right border-t border-gray-100">
              Last edited: {currentNote.updatedAt}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <h2 className="text-xl font-medium mb-2">No Note Selected</h2>
            <p className="mb-6">
              Select a note or create a new one to get started
            </p>
            <Button onClick={createNewNote}>
              <PlusIcon size={16} />
              New Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
