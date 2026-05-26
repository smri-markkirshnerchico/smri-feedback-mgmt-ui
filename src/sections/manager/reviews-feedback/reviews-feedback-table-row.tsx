import type { IReviewFeedbackItem } from 'src/types/review-feedback';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ReviewerAvatarStack } from 'src/sections/reviews-feedback/reviewer-avatar-stack';
import { reviewsFeedbackTableRowSx } from 'src/sections/reviews-feedback/reviews-feedback-table-styles';

// ----------------------------------------------------------------------

type Props = {
  row: IReviewFeedbackItem;
  onClick?: () => void;
  showStartFeedbackButton?: boolean;
  onStartFeedback?: () => void;
  onViewFeedback?: () => void;
};

function getStatusColor(status: IReviewFeedbackItem['status']) {
  if (status === 'for-your-approval') return 'warning';
  if (status === 'in-progress') return 'success';
  if (status === 'completed') return 'success';
  return 'info';
}

export function ReviewsFeedbackTableRow({
  row,
  onClick,
  showStartFeedbackButton,
  onStartFeedback,
  onViewFeedback,
}: Readonly<Props>) {
  const employeeName = row.employeeName ?? 'Unknown';
  const employeeInitial = employeeName.charAt(0).toUpperCase();
  const isSubmitted = row.status === 'completed' && row.statusLabel === 'Feedback Submitted';

  return (
    <TableRow
      onClick={onClick}
      sx={(theme) => reviewsFeedbackTableRowSx(theme, { clickable: Boolean(onClick) })}
    >
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            src={row.employeeAvatarUrl}
            alt={employeeName}
            sx={{ width: 40, height: 40 }}
          >
            {employeeInitial}
          </Avatar>
          <Typography variant="subtitle2">{employeeName}</Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {row.category}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2">{fDate(row.dateInitiated, 'DD MMM YYYY')}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fTime(row.dateInitiated)}
        </Typography>
      </TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {row.statusLabel}
        </Label>
      </TableCell>

      <TableCell>
        <Label variant="soft" color="default" sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}>
          {row.completion}
        </Label>
      </TableCell>

      {showStartFeedbackButton ? (
        <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
          {isSubmitted ? (
            <Button
              variant="outlined"
              color="primary"
              endIcon={<Iconify icon="eva:eye-fill" />}
              onClick={(event) => {
                event.stopPropagation();
                onViewFeedback?.();
              }}
              sx={{
                borderRadius: 1,
                px: 2.5,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              View
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              onClick={(event) => {
                event.stopPropagation();
                onStartFeedback?.();
              }}
              sx={{
                borderRadius: 1,
                px: 2.5,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Start Feedback
            </Button>
          )}
        </TableCell>
      ) : (
        <>
          <TableCell sx={{ verticalAlign: 'middle' }}>
            <ReviewerAvatarStack reviewers={row.reviewerAvatarUrls} />
          </TableCell>

          <TableCell>
            <Box sx={{ typography: 'body2', color: 'text.disabled' }}>{row.avgScore ?? '--'}</Box>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
