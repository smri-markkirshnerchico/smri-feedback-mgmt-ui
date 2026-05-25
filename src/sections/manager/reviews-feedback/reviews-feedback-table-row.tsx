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
  onClick?: () => void;
  showStartFeedbackButton?: boolean;
  onStartFeedback?: () => void;
};

function getStatusColor(status: IReviewFeedbackItem['status']) {
  if (status === 'for-your-approval') return 'warning';
  if (status === 'completed') return 'success';
  return 'info';
}

export function ReviewsFeedbackTableRow({ row, onClick, showStartFeedbackButton, onStartFeedback }: Readonly<Props>) {
  return (
    <TableRow
      onClick={onClick}
      sx={{
        '& > td': {
          border: 0,
          py: 2,
        },
        bgcolor: 'background.neutral',
        ...(onClick && {
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }),
        '&:first-of-type td:first-of-type': { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
        '&:first-of-type td:last-of-type': { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
      }}
    >
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            src={row.employeeAvatarUrl}
            alt={row.employeeName}
            sx={{ width: 40, height: 40 }}
          >
            {row.employeeName.charAt(0)}
          </Avatar>
          <Typography variant="subtitle2">{row.employeeName}</Typography>
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
          <Button
            variant="outlined"
            color="primary"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            onClick={onStartFeedback}
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
              {row.reviewerAvatarUrls.map((url, index) => (
                <Avatar key={url + index} src={url} alt={`Reviewer ${index + 1}`} />
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
