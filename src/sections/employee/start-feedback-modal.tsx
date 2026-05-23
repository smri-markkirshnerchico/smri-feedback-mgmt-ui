'use client';

import { forwardRef, useState } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import type { TransitionProps } from '@mui/material/transitions';

// ----------------------------------------------------------------------

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------

const CATEGORIES = [
  'Project Related Feedback',
  'Employee Performance (Mid Year)',
  'Employee Performance (Year End)',
] as const;

interface ProviderRow {
  employee: string;
  position: string;
  projectName: string;
  reason: string;
}

const EMPTY_ROW: ProviderRow = { employee: '', position: '', projectName: '', reason: '' };

interface Props {
  open: boolean;
  onClose: () => void;
}

export function StartFeedbackModal({ open, onClose }: Props) {
  const [category, setCategory] = useState('Project Related Feedback');
  const [year, setYear] = useState('2026');
  const [anonymous, setAnonymous] = useState(false);
  const [rows, setRows] = useState<ProviderRow[]>(Array.from({ length: 5 }, () => ({ ...EMPTY_ROW })));

  const isProjectCategory = category === 'Project Related Feedback';
  const isValid = rows.every((r) => r.employee && r.reason && (!isProjectCategory || r.projectName));

  const updateRow = (index: number, field: keyof ProviderRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          px: '24px',
          py: '12px',
          gap: '16px',
          bgcolor: '#F9FAFB',
          minHeight: '72px',
          borderBottom: '1px dashed rgba(145, 158, 171, 0.2)',
          flexShrink: 0,
        }}
      >
        <IconButton onClick={onClose} sx={{ p: '4px', color: '#1C252E' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#1C252E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>

        <Typography
          sx={{
            fontFamily: 'Henry Sans',
            fontWeight: 700,
            fontSize: '22px',
            lineHeight: '32px',
            color: '#1C252E',
            flex: 1,
          }}
        >
          Start your Feedback
        </Typography>

        <Stack direction="row" gap="16px" alignItems="center">
          <Button
            onClick={onClose}
            sx={{
              fontWeight: 700,
              fontSize: '17px',
              color: '#1C252E',
              border: '1px solid rgba(145, 158, 171, 0.32)',
              borderRadius: '8px',
              px: '16px',
              height: '48px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(145, 158, 171, 0.08)' },
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={!isValid}
            sx={{
              fontWeight: 700,
              fontSize: '17px',
              borderRadius: '8px',
              px: '16px',
              height: '48px',
              textTransform: 'none',
              bgcolor: isValid ? '#102FF6' : 'rgba(145, 158, 171, 0.24)',
              color: isValid ? '#FFFFFF' : 'rgba(145, 158, 171, 0.8)',
              '&:hover': { bgcolor: isValid ? '#0919d4' : 'rgba(145, 158, 171, 0.24)' },
              '&.Mui-disabled': {
                bgcolor: 'rgba(145, 158, 171, 0.24)',
                color: 'rgba(145, 158, 171, 0.8)',
              },
            }}
          >
            Submit for Approval
          </Button>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: '24px', pt: '20px', pb: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Top Meta Filters */}
        <Stack direction="row" alignItems="center" gap="24px">
          <FormControl sx={{ width: '462px' }}>
            <InputLabel
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#637381',
                '&.Mui-focused': { color: '#637381' },
              }}
            >
              Feedback Category
            </InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Feedback Category"
              sx={selectSx}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '120px' }}>
            <InputLabel
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#637381',
                '&.Mui-focused': { color: '#637381' },
              }}
            >
              Year
            </InputLabel>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              label="Year"
              sx={selectSx}
            >
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2026">2026</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" alignItems="center" gap="9px">
            <Box
              onClick={() => setAnonymous((v) => !v)}
              sx={{
                width: 36,
                height: 20,
                borderRadius: '10px',
                bgcolor: anonymous ? '#102FF6' : 'rgba(145, 158, 171, 0.48)',
                display: 'flex',
                alignItems: 'center',
                px: '3px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background-color 300ms',
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: '#FFFFFF',
                  transition: 'transform 300ms',
                  transform: anonymous ? 'translateX(16px)' : 'translateX(0)',
                }}
              />
            </Box>
            <Typography sx={{ fontSize: '16px', color: '#1C252E' }}>
              Receive Anonymous Feedback
            </Typography>
          </Stack>
        </Stack>

        {/* Section Label */}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#919EAB',
            letterSpacing: '0.05em',
          }}
        >
          SELECT 5 FEEDBACK PROVIDER
        </Typography>

        {/* Provider Rows */}
        {rows.map((row, index) => (
          <Box key={index}>
            <Stack direction="row" alignItems="flex-start" gap="24px">
              {/* Index Badge */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#DFE3E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: '8px',
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#637381' }}>
                  {index + 1}
                </Typography>
              </Box>

              {/* Employee + Position */}
              <Stack gap="24px" sx={{ width: '400px', flexShrink: 0 }}>
                <FormControl fullWidth>
                  <InputLabel sx={labelSx}>Select Employee</InputLabel>
                  <Select
                    value={row.employee}
                    onChange={(e) => updateRow(index, 'employee', e.target.value)}
                    label="Select Employee"
                    sx={selectSx}
                  >
                    <MenuItem value="John Doe">John Doe</MenuItem>
                    <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                    <MenuItem value="Alex Johnson">Alex Johnson</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={labelSx}>Position</InputLabel>
                  <Select
                    value={row.position}
                    onChange={(e) => updateRow(index, 'position', e.target.value)}
                    label="Position"
                    sx={selectSx}
                  >
                    <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                    <MenuItem value="Product Manager">Product Manager</MenuItem>
                    <MenuItem value="Designer">Designer</MenuItem>
                    <MenuItem value="QA Engineer">QA Engineer</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {/* Project Name (only for Project Related Feedback) */}
              {isProjectCategory && (
                <TextField
                  placeholder="Project Name"
                  value={row.projectName}
                  onChange={(e) => updateRow(index, 'projectName', e.target.value)}
                  sx={{
                    width: '300px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      height: '56px',
                      '& fieldset': { borderColor: 'rgba(145, 158, 171, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(145, 158, 171, 0.4)' },
                      '&.Mui-focused fieldset': { borderColor: '#102FF6' },
                    },
                    '& .MuiInputBase-input::placeholder': { color: '#919EAB', opacity: 1 },
                  }}
                />
              )}

              {/* Reason */}
              <TextField
                multiline
                rows={4}
                placeholder="Reason"
                value={row.reason}
                onChange={(e) => updateRow(index, 'reason', e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    alignItems: 'flex-start',
                    '& fieldset': { borderColor: 'rgba(145, 158, 171, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(145, 158, 171, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#102FF6' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: '#919EAB', opacity: 1 },
                }}
                InputProps={{ sx: { minHeight: '98px', alignItems: 'flex-start', py: '16px' } }}
              />
            </Stack>

            {index < rows.length - 1 && (
              <Box sx={{ mt: '24px', borderBottom: '1px dashed rgba(145, 158, 171, 0.2)' }} />
            )}
          </Box>
        ))}
      </Box>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

const selectSx = {
  height: '56px',
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(145, 158, 171, 0.2)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(145, 158, 171, 0.4)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#102FF6' },
  '& .MuiSelect-select': { color: '#1C252E' },
};

const labelSx = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#637381',
  '&.Mui-focused': { color: '#637381' },
};
