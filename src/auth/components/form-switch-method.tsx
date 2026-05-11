import Link from '@mui/material/Link';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  label?: string;
  onClick: () => void;
};

export function FormSwitchMethod({ label, onClick }: Readonly<Props>) {
  return (
    <Link
      color="inherit"
      variant="subtitle2"
      sx={[
        {
          mt: 3,
          gap: 0.5,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
          cursor: 'pointer'
        }
      ]}
      onClick={onClick}
    >
      <Iconify width={16} icon="eva:sync-fill" />
      {label || 'Try another method'}
    </Link>
  );
}
