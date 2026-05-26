'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  employeeName: string;
  email: string;
  avatarUrl: string;
  lineManager: string;
  dateTimeInitiated: string;
  category: string;
  year: string;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography
        variant="caption"
        sx={{
          color: '#808080',
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
          color: '#1A1A1A',
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
}: Readonly<Props>) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.vars.customShadows.z1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.4,
          color: '#1A1A1A',
          mb: 3,
          textAlign: 'left',
        }}
      >
        Employee to be Reviewed
      </Typography>

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
            color: '#1A1A1A',
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
            color: '#808080',
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
      </Stack>

      <CardDivider />
    </Card>
  );
}
