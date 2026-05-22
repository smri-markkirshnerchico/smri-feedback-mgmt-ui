import { ReviewsFeedbackView } from 'src/sections/manager/reviews-feedback';

// ----------------------------------------------------------------------

export const metadata = { title: 'My Teams Review' };

export default function Page() {
  return <ReviewsFeedbackView currentTab="my-teams-review" />;
}
