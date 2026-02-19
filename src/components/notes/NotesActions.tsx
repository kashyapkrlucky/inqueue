import { ChevronLeftIcon, EditIcon, MenuIcon, SaveIcon, XIcon } from "lucide-react";
import { useNoteStore } from "../../store/useNoteStore";
import { Button } from "../ui/Button";

interface NotesActionsProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  saveNote: (title: string, content: string) => void;
}

export default function NotesActions({
  isSidebarOpen,
  setIsSidebarOpen,
  isEditing,
  setIsEditing,
  saveNote,
}: NotesActionsProps) {
  const { currentNote, setCurrentNote } = useNoteStore();
  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <div className="flex-1 flex items-center">
        {/* Mobile header */}
        <div className="md:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 text-gray-600"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon size={24} />
            ) : (
              <MenuIcon size={24} />
            )}
          </button>
        </div>

        {isEditing && currentNote ? (
          <input
            type="text"
            value={currentNote?.title}
            onChange={(e) =>
              setCurrentNote({ ...currentNote, title: e.target.value })
            }
            className="flex-1 text-xl font-semibold bg-transparent focus:outline-none rounded"
            placeholder="Note title"
          />
        ) : (
          <h2 className="text-xl font-semibold">{currentNote?.title}</h2>
        )}
      </div>
      <div className="flex space-x-2">
        {isEditing && currentNote ? (
          <>
            <Button
              onClick={() => {
                saveNote(currentNote.title, currentNote.content);
                setIsEditing(false);
              }}
              variant="ghost"
              aria-label="Save changes"
            >
              <SaveIcon size={20} />
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="ghost"
              aria-label="Cancel editing"
            >
              <XIcon size={20} />
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            aria-label="Edit note"
          >
            <EditIcon size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}
