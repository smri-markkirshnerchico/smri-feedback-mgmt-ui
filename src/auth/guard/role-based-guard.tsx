'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
import { LoadingScreen } from 'src/components/loading-screen';

import { usePathname } from 'src/routes/hooks';

import { getMenus } from 'src/api/core/menu';

// ----------------------------------------------------------------------

export type RoleBasedGuardProp = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function RoleBasedGuard({ children, sx }: Readonly<RoleBasedGuardProp>) {
  const { navData, navDataLoading } = getMenus();

  const pathname = usePathname().replace(/\/$/, "");

  const hasMatchingPath = (menu: typeof navData, path: string): boolean => {
    return menu.some(list =>
      list.items.some(item =>
        item.path === path || (item.children && hasMatchingPath([{ items: item.children }], path))
      )
    );
  };

  const checkAccess = hasMatchingPath(navData, pathname);
  
  if (navDataLoading) {
    return <LoadingScreen />
  }

  if (!checkAccess) {
    return (
      <Container
        component={MotionContainer}
        sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permission denied
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    );
  }

  return <> {children} </>;
}