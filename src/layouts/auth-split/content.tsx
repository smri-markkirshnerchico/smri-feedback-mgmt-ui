'use client';

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export type AuthSplitContentProps = BoxProps & { layoutQuery?: Breakpoint };

export function AuthSplitContent({
  sx,
  children,
  className,
  layoutQuery = 'md',
  ...other
}: AuthSplitContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: '#F4F7F9',
          p: theme.spacing(3, 2, 6, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            flex: '1 1 50%',
            maxWidth: '50%',
            p: theme.spacing(6, 5),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'var(--layout-auth-content-width)',
          p: { xs: 3.5, sm: 5 },
          borderRadius: 2.5,
          bgcolor: 'common.white',
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
