// ----------------------------------------------------------------------

export type FeedbackRating = 'NI' | 'ME' | 'EE';

export type PerformanceCriterion = {
  id: string;
  initials: string;
  title: string;
  description: string;
};

export type StarRemarks = {
  situation: string;
  task: string;
  action: string;
  result: string;
};

export const EMPTY_STAR_REMARKS: StarRemarks = {
  situation: '',
  task: '',
  action: '',
  result: '',
};

export function canAddRemarks(rating: FeedbackRating | null): boolean {
  return rating === 'NI' || rating === 'EE';
}

export function hasStarRemarks(remarks: StarRemarks): boolean {
  return Boolean(
    remarks.situation.trim() ||
      remarks.task.trim() ||
      remarks.action.trim() ||
      remarks.result.trim()
  );
}

export type CriterionFeedback = {
  criterionId: string;
  rating: FeedbackRating | null;
  starRemarks: StarRemarks;
};
