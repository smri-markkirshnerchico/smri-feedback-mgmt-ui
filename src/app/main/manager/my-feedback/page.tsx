import { ReviewsFeedbackView } from 'src/sections/manager/reviews-feedback';

// ----------------------------------------------------------------------

export const metadata = { title: 'My Feedback' };

export default function Page() {
  return <ReviewsFeedbackView currentTab="my-feedback" />;
}
