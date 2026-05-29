'use client';

import { forwardRef, useState, useMemo } from 'react';
import useSWR from 'swr';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Divider from '@mui/material/Divider';
import type { TransitionProps } from '@mui/material/transitions';

import { CONFIG } from 'src/global-config';
import axios from 'src/lib/axios';
import { endpoints } from 'src/api/endpoints';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------

interface Employee {
  UserId: string;
  EmpId: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  EmailAddress: string;
  PositionDesc: string | null;
  IsActive: boolean;
  IsResigned: boolean;
}

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: employeesData = [], isLoading: employeesLoading } = useSWR(
    open ? `${endpoints.core.admin.user.list}?appId=${CONFIG.feedbackAppId}` : null,
    async (url) => {
      const res = await axios.get<Employee[]>(url);
      return res.data.filter((emp) => emp.IsActive && !emp.IsResigned) || [];
    }
  );

  const activeEmployees = useMemo(
    () => Array.isArray(employeesData) ? employeesData.map((emp) => ({
      id: emp.UserId,
      name: `${emp.FirstName} ${emp.MiddleName} ${emp.LastName}`.trim(),
      position: emp.PositionDesc || 'N/A',
    })) : [],
    [employeesData]
  );

  const isProjectCategory = category === 'Project Related Feedback';
  const isValid = rows.every((r) => r.employee && r.reason && (!isProjectCategory || r.projectName));

  const updateRow = (index: number, field: keyof ProviderRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitError(null);
      setSubmitting(true);

      await axios.post(endpoints.application.feedback.root, {
        Category: category,
        Year: year,
        Anonymous: anonymous,
        Providers: rows
          .filter((r) => r.employee)
          .map((r) => {
            const emp = activeEmployees.find((e) => e.id === r.employee);
            return {
              UserId: r.employee,
              Name: emp?.name,
              Position: r.position,
              ProjectName: r.projectName || null,
              Reason: r.reason,
            };
          }),
      });

      setSubmitting(false);
      setConfirmOpen(false);
      onClose();
    } catch (error) {
      setSubmitting(false);
      const message = error instanceof Error ? error.message : 'Failed to submit feedback';
      setSubmitError(message);
    }
  };

  const selectedProviders = rows.filter((r) => r.employee).map((r) => {
    const emp = activeEmployees.find((e) => e.id === r.employee);
    return emp;
  }).filter(Boolean);

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
          bgcolor: 'background.neutral',
          minHeight: '72px',
          borderBottom: '1px dashed',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <IconButton onClick={onClose} sx={{ p: '4px', color: 'text.primary' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
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
            color: 'text.primary',
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
              color: 'text.primary',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              px: '16px',
              height: '48px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            disabled={!isValid || submitting}
            loading={submitting}
            onClick={handleOpenConfirm}
            sx={{
              fontWeight: 700,
              fontSize: '17px',
              borderRadius: '8px',
              px: '16px',
              height: '48px',
              textTransform: 'none',
              bgcolor: isValid ? 'primary.main' : 'action.disabledBackground',
              color: isValid ? 'primary.contrastText' : 'text.disabled',
              '&:hover': { bgcolor: isValid ? 'primary.dark' : 'action.disabledBackground' },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'text.disabled',
              },
            }}
          >
            Submit for Approval
          </LoadingButton>
        </Stack>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: '24px', pt: '20px', pb: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {submitError && (
          <Alert severity="error" onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {/* Top Meta Filters */}
        <Stack direction="row" alignItems="center" gap="24px">
          <FormControl sx={{ width: '462px' }}>
            <InputLabel
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'text.secondary',
                '&.Mui-focused': { color: 'text.secondary' },
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
                color: 'text.secondary',
                '&.Mui-focused': { color: 'text.secondary' },
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
                bgcolor: anonymous ? 'primary.main' : 'action.disabled',
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
                  bgcolor: 'common.white',
                  transition: 'transform 300ms',
                  transform: anonymous ? 'translateX(16px)' : 'translateX(0)',
                }}
              />
            </Box>
            <Typography sx={{ fontSize: '16px', color: 'text.primary' }}>
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
            color: 'text.disabled',
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
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: '8px',
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '16px', color: 'text.secondary' }}>
                  {index + 1}
                </Typography>
              </Box>

              {/* Employee + Position */}
              <Stack gap="24px" sx={{ width: '400px', flexShrink: 0 }}>
                <FormControl fullWidth disabled={employeesLoading}>
                  <InputLabel sx={labelSx}>
                    {employeesLoading ? 'Loading employees...' : 'Select Employee'}
                  </InputLabel>
                  <Select
                    value={row.employee}
                    onChange={(e) => {
                      const selectedEmp = activeEmployees.find((emp) => emp.id === e.target.value);
                      updateRow(index, 'employee', e.target.value);
                      if (selectedEmp) {
                        updateRow(index, 'position', selectedEmp.position);
                      }
                    }}
                    label="Select Employee"
                    sx={selectSx}
                  >
                    {employeesLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading...
                      </MenuItem>
                    ) : (
                      activeEmployees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={labelSx}>Position</InputLabel>
                  <Select
                    value={row.position}
                    onChange={(e) => updateRow(index, 'position', e.target.value)}
                    label="Position"
                    disabled
                    sx={selectSx}
                  >
                    {row.position && <MenuItem value={row.position}>{row.position}</MenuItem>}
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
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.disabled' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                    '& .MuiInputBase-input::placeholder': { color: 'text.disabled', opacity: 1 },
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
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.disabled' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'text.disabled', opacity: 1 },
                }}
                InputProps={{ sx: { minHeight: '98px', alignItems: 'flex-start', py: '16px' } }}
              />
            </Stack>

            {index < rows.length - 1 && (
              <Box sx={{ mt: '24px', borderBottom: '1px dashed', borderColor: 'divider' }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Confirmation Modal */}
      <Dialog
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: '20px',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 3,
            fontSize: '18px',
            fontFamily: 'Henry Sans',
          }}
        >
          Submit for Approval
        </Typography>

        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Iconify
            icon="solar:letter-send-bold"
            width={72}
            height={72}
            sx={{ color: 'success.main' }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              textAlign: 'center',
              fontSize: '20px',
              fontFamily: 'Henry Sans',
            }}
          >
            Submit this list for approval?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              fontSize: '14px',
              maxWidth: 320,
            }}
          >
            Once submitted, the approver will be notified to review and validate the selected feedback providers.
          </Typography>
        </Stack>

        {/* Approver and Providers Combined Card */}
        <Card
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 4,
            borderRadius: '16px',
            borderColor: 'divider',
            boxShadow: 'none',
            bgcolor: 'background.paper',
          }}
        >
          {/* Approver Section */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'background.neutral', color: 'text.secondary' }}>
              J
            </Avatar>
            <Stack spacing={0.25}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '13px' }}
              >
                Approver
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: 'text.primary', fontSize: '15px' }}
              >
                Janicca Juniller
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }} />

          {/* Feedback Providers Section */}
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              display: 'block',
              mb: 1.5,
              fontSize: '13px',
            }}
          >
            Feedback Providers ({selectedProviders.length})
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            {selectedProviders.map((provider, idx) => (
              <Stack
                key={idx}
                direction="row"
                alignItems="center"
                spacing={1.25}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '13px',
                    fontWeight: 600,
                    bgcolor: 'background.neutral',
                    color: 'text.secondary',
                  }}
                >
                  {provider?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {provider?.name}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => setConfirmOpen(false)}
            disabled={submitting}
            sx={{
              height: 40,
              px: 3,
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={submitting}
            sx={{
              height: 40,
              px: 3,
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'none',
              borderRadius: '10px',
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Proceed
          </LoadingButton>
        </Stack>
      </Dialog>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

const selectSx = {
  height: '56px',
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.disabled' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
  '& .MuiSelect-select': { color: 'text.primary' },
};

const labelSx = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'text.secondary',
  '&.Mui-focused': { color: 'text.secondary' },
};
