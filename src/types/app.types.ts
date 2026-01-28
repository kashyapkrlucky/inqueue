export interface IRepository<T> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(input: T): Promise<T>;
  update(id: string, patch: T): Promise<T>;
  remove(id: string): Promise<void>;
}
