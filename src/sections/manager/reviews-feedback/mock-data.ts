import type { IReviewFeedbackItem, ReviewFeedbackTab } from 'src/types/review-feedback';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const avatar = (index: number) =>
  `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${index}.webp`;

const TEAM_REVIEW_MOCK: IReviewFeedbackItem[] = [
  {
    id: '1',
    employeeName: 'Janicca Juniller',
    employeeAvatarUrl: avatar(1),
    category: 'Project Related Feedback 2026',
    dateInitiated: '2026-07-07T17:00:00',
    status: 'for-your-approval',
    statusLabel: 'For your Approval',
    completion: '0/5',
    reviewerAvatarUrls: [avatar(2), avatar(3), avatar(4), avatar(5), avatar(6)],
    avgScore: null,
  },
];

const TAB_DATA: Record<ReviewFeedbackTab, IReviewFeedbackItem[]> = {
  'my-feedback': [],
  'needs-my-review': [],
  'my-teams-review': TEAM_REVIEW_MOCK,
};

export const TAB_COUNTS: Record<ReviewFeedbackTab, number> = {
  'my-feedback': TAB_DATA['my-feedback'].length,
  'needs-my-review': TAB_DATA['needs-my-review'].length,
  'my-teams-review': TAB_DATA['my-teams-review'].length,
};

export function getReviewFeedbackByTab(tab: ReviewFeedbackTab): IReviewFeedbackItem[] {
  return TAB_DATA[tab];
}
