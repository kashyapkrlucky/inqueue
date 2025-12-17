import { useState } from 'react';
import { Search, Plus, Trash2, Edit, Save, X, Menu, ChevronRight } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  lastEdited: Date;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      lastEdited: new Date()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? { ...updatedNote, lastEdited: new Date() } : note
    ));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(notes.length > 1 ? notes[0] : null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
            <button 
              onClick={createNewNote}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              aria-label="New Note"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
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
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                setIsEditing(false);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedNote?.id === note.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 truncate">
                  {note.title || 'Untitled Note'}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate">
                {note.content.substring(0, 60) || 'No content'}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(note.lastEdited)}
              </p>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No matching notes found' : 'No notes yet'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden p-4 border-b border-gray-200 flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 p-1 text-gray-600"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {selectedNote ? selectedNote.title : 'Notes'}
          </h1>
        </div>

        {selectedNote ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                {!isSidebarOpen && (
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="mr-2 p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                    aria-label="Show notes list"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => updateNote({ ...selectedNote, title: e.target.value })}
                    className="text-xl font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    placeholder="Note title"
                  />
                ) : (
                  <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
                )}
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        updateNote(selectedNote);
                        setIsEditing(false);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      aria-label="Save changes"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                      aria-label="Cancel editing"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                    aria-label="Edit note"
                  >
                    <Edit size={20} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => updateNote({ ...selectedNote, content: e.target.value })}
                  className="w-full h-full p-2 focus:outline-none resize-none text-gray-800 leading-relaxed"
                  placeholder="Start writing your note here..."
                  autoFocus
                />
              ) : (
                <div 
                  className="whitespace-pre-wrap text-gray-800 leading-relaxed min-h-full"
                  onClick={() => setIsEditing(true)}
                >
                  {selectedNote.content || (
                    <p className="text-gray-400 italic">Empty note. Click to edit.</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-2 text-xs text-gray-400 text-right border-t border-gray-100">
              Last edited: {formatDate(selectedNote.lastEdited)}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <Plus size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-medium mb-2">No Note Selected</h2>
            <p className="mb-6">Select a note or create a new one to get started</p>
            <button
              onClick={createNewNote}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto"
            >
              <Plus size={16} className="mr-2" />
              New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}