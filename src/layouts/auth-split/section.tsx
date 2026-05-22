import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const LOGIN_LEFT_PANEL_BG = `${CONFIG.assetsDir}/assets/background/LoginLeftPanel.svg`;

export type AuthSplitSectionProps = BoxProps & {
  method?: string;
  imgUrl?: string;
  title?: string;
  subtitle?: string;
  layoutQuery?: Breakpoint;
  methods?: {
    path: string;
    label: string;
  }[];
};

export function AuthSplitSection({
  sx,
  layoutQuery = 'md',
  imgUrl = `${CONFIG.assetsDir}/assets/background/login-img.svg`,
  title = 'Together We Improve',
  subtitle = 'Share your feedback to help us enhance our workplace, processes, and employee experience.',
  ...other
}: AuthSplitSectionProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          flex: 1,
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 8 },
          width: 1,
          display: 'none',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#0030FF',
          backgroundImage: `url(${LOGIN_LEFT_PANEL_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          [theme.breakpoints.up(layoutQuery)]: {
            flex: '1 1 50%',
            maxWidth: '50%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt="Feedback illustration"
        src={imgUrl}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 1,
          maxWidth: 420,
          height: 'auto',
          mb: 5,
        }}
      />

      <Typography
        variant="h3"
        sx={{
          position: 'relative',
          zIndex: 1,
          mb: 2,
          color: 'common.white',
          fontWeight: 700,
          textAlign: 'center',
          maxWidth: 480,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'common.white',
          textAlign: 'center',
          maxWidth: 420,
          lineHeight: 1.7,
          opacity: 0.95,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}
