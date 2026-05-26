import type { PerformanceCriterion, FeedbackRating } from 'src/types/provide-feedback';

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

export const CRITERION_DESCRIPTIONS: Record<string, Record<FeedbackRating, string>> = {
  leadership: {
    NI: 'From none at all to limited visible manifestation of paving the way and creating conditions to make life better for others.',
    ME: `Sets a good example for direct reports and others
• Sets SMART and challenging targets and meets them
• Accomplishes the Unit's goals through effective planning, organizing, leading, and controlling.
• Manages direct reports' performance
• Motivates and inspires subordinates to achieve goals and standards
• Promotes Learning and Development
• Accountable for his/ her decisions
• Knows and acts within the Company's rules and regulations.`,
    EE: `Exceeds the Unit's goals through effective planning, organizing, leading, and controlling
• Implements activities to exceed the targets based on standards
• Communicates and rewards achievements across the organization
• Cultivates an environment which continually raises performance standards and energizes people across the organization.
• Uses SM's position of strength to make life happier, healthier and more prosperous for others
• Considers the wider good`,
  },
  entrepreneurship: {
    NI: 'From none at all to limited visible manifestation of the desire to look for ways to improve on current work/processes.',
    ME: `Searches and recommends ways to improve how things are done
• Listens to and observes customers, stays in tune to how their tastes and needs are changing and how we can change with them
• Implements and sustains processes and new ways of doing things
• Takes careful, calculated risks
• Optimizes use of resources for desired results.
• Contributes to a Sustainable workplace
• Is accountable for his/ her decisions`,
    EE: `Is innovative; constantly looks for ways of doing things better, even when things are working well
• Solicits feedback and suggestions and applies them to fine-tune innovations
• Acts as the customers' champion
• Provides his/ her team with new knowledge, latest trends and technologies which are useful to the business
• Applies innovative solutions to non-routine work processes.`,
  },
  drive: {
    NI: 'From none at all to limited visible manifestation of giving his best efforts to deliver good results.',
    ME: `Leads and drives the team to meet the required targets
• Creates and implements work plans with contingencies
• Takes responsibility for getting things done efficiently and effectively
• Is action-oriented, considers options and then acts decisively
• Manifests a "can do" attitude. Is resilient and adaptive.
• No IVR served such as Negligence or any violation of company policies and procedures on set guidelines among others for this value.`,
    EE: `Exceeds set targets; takes aggressive action to achieve goals beyond normal expectations
• Exhibits a strong sense of urgency in solving problems and/ or getting results
• Maintains a positive outlook and encourages others to reach goals despite obstacles and adversity. Is continuously on the look-out for opportunities to improve things.
• Makes things happen, regardless of situation and ready to overcome obstacles.
• Is open change.
• Provides inspiration and excitement
• Submits accurate and effective reports and deliverables before the agreed timelines.
• No IVR served such as Negligence or any violation of company policies and procedures on set guidelines among others for this value.`,
  },
  integrity: {
    NI: 'Does not exhibit "Meets Expectations" behaviors for this value.',
    ME: `Handles confidential matters professionally
• Acts with honesty and is guided by strong moral principles; does the right thing even when it is unpopular to do so, even when no one is looking
• Honors commitments. Does what you say you will.
• Places the good of the organization above personal gain.
• Models and promotes culture of respect, fairness and trust
• Accountable for his/ her actions
• Encourages a feedback and coaching culture
• No IVR served such as Dishonesty and Disloyalty among others for this value.`,
    EE: `Is known to consistently espouse and apply a high set of ethical and moral principles.
• Is indisputably trusted to keep confidences and to protect sensitive information, even to his/ her detriment; promotes the value of trust and respect
• Exudes decency, fairness, moral and ethical business standards at all times and situations
• Walks the talk when it comes to work ethics and conduct.
• No IVR served such as Dishonesty and Disloyalty among others for this value.`,
  },
  teamwork: {
    NI: 'Poor team collaboration. Avoids sharing skills and knowledge with others. Lacks mutual support to achieve a common goal.',
    ME: `Fully cooperates in team activities within and outside his/ her Department
• Knows how to work with others and share information to accomplish goals.
• Motivates and inspires the team to achieve their highest potential
• Creates an environment that fosters collaboration, mutual support and achievement of a common goal across teams
• Treats colleagues of different personalities, traits and backgrounds with the same respect, care, and consideration
• Learns from others as well as shares knowledge and skills generously with others in his/ her own team and with other teams
• Maintains cohesiveness of the team by fostering cooperation and respect.
• Embraces diversity and inclusion
• No IVR that goes against this value.`,
    EE: `Leads and participates in all team activities and projects, including those outside the normal scope of responsibility, capitalizing on diverse skills and ideas
• Is aware of the strengths and limitations of each individual member and uses this to assign specific and relevant roles to each member.
• Unselfishly shares resources, ideas, experiences, and knowledge with team/s to achieve the organization's goals and objectives.
• Leads, inspires/ energizes the team despite setbacks.
• No IVR that goes against this value.`,
  },
};

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
