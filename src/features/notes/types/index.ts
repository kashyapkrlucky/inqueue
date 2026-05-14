import type { BaseEntity } from "../../../shared/types/index.types";
import type { IUser } from "../../auth/types";

/**
 * Represents a folder for organizing notes
 */
export interface IFolder extends BaseEntity {
  /** ID of the user who owns the folder */
  user: IUser;
  /** Title of the folder */
  title: string;
}

/**
 * Represents a note or page in the system
 */
export interface INote extends BaseEntity {
  /** ID of the user who owns the note */
  user?: IUser;
  /** Title of the note */
  title: string;
  /** Main content of the note */
  content: string;
  /** Optional reference to the parent folder */
  folder?: IFolder;
}

export interface INoteCreate {
  _id: string;
  title: string;
  content: string;
  folder?: string;
  createdAt: string;
  updatedAt: string;
}