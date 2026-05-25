'use client';

import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const SM_RETAIL_LOGO = `${CONFIG.assetsDir}/logo/SM Retail logo 1.svg`;

export type AuthSplitFooterProps = BoxProps;

export function AuthSplitFooter({ sx, ...other }: AuthSplitFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={[
        {
          width: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          px: { xs: 3, md: 5 },
          py: 2,
          bgcolor: 'common.white',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt="SM Retail"
        src={SM_RETAIL_LOGO}
        sx={{
          height: 12,
          width: 'auto',
          maxHeight: 12,
        }}
      />

      <Typography variant="caption" sx={{ color: 'black' }}>
        © {currentYear} Powered by SM Retail ITS
      </Typography>
    </Box>
  );
}
