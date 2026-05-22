import type { IReviewFeedbackItem } from 'src/types/review-feedback';

// ----------------------------------------------------------------------

type EmployeeReviewFeedbackTab = 'my-feedback' | 'needs-my-review';

const TAB_DATA: Record<EmployeeReviewFeedbackTab, IReviewFeedbackItem[]> = {
  'my-feedback': [],
  'needs-my-review': [],
};

export const TAB_COUNTS: Record<EmployeeReviewFeedbackTab, number> = {
  'my-feedback': TAB_DATA['my-feedback'].length,
  'needs-my-review': TAB_DATA['needs-my-review'].length,
};

export function getReviewFeedbackByTab(tab: EmployeeReviewFeedbackTab): IReviewFeedbackItem[] {
  return TAB_DATA[tab];
}
