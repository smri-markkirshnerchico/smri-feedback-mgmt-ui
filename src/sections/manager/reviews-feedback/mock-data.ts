import type { IReviewFeedbackItem, ReviewFeedbackTab } from 'src/types/review-feedback';
import type { IFeedbackApprovalProvider } from 'src/types/feedback-approval';

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

// ----------------------------------------------------------------------

const APPROVAL_REASON =
  'I chose this employee to review my performance because they work closely with me on daily tasks and projects. Their feedback will help me understand how I can improve in areas that matter most to our team.';

export const FEEDBACK_APPROVAL_PROVIDERS: IFeedbackApprovalProvider[] = [
  {
    id: '1',
    employeeName: 'Guenevere De Guzman',
    employeeAvatarUrl: avatar(2),
    position: 'AVP',
    projectName: 'Supply Chain DC Box',
    reason: APPROVAL_REASON,
  },
  {
    id: '2',
    employeeName: 'Andrew Lee',
    employeeAvatarUrl: avatar(3),
    position: 'Department Manager',
    projectName: 'Supply Chain DC Box',
    reason: APPROVAL_REASON,
  },
  {
    id: '3',
    employeeName: 'Joy Alfonso',
    employeeAvatarUrl: avatar(4),
    position: 'ITS Developer',
    projectName: 'Supply Chain DC Box',
    reason: APPROVAL_REASON,
  },
  {
    id: '4',
    employeeName: 'Joy Alfonso',
    employeeAvatarUrl: avatar(5),
    position: 'ITS Developer',
    projectName: 'Supply Chain DC Box',
    reason: APPROVAL_REASON,
  },
  {
    id: '5',
    employeeName: 'Maria Santos',
    employeeAvatarUrl: avatar(6),
    position: 'Business Analyst',
    projectName: 'Supply Chain DC Box',
    reason: APPROVAL_REASON,
  },
];
