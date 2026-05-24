export interface CalendarTask {
  _id: string;
  content: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}