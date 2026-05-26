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
    description: 'From none at all to limited visible manifestation of giving his best efforts to deliver good results.',
  },
  {
    value: 'ME' as const,
    label: 'ME',
    fullLabel: 'Meets Expectation',
    bgcolor: 'rgba(0, 184, 217, 0.16)',
    color: '#006C9C',
    icon: 'solar:expressionless-circle-bold',
    description: `• Leads and drives the team to meet the required targets
• Creates and implements work plans with contingencies
• Takes responsibility for getting things done efficiently and effectively
• Is action-oriented, considers options and then acts decisively
• Manifests a "can do" attitude. Is resilient and adaptive.
• No IVR served such as Negligence or any violation of company policies and procedures on set guidelines among others for this value.`,
  },
  {
    value: 'EE' as const,
    label: 'EE',
    fullLabel: 'Exceeds Expectations',
    bgcolor: 'rgba(34, 197, 94, 0.16)',
    color: '#118D57',
    icon: 'solar:smile-circle-bold',
    description: `• Exceeds set targets; takes aggressive action to achieve goals beyond normal expectations
• Exhibits a strong sense of urgency in solving problems and/ or getting results
• Maintains a positive outlook and encourages others to reach goals despite obstacles and adversity. Is continuously on the look-out for opportunities to improve things.
• Makes things happen, regardless of situation and ready to overcome obstacles.
• Is open change.
• Provides inspiration and excitement
• Submits accurate and effective reports and deliverables before the agreed timelines.
• No IVR served such as Negligence or any violation of company policies and procedures on set guidelines among others for this value.`,
  },
];
