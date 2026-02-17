import type { IRepository } from "../types/app.types";

function read<T>(storageKey: string): T[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write<T>(storageKey: string, items: T[]) {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

export class LocalStorageRepository<T> implements IRepository<T> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  async list(): Promise<T[]> {
    return read<T>(this.storageKey)
  }

  // async get(id: string): Promise<T | undefined> {
  //   return read<T>(this.storageKey).find((item) => item._id === id);
  // }

  async create(input: T): Promise<T> {
    const now = new Date();
    const item: T = {
      createdAt: now,
      ...input,
    } as T;
    const items = read<T>(this.storageKey);
    items.push(item);
    write(this.storageKey, items);
    return item;
  }

  // async update(id: string, patch: Partial<T>): Promise<T> {
  //   const items = read<T>(this.storageKey);
  //   const idx = items.findIndex((item) => item._id === id);
    
  //   if (idx === -1) throw new Error("Item not found");
  //   const now = new Date();
  //   const updated: T = { ...items[idx], ...patch, updatedAt: now } as T;
  //   items[idx] = updated;
  //   write(this.storageKey, items);
  //   return updated;
  // }

  // async remove(id: string): Promise<void> {
  //   const items = read<T>(this.storageKey);
  //   const next = items.filter((item) => item._id !== id);
  //   write(this.storageKey, next);
  // }
}
