import { redirect } from 'next/navigation';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const metadata = { title: 'Manager Dashboard' };

export default function Page() {
  redirect(paths.main.manager.myFeedback);
}
