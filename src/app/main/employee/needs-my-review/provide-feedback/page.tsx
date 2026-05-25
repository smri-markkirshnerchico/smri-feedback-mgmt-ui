import { Suspense } from 'react';

import { paths } from 'src/routes/paths';
import { ProvideFeedbackView } from 'src/sections/reviews-feedback/provide-feedback-view';

// ----------------------------------------------------------------------

export const metadata = { title: 'Provide Feedback' };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProvideFeedbackView needsMyReviewPath={paths.main.employee.needsMyReview} />
    </Suspense>
  );
}
