'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function ManagerDashboardView() {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Manager Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your manager dashboard. This is a placeholder page.
        </Typography>
      </Box>
    </Container>
  );
}
