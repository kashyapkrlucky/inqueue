import type { BaseEntity } from "../../../shared/types/index.types";

export interface IFeedback extends BaseEntity {
  /** Type of the feedback */
  feedbackType: string;
  /** Feedback content */
  description: string;
  /** ID of the user who submitted the feedback */
  user: string;
  /** Optional comment from the user */
  comment?: string;
  /** Status of the feedback */
  status?: 'open' | 'closed';
}


export interface FeedbackCreationInput {
  feedbackType: string;
  description: string;
}

export interface FeedbackUpdateInput {
  feedbackType?: string;
  description?: string;
  status?: "open" | "closed";
  comment?: string;
}
