import { create } from "zustand";
import type { INote } from "../types/index.types";
import axios from "../lib/axios";

interface NoteState {
  loading: boolean;
  notes: INote[];
  error: string | null;
  currentNote: INote | null;
  setCurrentNote: (note: INote | null) => void;
  insertNote: (note: INote) => void;
  getNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (noteId: string, title: string, content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  stats: { total: number; recent: INote[] };
  getStats: () => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  loading: false,
  notes: [],
  error: null,
  currentNote: null,
  stats: { total: 0, recent: [] },
  setCurrentNote: (note) => set({ currentNote: note }),
  insertNote: (note: INote) => {
    set((state) => ({ notes: [note, ...state.notes] }));
    set({ currentNote: note });
  },
  getNotes: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/notes");
      set({ notes: data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  addNote: async (title: string, content: string) => {
    try {
      set({ loading: true });
      const payload = { title, content };
      const {
        data: { data },
      } = await axios.post("/notes", payload);
      const currentNoteId = get().currentNote?._id;
      const newNote = {
        _id: data,
        title,
        content,
      };
      set((state) => ({
        notes: state.notes.map((n) => (n._id === currentNoteId ? newNote : n)),
      }));
      set({ currentNote: newNote });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  updateNote: async (noteId: string, title: string, content: string) => {
    try {
      set({ loading: true });
      await axios.patch(`/notes/${noteId}`, { title, content });
      set((state) => ({
        notes: state.notes.map((n) => (n._id === noteId ? { ...n, title, content } : n)),
        currentNote: state.currentNote ? { ...state.currentNote, title, content } : null,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  deleteNote: async (noteId: string) => {
    try {
      set({ loading: true });
      await axios.delete(`/notes/${noteId}`);
      set((state) => ({ notes: state.notes.filter((n) => n._id !== noteId) }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  getStats: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/notes/stats");
      set({ stats: data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
