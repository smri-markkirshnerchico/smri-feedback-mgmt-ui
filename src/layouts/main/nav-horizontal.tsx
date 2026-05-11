import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { NavSectionHorizontal } from 'src/components/nav-section';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export type NavHorizontalProps = NavSectionProps & {
  layoutQuery?: Breakpoint;
  loading: boolean;
};

export function NavHorizontal({
  sx,
  data,
  loading,
  className,
  layoutQuery = 'md',
  ...other
}: NavHorizontalProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.nav.root, layoutClasses.nav.horizontal, className])}
      sx={[
        (theme) => ({
          width: 1,
          position: 'relative',
          flexDirection: 'column',
          display: { xs: 'none', [layoutQuery]: 'flex' },
          borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Divider
        sx={{
          top: 0,
          left: 0,
          width: 1,
          zIndex: 9,
          position: 'absolute',
          borderStyle: 'dashed',
        }}
      />

      <Box
        sx={{
          px: 1.5,
          height: 'var(--layout-nav-horizontal-height)',
          backgroundColor: 'var(--layout-nav-horizontal-bg)',
          backdropFilter: `blur(var(--layout-header-blur))`,
          WebkitBackdropFilter: `blur(var(--layout-header-blur))`,
        }}
      >
        {!loading && (
          <NavSectionHorizontal data={data} {...other} />
        ) || (
          <Stack sx={{ pt: 3, px: 3 }} direction={'row'} spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton sx={{ width: 100 }} key={i} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
