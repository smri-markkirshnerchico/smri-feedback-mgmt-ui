'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function EmployeeMyFeedbackView() {
  return (
    <Box sx={{ p: '40px' }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: '24px' }}>
        <Box>
          <Typography
            sx={{
              fontFamily: 'Henry Sans',
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: '48px',
              color: '#102FF6',
              mb: 1
            }}
          >
            Reviews & Feedback
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Henry Sans',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              color: '#1C252E'
            }}
          >
            Supporting employee development through regular reviews and open communication
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            fontFamily: 'Henry Sans',
            backgroundColor: '#102FF6',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: '8px',
            textTransform: 'none',
            height: '48px',
            minWidth: '210px',
            '&:hover': {
              backgroundColor: '#0919d4'
            }
          }}
        >
          <span style={{ marginRight: '8px' }}>+</span>
          Start your Feedback
        </Button>
      </Stack>

      {/* Empty State Content */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '500px'
      }}>
        {/* Icon */}
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-empty.svg`}
          sx={{
            width: '120px',
            height: '120px',
            mb: 4
          }}
        />

        {/* Message */}
        <Typography
          sx={{
            fontFamily: 'Henry Sans',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            color: '#1C252E',
            mb: 3
          }}
        >
          No Reviews & Feedback Yet
        </Typography>

        {/* Button */}
        <Button
          variant="outlined"
          sx={{
            fontFamily: 'Henry Sans',
            borderColor: '#102FF6',
            color: '#102FF6',
            fontSize: '14px',
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: '8px',
            textTransform: 'none',
            border: '1px solid #102FF6',
            '&:hover': {
              backgroundColor: 'rgba(16, 47, 246, 0.08)',
              borderColor: '#102FF6'
            }
          }}
        >
          <span style={{ marginRight: '8px' }}>+</span>
          Start your Feedback
        </Button>
      </Box>
    </Box>
  );
}
