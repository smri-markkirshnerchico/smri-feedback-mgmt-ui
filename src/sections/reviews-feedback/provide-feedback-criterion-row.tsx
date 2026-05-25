'use client';

import type { PerformanceCriterion, FeedbackRating, StarRemarks } from 'src/types/provide-feedback';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { canAddRemarks, hasStarRemarks } from 'src/types/provide-feedback';

import { RATING_SCALE } from './provide-feedback-constants';
import { AddRemarksDialog } from './add-remarks-dialog';

// ----------------------------------------------------------------------

type Props = {
  criterion: PerformanceCriterion;
  rating: FeedbackRating | null;
  starRemarks: StarRemarks;
  onRatingChange: (rating: FeedbackRating) => void;
  onStarRemarksChange: (remarks: StarRemarks) => void;
};

export function ProvideFeedbackCriterionRow({
  criterion,
  rating,
  starRemarks,
  onRatingChange,
  onStarRemarksChange,
}: Readonly<Props>) {
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);

  const remarksEnabled = canAddRemarks(rating);
  const remarksFilled = hasStarRemarks(starRemarks);

  const handleRatingChange = (value: FeedbackRating) => {
    onRatingChange(value);
    if (value === 'ME') {
      onStarRemarksChange({ situation: '', task: '', action: '', result: '' });
      setRemarksDialogOpen(false);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          borderColor: 'rgba(145, 158, 171, 0.2)',
          boxShadow: 'none',
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
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

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25 }}>
              {criterion.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {criterion.description}
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
            {RATING_SCALE.map((item) => {
              const selected = rating === item.value;
              return (
                <Button
                  key={item.value}
                  variant="outlined"
                  onClick={() => handleRatingChange(item.value)}
                  sx={{
                    minWidth: 72,
                    height: 40,
                    px: 1.5,
                    gap: 0.75,
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    color: selected ? item.color : 'text.secondary',
                    borderColor: selected ? item.color : 'rgba(145, 158, 171, 0.32)',
                    bgcolor: selected ? item.bgcolor : 'common.white',
                    '&:hover': {
                      borderColor: item.color,
                      bgcolor: item.bgcolor,
                    },
                  }}
                >
                  <Iconify icon={item.icon} width={18} />
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
            <Button
              variant="outlined"
              disabled={!remarksEnabled}
              startIcon={<Iconify icon="solar:flag-bold" width={18} />}
              onClick={() => remarksEnabled && setRemarksDialogOpen(true)}
              sx={{
                height: 40,
                px: 1.5,
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: 'nowrap',
                color: remarksFilled ? '#102FF6' : 'text.primary',
                borderColor: remarksFilled
                  ? 'rgba(16, 47, 246, 0.32)'
                  : 'rgba(145, 158, 171, 0.32)',
                '&.Mui-disabled': {
                  color: 'rgba(145, 158, 171, 0.48)',
                  borderColor: 'rgba(145, 158, 171, 0.24)',
                  bgcolor: 'rgba(145, 158, 171, 0.08)',
                },
              }}
            >
              {remarksFilled ? 'Edit Remarks' : 'Add Remarks'}
            </Button>
            <IconButton
              size="small"
              disabled={!remarksEnabled}
              onClick={() => remarksEnabled && setRemarksDialogOpen(true)}
              sx={{ color: 'text.secondary' }}
            >
              <Iconify icon="eva:arrow-ios-downward-fill" width={18} />
            </IconButton>
          </Stack>
        </Stack>
      </Card>

      {remarksEnabled && rating && (
        <AddRemarksDialog
          open={remarksDialogOpen}
          onClose={() => setRemarksDialogOpen(false)}
          criterion={criterion}
          rating={rating}
          initialRemarks={starRemarks}
          onConfirm={onStarRemarksChange}
        />
      )}
    </>
  );
}
