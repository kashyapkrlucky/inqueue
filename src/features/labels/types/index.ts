import type { BaseEntity } from "../../../shared/types/index.types";

export interface ITaskLabel extends BaseEntity {
  user: string;
  name: string;
  color: string;
}

export interface ITaskLabelCreateInput {
  name: string;
  color: string;
}

export interface ITaskLabelUpdateInput {
  name?: string;
  color?: string;
}
