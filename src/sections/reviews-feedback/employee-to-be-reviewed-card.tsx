'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  employeeName: string;
  email: string;
  avatarUrl: string;
  lineManager: string;
  dateTimeInitiated: string;
  category: string;
  year: string;
  status?: string;
  completion?: string;
  completionDate?: string;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: 12,
          lineHeight: 1.5,
          fontWeight: 400,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.primary',
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function CardDivider() {
  return (
    <Box
      sx={{
        width: 1,
        height: '1px',
        bgcolor: 'divider',
      }}
    />
  );
}

export function EmployeeToBeReviewedCard({
  employeeName,
  email,
  avatarUrl,
  lineManager,
  dateTimeInitiated,
  category,
  year,
  status,
  completion,
  completionDate,
}: Readonly<Props>) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: 'background.paper',
        border: '1.5px dashed',
        borderColor: 'divider',
      }}
    >

      <Stack alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
        <Avatar
          src={avatarUrl}
          alt={employeeName}
          sx={{
            width: 88,
            height: 88,
            border: '4px solid',
            borderColor: 'background.neutral',
          }}
        >
          {employeeName.charAt(0)}
        </Avatar>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.5,
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {employeeName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: 14,
            lineHeight: 1.5,
            color: 'text.secondary',
            fontWeight: 400,
            textAlign: 'center',
          }}
        >
          {email}
        </Typography>
      </Stack>

      <CardDivider />

      <Stack spacing={2.5} sx={{ py: 2.5 }}>
        <DetailRow label="Line Manger" value={lineManager} />
        <DetailRow label="Date time Initiated" value={dateTimeInitiated} />
        <DetailRow label="Category" value={category} />
        <DetailRow label="Year" value={year} />

        {status && (
          <Stack spacing={0.5}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: 12,
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              Status
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <Label variant="soft" color={status === 'Pending' ? 'warning' : 'success'}>
                {status}
              </Label>
            </Box>
          </Stack>
        )}

        {completion && (
          <Stack spacing={0.5}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: 12,
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              Completion
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <Label
                variant="soft"
                color="default"
                sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}
                startIcon={<Iconify icon="solar:users-group-rounded-bold" width={16} />}
              >
                {completion}
              </Label>
            </Box>
          </Stack>
        )}

        {completionDate && (
          <DetailRow label="Completion Date & Time" value={completionDate} />
        )}
      </Stack>
    </Card>
  );
}
