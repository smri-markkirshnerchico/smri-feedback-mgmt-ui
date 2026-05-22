// ----------------------------------------------------------------------

export type ReviewFeedbackTab = 'my-feedback' | 'needs-my-review' | 'my-teams-review';

export type ReviewFeedbackStatus = 'for-your-approval' | 'in-progress' | 'completed';

export type IReviewFeedbackItem = {
  id: string;
  employeeName: string;
  employeeAvatarUrl?: string;
  category: string;
  dateInitiated: string;
  status: ReviewFeedbackStatus;
  statusLabel: string;
  completion: string;
  reviewerAvatarUrls: string[];
  avgScore: string | null;
};
