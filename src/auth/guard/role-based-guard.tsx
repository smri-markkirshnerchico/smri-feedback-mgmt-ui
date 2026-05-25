'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
import { LoadingScreen } from 'src/components/loading-screen';

import { usePathname } from 'src/routes/hooks';

import { getMenus } from 'src/api/core/menu';

import type { NavSectionProps } from 'src/components/nav-section';

// ----------------------------------------------------------------------

type NavItem = NonNullable<NavSectionProps['data']>[number]['items'][number];

function normalizePath(path: string) {
  return path.replace(/\/$/, '');
}

function collectMenuPaths(items: NavItem[] = []): string[] {
  return items.flatMap((item) => {
    const paths = item.path ? [normalizePath(item.path)] : [];
    const childPaths = item.children ? collectMenuPaths(item.children) : [];
    return [...paths, ...childPaths];
  });
}

function canAccessPath(menu: NavSectionProps['data'], pathname: string): boolean {
  const normalizedPathname = normalizePath(pathname);
  const allowedPaths = (menu ?? []).flatMap((section) => collectMenuPaths(section.items));

  return allowedPaths.some((allowedPath) => {
    if (normalizedPathname === allowedPath) return true;
    return normalizedPathname.startsWith(`${allowedPath}/`);
  });
}

// ----------------------------------------------------------------------

export type RoleBasedGuardProp = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function RoleBasedGuard({ children, sx }: Readonly<RoleBasedGuardProp>) {
  if (CONFIG.auth.skip) {
    return <>{children}</>;
  }

  const { navData, navDataLoading } = getMenus();

  const pathname = usePathname();

  const checkAccess = canAccessPath(navData, pathname);
  
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