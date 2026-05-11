import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

type Props = {
  length: number;
  height: number;
};

export function AccessSkeleton({ length, height }: Readonly<Props>) {
  return Array.from({ length: length }, (_, index) => (
    <Box
      key={index}
      sx={[
        {
          py: 1,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        },
      ]}
    >
      <Stack spacing={1} flexGrow={1}>
        <Skeleton sx={{ width: 1, height: height }} />
      </Stack>
    </Box>
  ));
}
