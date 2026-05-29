'use client';

import { forwardRef, useCallback, useState } from 'react';
import axios from 'src/lib/axios';
import { endpoints } from 'src/api/endpoints';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import type { TransitionProps } from '@mui/material/transitions';

import type { IReviewFeedbackItem } from 'src/types/review-feedback';
import type { IFeedbackApprovalProvider } from 'src/types/feedback-approval';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { AddCommentDialog } from './add-comment-dialog';
import { FEEDBACK_APPROVAL_PROVIDERS } from './mock-data';

// ----------------------------------------------------------------------

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------

const avatarUrlForReviewer = (name: string, index: number) => {
  let avatarIndex = (index % 10) + 2;
  const normName = (name || '').toLowerCase();
  if (normName.includes('wiggins') || normName.includes('chico') || normName.includes('mark')) avatarIndex = 12;
  else if (normName.includes('adrew') || normName.includes('andrew') || normName.includes('kyle') || normName.includes('manuyag')) avatarIndex = 3;
  else if (normName.includes('joy') || normName.includes('shane') || normName.includes('marayag')) avatarIndex = 4;
  else if (normName.includes('remin') || normName.includes('tan') || normName.includes('ian') || normName.includes('mojica')) avatarIndex = 5;
  else if (normName.includes('aloisa') || normName.includes('ng') || normName.includes('kyla') || normName.includes('pantino')) avatarIndex = 6;
  
  return `/assets/images/mock/avatar/avatar-${avatarIndex}.webp`;
};

// ----------------------------------------------------------------------

interface FeedbackRequestDto {
  FeedbackId: string;
  Providers: Array<{ UserId: string; Name: string; Position: string; ProjectName?: string; Reason: string }>;
}

type Props = {
  open: boolean;
  onClose: () => void;
  item: IReviewFeedbackItem | null;
  providers?: IFeedbackApprovalProvider[];
  onApprove?: () => void;
  onReject?: () => void;
  feedbackRequest?: FeedbackRequestDto;
  onApproveSuccess?: () => void;
  onRejectSuccess?: () => void;
};

