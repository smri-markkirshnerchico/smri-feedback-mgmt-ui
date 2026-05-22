import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Readonly<Props>) {
  return (
    <GuestGuard>
      <AuthSplitLayout hideHeader>
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}