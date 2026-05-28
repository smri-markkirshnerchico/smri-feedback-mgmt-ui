'use client';

import type { PerformanceCriterion, FeedbackRating, StarRemarks } from 'src/types/provide-feedback';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

import { RATING_SCALE } from './provide-feedback-constants';
import { EMPTY_STAR_REMARKS } from 'src/types/provide-feedback';

// ----------------------------------------------------------------------

const STAR_FIELDS: {
  key: keyof StarRemarks;
  title: string;
  description: string;
}[] = [
  {
    key: 'situation',
    title: 'Situation',
    description: 'Set the scene and provide context for the example.',
  },
  {
    key: 'task',
    title: 'Task',
    description: 'Describe the specific challenge, responsibility, or goal you faced.',
  },
  {
    key: 'action',
    title: 'Action',
    description:
      'Explain in detail the actions you took to address the situation, focusing on your individual contribution.',
  },
  {
    key: 'result',
    title: 'Result',
    description:
      'Share the outcomes achieved, such as savings, efficiency gains, or lessons learned, ideally with quantifiable data.',
  },
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  criterion: PerformanceCriterion;
  rating: FeedbackRating;
  initialRemarks?: StarRemarks;
  onConfirm?: (remarks: StarRemarks) => void;
};

export function AddRemarksDialog({
  open,
  onClose,
  criterion,
  rating,
  initialRemarks = EMPTY_STAR_REMARKS,
  onConfirm,
}: Readonly<Props>) {
  const [remarks, setRemarks] = useState<StarRemarks>(initialRemarks);

  useEffect(() => {
    if (open) {
      setRemarks(initialRemarks);
    }
  }, [open, initialRemarks]);

  const canConfirm = STAR_FIELDS.every((field) => remarks[field.key].trim().length > 0);

  const handleConfirm = () => {
    onConfirm?.(remarks);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 720,
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Add Remarks
        </Typography>

        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 1.5,
          borderColor: 'divider',
            boxShadow: 'none',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.lighter',
                color: 'primary.main',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {criterion.initials}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {criterion.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {criterion.description}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              {RATING_SCALE.map((item) => {
                const selected = item.value === rating;
                return (
                  <Box
                    key={item.value}
                    sx={{
                      minWidth: 72,
                      height: 40,
                      px: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.75,
                      borderRadius: 10,
                      border: '1px solid',
                      fontWeight: 700,
                      fontSize: 13,
                      color: selected ? item.color : 'text.disabled',
                      borderColor: selected ? item.color : 'divider',
                      bgcolor: selected ? item.bgcolor : 'background.neutral',
                    }}
                  >
                    <Iconify icon={item.icon} width={18} />
                    {item.label}
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
        <Stack spacing={3}>
          {STAR_FIELDS.map((field) => (
            <Box key={field.key}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.25 }}>
                {field.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                {field.description}
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Remarks"
                value={remarks[field.key]}
                onChange={(event) =>
                  setRemarks((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    bgcolor: 'background.neutral',
                    '& fieldset': { borderColor: 'divider' },
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            height: 48,
            px: 2.5,
            fontWeight: 700,
            textTransform: 'none',
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canConfirm}
          onClick={handleConfirm}
          sx={{
            height: 48,
            px: 2.5,
            fontWeight: 700,
            textTransform: 'none',
            bgcolor: canConfirm ? 'primary.main' : 'action.disabledBackground',
            color: canConfirm ? 'primary.contrastText' : 'text.disabled',
            '&:hover': { bgcolor: canConfirm ? 'primary.dark' : 'action.disabledBackground' },
          }}
        >
          Confirm
        </Button>
      </Stack>
    </Dialog>
  );
}
