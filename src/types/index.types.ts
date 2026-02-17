/**
 * Represents a user in the system
 */
export interface IUser {
  /** Unique identifier for the user */
  _id: string;
  /** User's full name */
  name: string;
  /** User's email address (must be unique) */
  email: string;
  /** User's username (must be unique) */
  userName: string;
  /** Hashed password (not returned in API responses) */
  password?: string;
  /** URL to the user's avatar image */
  avatar?: string;
  /** Cloudinary public ID for the avatar image */
  avatarId?: string;
  /** User account status */
  status: "active" | "inactive";
  /** When the user account was created */
  createdAt?: Date;
  /** When the user account was last updated */
  updatedAt?: Date;
}

/**
 * Represents a folder for organizing notes
 */
export interface IFolder {
  /** Unique identifier for the folder */
  _id: string;
  /** ID of the user who owns the folder */
  user: IUser;
  /** Title of the folder */
  title: string;
  /** When the folder was created */
  createdAt?: Date;
  /** When the folder was last updated */
  updatedAt?: Date;
}

/**
 * Represents a note or page in the system
 */
export interface INote {
  /** Unique identifier for the note */
  _id: string;
  /** ID of the user who owns the note */
  user: IUser;
  /** Title of the note */
  title: string;
  /** Main content of the note */
  content: string;
  /** Optional reference to the parent folder */
  folder?: IFolder;
  /** When the note was created */
  createdAt?: Date;
  /** When the note was last updated */
  updatedAt?: Date;
}

export type ITaskStatus = "todo" | "in_progress" | "done";
export type ITaskPriority = "low" | "medium" | "high";

/**
 * Represents a task or to-do item
 */
export interface ITask {
  /** Unique identifier for the task */
  _id: string;
  /** ID of the user who created the task */
  user: string;
  /** The task description */
  content: string;
  /** Status of the task (e.g., completed or not) */
  status?: ITaskStatus;
  /** Priority of the task (e.g., low, medium, high) */
  priority?: ITaskPriority;
  /** Due date for the task */
  dueDate?: Date;
  /** When the task was created */
  createdAt: Date;
  /** When the task was last updated */
  updatedAt?: Date;
}

export type NewTask = {
  content: string;
  status?: ITaskStatus;
  priority?: ITaskPriority;
  dueDate?: Date;
};

export type TaskUpdate = Partial<Omit<ITask, '_id' | 'createdAt'>>; // updatedAt managed by repo



