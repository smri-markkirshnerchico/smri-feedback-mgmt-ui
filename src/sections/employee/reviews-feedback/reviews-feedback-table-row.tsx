import type { IReviewFeedbackItem } from 'src/types/review-feedback';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  row: IReviewFeedbackItem;
  showStartFeedbackButton?: boolean;
  onStartFeedback?: () => void;
};

function getStatusColor(status: IReviewFeedbackItem['status'] | 'rejected') {
  if (status === 'for-your-approval') return 'warning';
  if (status === 'completed') return 'success';
  if (status === 'rejected') return 'error';
  return 'info';
}

export function ReviewsFeedbackTableRow({ row, showStartFeedbackButton, onStartFeedback }: Readonly<Props>) {
  const employeeName = row.employeeName ?? 'Unknown';
  const employeeInitial = employeeName.charAt(0).toUpperCase();

  return (
    <TableRow
      sx={{
        '& > td': {
          border: 0,
          py: 2,
        },
        bgcolor: '#ffffff',
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        borderRadius: '12px',
        '&:first-of-type td:first-of-type': { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
        '&:first-of-type td:last-of-type': { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
      }}
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

      {showStartFeedbackButton ? (
        <TableCell sx={{ textAlign: 'right' }}>
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
        </TableCell>
      ) : (
        <>
          <TableCell>
            <Label variant="soft" color="default" sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}>
              {row.completion}
            </Label>
          </TableCell>

          <TableCell>
            <AvatarGroup
              max={5}
              sx={{
                justifyContent: 'flex-start',
                '& .MuiAvatar-root': {
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  border: (theme) => `2px solid ${theme.vars.palette.background.paper}`,
                },
              }}
            >
              {row.reviewerAvatarUrls.map((item, index) => (
                <Avatar key={item + index} src={item.startsWith('http') ? item : undefined} alt={item}>
                  {!item.startsWith('http') && item.charAt(0).toUpperCase()}
                </Avatar>
              ))}
            </AvatarGroup>
          </TableCell>

          <TableCell>
            <Box sx={{ typography: 'body2', color: 'text.disabled' }}>{row.avgScore ?? '--'}</Box>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
