'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps;

export function AccountDrawer({ sx, ...other }: AccountDrawerProps) {
  const { user } = useAuthContext();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar src={user?.photoURL} alt={user?.Name} sx={{ width: 1, height: 1 }}>
        {user?.Name?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={user?.photoURL}
        displayName={user?.Name ?? ''}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true }, paper: { sx: { width: 320 } } }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              py: 6,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.Name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.Email}
            </Typography>
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}