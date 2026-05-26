import type { FeedbackRating, StarRemarks } from 'src/types/provide-feedback';

import { PERFORMANCE_CRITERIA } from './provide-feedback-constants';

// ----------------------------------------------------------------------

export type CriterionFeedbackDetail = {
  criterionId: string;
  rating: FeedbackRating;
  starRemarks: StarRemarks;
  defaultExpanded?: boolean;
};

const emptyRemarks: StarRemarks = { situation: '', task: '', action: '', result: '' };

const MOCK_STAR_DRIVE: StarRemarks = {
  situation:
    'During the last quarter, our team faced tight timelines and increased workload due to a major system rollout.',
  task:
    'I was responsible for ensuring my tasks were completed on time while coordinating with cross-functional teams.',
  action:
    'I proactively organized my workload, communicated early about potential delays, and offered support to teammates where needed.',
  result:
    'Share the outcomes achieved, such as savings, efficiency gains, or lessons learned, ideally with quantifiable data.',
};

const MOCK_STAR_LEADERSHIP: StarRemarks = {
  situation:
    'Our department launched a cross-functional initiative to improve customer response times.',
  task:
    'I was asked to lead a small team and align stakeholders on priorities and timelines.',
  action:
    'I facilitated weekly syncs, clarified roles, and removed blockers so the team could deliver on schedule.',
  result:
    'Response times improved by 18% within two months, and handoffs between teams became smoother.',
};

const MOCK_STAR_INTEGRITY: StarRemarks = {
  situation:
    'A vendor contract review surfaced inconsistent pricing terms before renewal.',
  task:
    'I needed to ensure we applied the correct rates and documented decisions transparently.',
  action:
    'I escalated the discrepancy, worked with procurement, and corrected the contract before signing.',
  result:
    'The company avoided overpayment and strengthened audit readiness for future renewals.',
};

const MOCK_STAR_TEAMWORK: StarRemarks = {
  situation:
    'A peak-season project required extra coverage across shifts and tighter coordination between teams.',
  task:
    'I was responsible for keeping daily goals on track while supporting teammates during high-volume weeks.',
  action:
    'I paired people by strengths, shared progress in stand-ups, and stepped in when handoffs were at risk.',
  result:
    'We delivered on time with fewer escalations, and the team stayed aligned through the busy period.',
};

const MOCK_STAR_ENTREPRENEURSHIP: StarRemarks = {
  situation:
    'Operations flagged a recurring bottleneck in the manual reporting process.',
  task:
    'I was asked to propose a practical way to reduce rework without adding headcount.',
  action:
    'I mapped the workflow, piloted a lightweight automation, and trained the team on the new steps.',
  result:
    'Reporting cycle time dropped by 25%, freeing the team to focus on higher-value analysis.',
};

function getDefaultDetail(criterionId: string): CriterionFeedbackDetail {
  switch (criterionId) {
    case 'drive':
      return {
        criterionId: 'drive',
        rating: 'NI',
        starRemarks: MOCK_STAR_DRIVE,
        defaultExpanded: true,
      };
    case 'leadership':
      return {
        criterionId: 'leadership',
        rating: 'EE',
        starRemarks: MOCK_STAR_LEADERSHIP,
        defaultExpanded: false,
      };
    case 'integrity':
      return {
        criterionId: 'integrity',
        rating: 'EE',
        starRemarks: MOCK_STAR_INTEGRITY,
        defaultExpanded: false,
      };
    case 'teamwork':
      return {
        criterionId: 'teamwork',
        rating: 'ME',
        starRemarks: MOCK_STAR_TEAMWORK,
        defaultExpanded: false,
      };
    case 'entrepreneurship':
      return {
        criterionId: 'entrepreneurship',
        rating: 'NI',
        starRemarks: MOCK_STAR_ENTREPRENEURSHIP,
        defaultExpanded: false,
      };
    default:
      return {
        criterionId,
        rating: 'ME',
        starRemarks: emptyRemarks,
      };
  }
}

/** Fallback when no submission is stored locally or from API. */
export function getDefaultSubmittedFeedback(): CriterionFeedbackDetail[] {
  return PERFORMANCE_CRITERIA.map((c) => getDefaultDetail(c.id));
}

export function mapStoredSubmissionToDetails(
  ratings: Record<string, FeedbackRating>,
  starRemarksByCriterion: Record<string, StarRemarks>
): CriterionFeedbackDetail[] {
  return PERFORMANCE_CRITERIA.filter((c) => ratings[c.id]).map((criterion, index) => ({
    criterionId: criterion.id,
    rating: ratings[criterion.id],
    starRemarks: starRemarksByCriterion[criterion.id] ?? emptyRemarks,
    defaultExpanded: index === 0 || ratings[criterion.id] === 'NI',
  }));
}
