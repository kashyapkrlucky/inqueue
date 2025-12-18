import { create } from "zustand";
import type { INote } from "../interfaces/index.types";
import axios from "../lib/axios";

interface NoteState {
    loading: boolean;
    notes: INote[];
    error: string | null;
    getNotes: () => Promise<void>;
    addNote: (note: INote) => Promise<void>;
    updateNote: (noteId: string, note: INote) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set) => ({
    loading: false,
    notes: [],
    error: null,
    getNotes: async () => {
        try {
            set({ loading: true });
            const { data } = await axios.get("/notes");
            set({ notes: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    }, 
    addNote: async (note: INote) => {
        try {
            set({ loading: true });
            const { data } = await axios.post("/notes", note);
            set({ notes: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    },
    updateNote: async (noteId: string, note: INote) => {
        try {
            set({ loading: true });
            const { data } = await axios.put(`/notes/${noteId}`, note);
            set({ notes: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    },
    deleteNote: async(noteId: string) => {
        try {
            set({ loading: true });
            const { data } = await axios.delete(`/notes/${noteId}`);
            set({ notes: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    },
}))