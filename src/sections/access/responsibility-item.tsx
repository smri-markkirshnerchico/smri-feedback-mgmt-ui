import type { IResponsibility } from 'src/types/responsibility';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  isDevSet: boolean;
  isDevOps: boolean;
  item: IResponsibility;
  onClickEdit: () => void;
  onClickDetails: () => void;
};

export function ResponsibilityItem({ isDevSet, isDevOps, item, onClickEdit, onClickDetails }: Readonly<Props>)  {
  return (
    <ListItem 
      disablePadding
      sx={(theme) => ({
        p: 2,
        gap: 2,
        borderRadius: 2,
        border: `1px solid ${theme.vars.palette.divider}`,
        transition: theme.transitions.create(['background-color', 'box-shadow'], {
          duration: theme.transitions.duration.shortest,
        }),
        "&:hover": {
          backgroundColor: theme.vars.palette.action.hover,
          boxShadow:  theme.vars.customShadows.z20,
        },
      })}
      secondaryAction={
        <>
          <Tooltip title="Edit">
            <IconButton color="inherit" onClick={onClickEdit}>
              <Iconify icon="solar:pen-bold-duotone" />
            </IconButton>
          </Tooltip>
          {(!isDevSet && !isDevOps) && (
            <Tooltip title="Details">
              <IconButton color="info" onClick={onClickDetails}>
                <Iconify icon="solar:file-bold-duotone" />
              </IconButton>
            </Tooltip>
          )}
        </>
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Iconify icon="solar:folder-check-bold" width={24} />
        <ListItemText
          primary={item.RespName}
          secondary={
            <Stack direction='row' spacing={1} sx={{ mt: 0.5,  flexWrap: 'wrap' }}>
              <Label variant="soft" color={(item.IsActive && 'success') || 'error'}>
                {(item.IsActive && 'Active') || 'Inactive'}
              </Label>
              <Label variant="soft" color="info">
                {item.CoGrpCode}
              </Label>
              <Label variant="soft">
                Effective {fDate(item.EffectiveDate)}
              </Label>
            </Stack>
          }
          slotProps={{
            primary: { noWrap: true }
          }}
        />
      </Box>
    </ListItem>
  );
}