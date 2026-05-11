import { JwtSignInView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in` };

export default function Page() {
  return <JwtSignInView />;
}
