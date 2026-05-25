import type { IReviewFeedbackItem } from 'src/types/review-feedback';

// ----------------------------------------------------------------------

export function readField(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (value != null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return '';
}

function isPendingStatus(record: Record<string, unknown>): boolean {
  const status = readField(record, 'Status', 'status').toLowerCase();
  return status === 'pending';
}

export function mapFeedbackAssignmentToRow(
  assignment: Record<string, unknown>
): IReviewFeedbackItem & { feedbackAssignment: Record<string, unknown> } {
  const category = readField(assignment, 'Category', 'category');
  const year = readField(assignment, 'Year', 'year');

  return {
    id:
      readField(assignment, 'AssignmentId', 'assignmentId') ||
      `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    employeeName: readField(assignment, 'EmployeeToReviewName', 'employeeToReviewName') || 'Unknown',
    employeeAvatarUrl: undefined,
    category: [category, year].filter(Boolean).join(' ') || '—',
    dateInitiated: readField(assignment, 'CreatedAt', 'createdAt') || new Date().toISOString(),
    status: 'in-progress',
    statusLabel: 'Pending',
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
    .filter(isPendingStatus)
    .map(mapFeedbackAssignmentToRow);
}
