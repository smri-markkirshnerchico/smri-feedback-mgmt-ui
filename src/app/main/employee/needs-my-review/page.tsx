import { ReviewsFeedbackView } from 'src/sections/employee/reviews-feedback';

// ----------------------------------------------------------------------

export const metadata = { title: 'Needs My Review' };

export default function Page() {
  return <ReviewsFeedbackView currentTab="needs-my-review" />;
}