export function FeedbackListApprovalModal({
  open,
  onClose,
  item,
  providers = FEEDBACK_APPROVAL_PROVIDERS,
  onApprove,
  onReject,
  feedbackRequest,
  onApproveSuccess,
  onRejectSuccess,
}: Readonly<Props>) {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [activeProviderId, setActiveProviderId] = useState<string | null>(null);
  const [providerComments, setProviderComments] = useState<Record<string, string>>({});
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const displayProviders = feedbackRequest?.Providers
    ? feedbackRequest.Providers.map((p, idx) => ({
        id: String(idx + 1),
        employeeName: p.Name,
        employeeAvatarUrl: avatarUrlForReviewer(p.Name, idx),
        position: p.Position,
        projectName: p.ProjectName || '',
        reason: p.Reason,
      }))
    : providers.map((p, idx) => ({
        ...p,
        employeeAvatarUrl: p.employeeAvatarUrl || avatarUrlForReviewer(p.employeeName, idx),
      }));

  const activeProvider = displayProviders.find((p) => p.id === activeProviderId);

  const handleOpenComment = useCallback((providerId: string) => {
    setActiveProviderId(providerId);
    setCommentDialogOpen(true);
  }, []);

  const handleCloseComment = useCallback(() => {
    setCommentDialogOpen(false);
    setActiveProviderId(null);
  }, []);

  const handleSaveComment = useCallback(
    (remarks: string) => {
      if (!activeProviderId) return;
      setProviderComments((prev) => ({ ...prev, [activeProviderId]: remarks }));
    },
    [activeProviderId]
  );

  const handleRemoveComment = useCallback(() => {
    if (!activeProviderId) return;
    setProviderComments((prev) => {
      const next = { ...prev };
      delete next[activeProviderId];
      return next;
    });
  }, [activeProviderId]);

  const handleApprove = async () => {
    const feedbackId = feedbackRequest?.FeedbackId || item?.id;
    if (!feedbackId) return;

    try {
      setApproving(true);
      await axios.patch(endpoints.application.feedback.approve(feedbackId));
      onApprove?.();
      onApproveSuccess?.();
      setConfirmOpen(false);
    } catch (error) {
      console.error('Approve failed:', error);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    const feedbackId = feedbackRequest?.FeedbackId || item?.id;
    if (!feedbackId) return;

    try {
      setRejecting(true);
      await axios.patch(endpoints.application.feedback.reject(feedbackId));
      onReject?.();
      onRejectSuccess?.();
    } catch (error) {
      console.error('Reject failed:', error);
    } finally {
      setRejecting(false);
    }
  };

  if (!item) return null;

  const categoryLabel = item.category.replace(/\s+\d{4}$/, '').trim() || item.category;
  const yearMatch = item.category.match(/\d{4}/);
  const year = yearMatch?.[0] ?? '2026';



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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 1.5,
          gap: 2,
          bgcolor: 'background.neutral',
          minHeight: 72,
          borderBottom: '1px dashed',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <IconButton onClick={onClose} sx={{ color: 'text.primary' }}>
          <Iconify icon="mingcute:close-line" width={24} />
        </IconButton>

        <Typography
          sx={{
            flex: 1,
            fontFamily: 'Henry Sans',
            fontWeight: 700,
            fontSize: 22,
            lineHeight: '32px',
            color: 'text.primary',
          }}
        >
          Feedback List for Approval
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              height: 48,
              px: 2,
              fontWeight: 700,
              fontSize: 17,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={handleReject}
            loading={rejecting}
            variant="outlined"
            startIcon={<Iconify icon="mingcute:close-line" width={18} sx={{ color: 'error.main' }} />}
            sx={{
              height: 48,
              px: 2,
              fontWeight: 700,
              fontSize: 17,
              textTransform: 'none',
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'error.main',
                bgcolor: 'error.lighter',
              },
            }}
          >
            Reject List
          </LoadingButton>

          <LoadingButton
            onClick={handleOpenConfirm}
            loading={approving}
            variant="contained"
            startIcon={<Iconify icon="eva:checkmark-circle-2-fill" width={20} />}
            sx={{
              height: 48,
              px: 2,
              fontWeight: 700,
              fontSize: 17,
              textTransform: 'none',
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Approve List
          </LoadingButton>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          pt: 2.5,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            sx={{
              flexWrap: { xs: 'wrap', xl: 'nowrap' },
              rowGap: 2,
            }}
          >
            <Card
              variant="outlined"
              sx={{
                p: 2,
                width: 380,
                flexShrink: 0,
                borderRadius: '16px',
                borderColor: 'divider',
                boxShadow: 'none',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={item.employeeAvatarUrl}
                  alt={item.employeeName}
                  sx={{ width: 48, height: 48, flexShrink: 0 }}
                >
                  {item.employeeName.charAt(0)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4, fontSize: '13px' }}
                  >
                    Employee to be Reviewed
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.4, fontSize: '15px' }}
                  >
                    {item.employeeName}
                  </Typography>
                </Box>

                <Label
                  variant="soft"
                  color="warning"
                  sx={{
                    flexShrink: 0,
                    height: 'fit-content',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item.statusLabel}
                </Label>
              </Stack>
            </Card>

            <FormControl sx={{ width: 462, flexShrink: 0 }}>
              <InputLabel sx={labelSx}>Feedback Category</InputLabel>
              <Select value={categoryLabel} label="Feedback Category" sx={selectSx} disabled>
                <MenuItem value={categoryLabel}>{categoryLabel}</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: 120, flexShrink: 0 }}>
              <InputLabel sx={labelSx}>Year</InputLabel>
              <Select value={year} label="Year" sx={selectSx} disabled>
                <MenuItem value={year}>{year}</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flex: 1, minWidth: 24, display: { xs: 'none', lg: 'block' } }} />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.125}
              sx={{ flexShrink: 0, ml: { xs: 0, lg: 'auto' } }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 20,
                  borderRadius: '10px',
                  bgcolor: 'action.disabled',
                  display: 'flex',
                  alignItems: 'center',
                  px: '3px',
                  flexShrink: 0,
                }}
              >
                <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'common.white' }} />
              </Box>
              <Typography sx={{ fontSize: 16, color: 'text.primary', whiteSpace: 'nowrap' }}>
                Receive Anonymous Feedback
              </Typography>
            </Stack>
          </Stack>

          <Typography
            sx={{
              mt: 1.5,
              width: 340,
              fontWeight: 500,
              fontSize: 13,
              lineHeight: '20px',
                  color: 'text.disabled',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            SELECT 5 EMPLOYEES
          </Typography>
        </Box>

        <Box sx={{ borderTop: '1px dashed', borderColor: 'divider', pt: 1 }} />

        {displayProviders.map((provider, index) => (
          <Box key={provider.id}>
            <Stack direction="row" alignItems="flex-start" spacing={3}>
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
                  mt: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: 16, color: 'text.secondary' }}>
                  {index + 1}
                </Typography>
              </Box>

              <Stack spacing={3} sx={{ width: 400, flexShrink: 0 }}>
                <FormControl fullWidth>
                  <InputLabel sx={labelSx}>Select Employee</InputLabel>
                  <Select
                    value={provider.employeeName}
                    label="Select Employee"
                    sx={selectSx}
                    disabled
                    renderValue={(value) => (
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          src={provider.employeeAvatarUrl}
                          alt={String(value)}
                          sx={{ width: 28, height: 28 }}
                        >
                          {String(value).charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{value}</Typography>
                      </Stack>
                    )}
                  >
                    <MenuItem value={provider.employeeName}>{provider.employeeName}</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={labelSx}>Position</InputLabel>
                  <Select
                    value={provider.position}
                    label="Position"
                    sx={selectSx}
                    disabled
                  >
                    <MenuItem value={provider.position}>{provider.position}</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <TextField
                label="Project Name"
                value={provider.projectName}
                sx={{ width: 300, flexShrink: 0, ...fieldSx }}
                disabled
              />

              <TextField
                multiline
                rows={4}
                label="Reason"
                value={provider.reason}
                sx={{ flex: 1, ...fieldSx }}
                disabled
              />

              {providerComments[provider.id] ? (
                <Button
                  variant="outlined"
                  onClick={() => handleOpenComment(provider.id)}
                  startIcon={<Iconify icon="solar:pen-bold" width={20} sx={{ color: 'primary.main' }} />}
                  endIcon={
                    <Box
                      component="span"
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'common.white',
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      1
                    </Box>
                  }
                  sx={{
                    flexShrink: 0,
                    mt: 1,
                    height: 40,
                    px: 2,
                    gap: 1,
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: 15,
                    color: 'primary.main',
                    borderColor: 'primary.light',
                    bgcolor: 'background.paper',
                    '& .MuiButton-startIcon': { mr: 0.5 },
                    '& .MuiButton-endIcon': { ml: 1 },
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.lighter',
                    },
                  }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleOpenComment(provider.id)}
                  startIcon={<Iconify icon="solar:chat-round-dots-bold" width={20} />}
                  sx={{
                    flexShrink: 0,
                    mt: 1,
                    height: 48,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'divider',
                    color: 'text.primary',
                  }}
                >
                  Add Comment
                </Button>
              )}
            </Stack>

            {index < displayProviders.length - 1 && (
              <Box sx={{ mt: 3, borderBottom: '1px dashed', borderColor: 'divider' }} />
            )}
          </Box>
        ))}
      </Box>

      <AddCommentDialog
        open={commentDialogOpen}
        onClose={handleCloseComment}
        isEdit={Boolean(activeProviderId && providerComments[activeProviderId])}
        employeeName={activeProvider?.employeeName}
        initialRemarks={activeProviderId ? providerComments[activeProviderId] ?? '' : ''}
        onSave={handleSaveComment}
        onRemove={handleRemoveComment}
      />

      <Dialog
        open={confirmOpen}
        onClose={() => !approving && setConfirmOpen(false)}
        maxWidth="sm"
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
            color: '#1C252E',
            mb: 3,
            fontSize: '18px',
            fontFamily: 'Henry Sans',
          }}
        >
          Approve Feedback
        </Typography>

        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Iconify
            icon="solar:plain-2-bold"
            width={72}
            height={72}
            sx={{ color: 'success.main' }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#1C252E',
              textAlign: 'center',
              fontSize: '20px',
              fontFamily: 'Henry Sans',
            }}
          >
            Submit this Feedback Request?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#637381',
              textAlign: 'center',
              fontSize: '14px',
              maxWidth: 320,
              lineHeight: 1.5,
            }}
          >
            All list on the feedback provider will be notified once submitted
          </Typography>
        </Stack>

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
          {/* Employee to be Reviewed Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              src={item.employeeAvatarUrl}
              alt={item.employeeName}
              sx={{ width: 48, height: 48 }}
            >
              {item.employeeName.charAt(0)}
            </Avatar>
            <Stack spacing={0.25}>
              <Typography
                variant="caption"
                sx={{ color: '#7F8C9D', fontSize: '13px', fontWeight: 500 }}
              >
                Employee to be Reviewed
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#1C252E', fontSize: '14px' }}
              >
                {item.employeeName}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }} />

          {/* Feedback Providers */}
          <Typography
            variant="caption"
            sx={{
              color: '#7F8C9D',
              fontWeight: 500,
              display: 'block',
              mb: 1.5,
              fontSize: '13px',
            }}
          >
            Feedback Providers ({displayProviders.length})
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            {displayProviders.map((provider) => (
              <Stack
                key={provider.id}
                direction="row"
                alignItems="center"
                spacing={1.25}
              >
                <Avatar
                  src={provider.employeeAvatarUrl}
                  alt={provider.employeeName}
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {provider.employeeName.charAt(0)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: '#1C252E',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {provider.employeeName}
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
            disabled={approving}
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
            onClick={handleApprove}
            loading={approving}
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
  width: 1,
  height: 56,
  borderRadius: 1,
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.disabled' },
  '& .MuiSelect-select': { color: 'text.primary' },
};

const labelSx = {
  fontSize: 14,
  fontWeight: 600,
  color: 'text.secondary',
  '&.Mui-focused': { color: 'text.secondary' },
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    bgcolor: 'background.neutral',
    '& fieldset': { borderColor: 'divider' },
  },
};
