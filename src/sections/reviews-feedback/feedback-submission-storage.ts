import type { FeedbackRating, StarRemarks } from 'src/types/provide-feedback';

// ----------------------------------------------------------------------

const STORAGE_PREFIX = 'smri-feedback-submission:';

export type StoredFeedbackSubmission = {
  ratings: Record<string, FeedbackRating>;
  starRemarksByCriterion: Record<string, StarRemarks>;
  overallComments?: string;
  starRemarks?: StarRemarks;
};

export function saveFeedbackSubmission(assignmentId: string, data: StoredFeedbackSubmission) {
  if (typeof window === 'undefined' || !assignmentId) return;
  sessionStorage.setItem(`${STORAGE_PREFIX}${assignmentId}`, JSON.stringify(data));
}

export function loadFeedbackSubmission(assignmentId: string): StoredFeedbackSubmission | null {
  if (typeof window === 'undefined' || !assignmentId) return null;

  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${assignmentId}`);
    if (!raw) return null;
    return JSON.parse(raw) as StoredFeedbackSubmission;
  } catch {
    return null;
  }
}
