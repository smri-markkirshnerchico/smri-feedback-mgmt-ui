'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  employeeName?: string;
  initialRemarks?: string;
  onSave?: (remarks: string) => void;
  onRemove?: () => void;
};

export function AddCommentDialog({
  open,
  onClose,
  isEdit = false,
  employeeName,
  initialRemarks = '',
  onSave,
  onRemove,
}: Readonly<Props>) {
  const [remarks, setRemarks] = useState(initialRemarks);

  useEffect(() => {
    if (open) {
      setRemarks(initialRemarks);
    }
  }, [open, initialRemarks]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave?.(remarks);
    onClose();
  };

  const handleRemove = () => {
    setRemarks('');
    onRemove?.();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 560,
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {isEdit ? 'Edit Comment' : 'Add Comment'}
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
        <TextField
          fullWidth
          multiline
          minRows={5}
          label="Remarks"
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder={
            employeeName
              ? `Add remarks regarding ${employeeName}.`
              : 'Enter your remarks.'
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              '& fieldset': { borderColor: 'rgba(145, 158, 171, 0.32)' },
              '&:hover fieldset': { borderColor: 'rgba(145, 158, 171, 0.48)' },
              '&.Mui-focused fieldset': { borderColor: '#102FF6' },
            },
            '& .MuiInputLabel-root': {
              fontSize: 14,
              fontWeight: 600,
              color: 'text.secondary',
            },
          }}
        />
      </DialogContent>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, pb: 3, pt: 1 }}
      >
        <Button
          variant="outlined"
          onClick={handleRemove}
          sx={{
            height: 48,
            px: 2.5,
            fontWeight: 700,
            fontSize: 15,
            textTransform: 'none',
            color: '#FF5630',
            borderColor: 'rgba(255, 86, 48, 0.48)',
            '&:hover': {
              borderColor: '#FF5630',
              bgcolor: 'rgba(255, 86, 48, 0.08)',
            },
          }}
        >
          Remove
        </Button>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              height: 48,
              px: 2.5,
              fontWeight: 700,
              fontSize: 15,
              textTransform: 'none',
              color: 'text.primary',
              borderColor: 'rgba(145, 158, 171, 0.32)',
              '&:hover': { bgcolor: 'rgba(145, 158, 171, 0.08)' },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              height: 48,
              px: 2.5,
              fontWeight: 700,
              fontSize: 15,
              textTransform: 'none',
              bgcolor: '#102FF6',
              '&:hover': { bgcolor: '#0919d4' },
            }}
          >
            {isEdit ? 'Update' : 'Add Comment'}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
