import type { IReviewFeedbackItem } from 'src/types/review-feedback';

// ----------------------------------------------------------------------

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `hash-${Math.abs(hash).toString(36)}`;
}

export function readField(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (value != null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return '';
}

function isPendingOrSubmittedStatus(record: Record<string, unknown>): boolean {
  const status = readField(record, 'Status', 'status').toLowerCase();
  return status === 'pending' || status === 'submitted';
}

export function mapFeedbackAssignmentToRow(
  assignment: Record<string, unknown>
): IReviewFeedbackItem & { feedbackAssignment: Record<string, unknown> } {
  const category = readField(assignment, 'Category', 'category');
  const year = readField(assignment, 'Year', 'year');
  const backendStatus = readField(assignment, 'Status', 'status').toLowerCase();

  const isSubmitted = backendStatus === 'submitted';
  const status = isSubmitted ? 'completed' : 'in-progress';
  const statusLabel = isSubmitted ? 'Feedback Submitted' : 'Pending';

  const assignmentId = readField(assignment, 'AssignmentId', 'assignmentId');
  const id = assignmentId ||
    simpleHash([
      readField(assignment, 'EmployeeToReviewName', 'employeeToReviewName'),
      readField(assignment, 'Category', 'category'),
      readField(assignment, 'CreatedAt', 'createdAt'),
    ].join('|'));

  return {
    id,
    employeeName: readField(assignment, 'EmployeeToReviewName', 'employeeToReviewName') || 'Unknown',
    employeeAvatarUrl: undefined,
    category: [category, year].filter(Boolean).join(' ') || '—',
    dateInitiated: readField(assignment, 'CreatedAt', 'createdAt') || new Date().toISOString(),
    status,
    statusLabel,
    completion: '0/1',
    reviewerAvatarUrls: [],
    avgScore: null,
    feedbackAssignment: assignment,
  };
}

export function mapFeedbackAssignments(
  assignments: unknown[]
): (IReviewFeedbackItem & { feedbackAssignment: Record<string, unknown> })[] {
  return assignments
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .filter(isPendingOrSubmittedStatus)
    .map(mapFeedbackAssignmentToRow);
}
