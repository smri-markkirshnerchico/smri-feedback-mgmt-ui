import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  onOpenNav: () => void;
};

export function AccessHeader({ sx, onOpenNav }: Props) {
  return (
    <Box
      sx={[
        () => ({
          py: 1,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <IconButton onClick={onOpenNav}>
        <Iconify icon="solar:hamburger-menu-linear" />
      </IconButton>
    </Box>
  );
}
