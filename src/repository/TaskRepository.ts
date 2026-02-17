import type { IRepository } from "../types/app.types";
import type { ITask } from "../types/index.types";
import { LocalStorageRepository } from "./LocalStorageRepository";

export const TaskRepository: IRepository<Partial<ITask>> = new LocalStorageRepository<Partial<ITask>>("tasks");