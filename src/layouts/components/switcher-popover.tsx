'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Skeleton from '@mui/material/Skeleton';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { getMinimalsModules } from 'src/api/admin/minimals';

// ----------------------------------------------------------------------

export type SwitcherPopoverProps = ButtonBaseProps & {
  data?: {
    id: number;
    code: string;
    name: string;
    icon: string;
    redirect: string;
    current: boolean;
  }[];
};

export function SwitcherPopover({ sx, ...other }: SwitcherPopoverProps) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { switchData, switchDataLoading } = getMinimalsModules();

  const buttonBg: SxProps<Theme> = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {switchDataLoading ? (
        <Skeleton sx={{ width: 100, height: 30 }} />
      ) : (
        <>
          <Iconify width={24} icon={switchData.find((m) => m.current === true)?.icon ?? ''} />

          <Box
            component="span"
            sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
          >
            {switchData.find((m) => m.current === true)?.name}
          </Box>

          <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
        </>
      )}
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55 } },
      }}
    >
      <MenuList sx={{ width: 240 }}>
        {switchDataLoading ? (
          <Skeleton sx={{ m: 1, width: 220, height: 30 }} />
        ) : (
          switchData.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.current}
              onClick={() => window.open(option.redirect, "_self")}
              sx={{ height: 48 }}
            >
              <Iconify width={24} icon={option.icon} />

              <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
                {option.name}
              </Box>
            </MenuItem>
          ))
        )}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
