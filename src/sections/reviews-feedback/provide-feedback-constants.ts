import type { PerformanceCriterion } from 'src/types/provide-feedback';

// ----------------------------------------------------------------------

export const PERFORMANCE_CRITERIA: PerformanceCriterion[] = [
  {
    id: 'drive',
    initials: 'DE',
    title: 'Drive and Enthusiasm',
    description: 'We take responsibility for getting our jobs well done.',
  },
  {
    id: 'leadership',
    initials: 'L',
    title: 'Leadership',
    description: "We always consider the wider good—we're here to make things better.",
  },
  {
    id: 'integrity',
    initials: 'I',
    title: 'Integrity',
    description: 'We do the right thing even when no one is looking.',
  },
  {
    id: 'teamwork',
    initials: 'T',
    title: 'Teamwork',
    description: 'We work as a team guided by family values.',
  },
  {
    id: 'entrepreneurship',
    initials: 'E',
    title: 'Entrepreneurship',
    description: "We find the places there's a problem to be solved and seize the opportunity.",
  },
];

export const RATING_SCALE = [
  {
    value: 'NI' as const,
    label: 'NI',
    fullLabel: 'Needs Improvement',
    bgcolor: 'rgba(255, 171, 0, 0.16)',
    color: '#B76E00',
    icon: 'solar:sad-circle-bold',
  },
  {
    value: 'ME' as const,
    label: 'ME',
    fullLabel: 'Meets Expectation',
    bgcolor: 'rgba(0, 184, 217, 0.16)',
    color: '#006C9C',
    icon: 'solar:expressionless-circle-bold',
  },
  {
    value: 'EE' as const,
    label: 'EE',
    fullLabel: 'Exceeds Expectations',
    bgcolor: 'rgba(34, 197, 94, 0.16)',
    color: '#118D57',
    icon: 'solar:smile-circle-bold',
  },
];
