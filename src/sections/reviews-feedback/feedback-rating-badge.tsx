'use client';

import type { FeedbackRating } from 'src/types/provide-feedback';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { RATING_SCALE } from './provide-feedback-constants';

// ----------------------------------------------------------------------

export const RATING_BADGE_WIDTH = 76;
export const RATING_BADGE_HEIGHT = 32;

type Props = {
  rating: FeedbackRating;
};

export function FeedbackRatingBadge({ rating }: Readonly<Props>) {
  const ratingMeta = RATING_SCALE.find((item) => item.value === rating);

  if (!ratingMeta) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0.75}
      sx={{
        width: RATING_BADGE_WIDTH,
        height: RATING_BADGE_HEIGHT,
        borderRadius: '8px',
        bgcolor: ratingMeta.badgeBg,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Iconify icon={ratingMeta.icon} width={18} sx={{ color: ratingMeta.badgeColor }} />
      </Box>
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: 13,
          lineHeight: '18px',
          letterSpacing: '0.02em',
          color: ratingMeta.badgeColor,
          minWidth: 18,
          textAlign: 'center',
        }}
      >
        {ratingMeta.label}
      </Typography>
    </Stack>
  );
}
