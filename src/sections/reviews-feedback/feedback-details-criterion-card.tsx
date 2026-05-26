'use client';

import type { PerformanceCriterion, FeedbackRating, StarRemarks } from 'src/types/provide-feedback';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'minimal-shared/utils';

import { Iconify } from 'src/components/iconify';

import { FeedbackRatingBadge } from './feedback-rating-badge';

// ----------------------------------------------------------------------

const CARD_PADDING_X = 20;
const CARD_PADDING_Y = 16;
const AVATAR_SIZE = 48;

type Props = {
  criterion: PerformanceCriterion;
  rating: FeedbackRating;
  starRemarks: StarRemarks;
  defaultExpanded?: boolean;
};

const STAR_FIELDS = [
  { key: 'situation', label: 'Situation' },
  { key: 'task', label: 'Task' },
  { key: 'action', label: 'Action' },
  { key: 'result', label: 'Result' },
] as const;

function canExpandRemarks(rating: FeedbackRating) {
  return rating === 'NI' || rating === 'EE' || rating === 'ME';
}

export function FeedbackDetailsCriterionCard({
  criterion,
  rating,
  starRemarks,
  defaultExpanded = false,
}: Readonly<Props>) {
  const expandable = canExpandRemarks(rating);
  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: '12px',
        border: '1px solid',
        borderColor: expanded
          ? varAlpha(theme.vars.palette.primary.mainChannel, 0.48)
          : theme.vars.palette.divider,
        boxShadow: 'none',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      })}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        sx={{
          px: `${CARD_PADDING_X}px`,
          py: `${CARD_PADDING_Y}px`,
        }}
      >
        <Box
          sx={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(16, 47, 246, 0.08)',
            color: '#102FF6',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {criterion.initials}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 0.5, color: '#1A1A1A', fontSize: 15, lineHeight: 1.4 }}
          >
            {criterion.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.6, fontSize: 14 }}>
            {criterion.description}
          </Typography>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ flexShrink: 0, pt: 0.5 }}
        >
          <FeedbackRatingBadge rating={rating} />

          <IconButton
            size="small"
            disabled={!expandable}
            onClick={() => setExpanded((prev) => !prev)}
            sx={{
              width: 32,
              height: 32,
              p: 0,
              color: '#637381',
              visibility: expandable ? 'visible' : 'hidden',
            }}
          >
            <Iconify
              icon={expanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              width={20}
            />
          </IconButton>
        </Stack>
      </Stack>

      {expandable && (
        <Collapse in={expanded}>
          <Stack
            spacing={1.5}
            sx={{
              px: `${CARD_PADDING_X}px`,
              pb: `${CARD_PADDING_Y}px`,
              pt: 0,
            }}
          >
            {STAR_FIELDS.map((field) => {
              const value = starRemarks[field.key];
              if (!value?.trim()) return null;

              return (
                <Box
                  key={field.key}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#F4F6F8',
                    width: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mb: 0.75,
                      color: '#919EAB',
                      fontWeight: 400,
                      fontSize: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    {field.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1A1A1A',
                      lineHeight: 1.7,
                      fontSize: 14,
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Collapse>
      )}
    </Card>
  );
}
