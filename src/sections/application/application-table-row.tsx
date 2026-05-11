import { IApplication } from 'src/types/application';

import { useState, useCallback } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { deleteApplication } from 'src/api/admin/application';

// ----------------------------------------------------------------------

type Props = {
  row: IApplication;
  onOpenForm: () => void;
};

export function ApplicationTableRow({ row, onOpenForm }: Readonly<Props>) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const menuActions = usePopover();

  const confirmDialog = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem 
          onClick={() => {
            onOpenForm();
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <LoadingButton variant="contained" color="error" loading={isDeleting} onClick={handleDelete}>
          Delete
        </LoadingButton>
      }
    />
  );

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteApplication(row.AppId);
      toast.success('Delete success!');
      confirmDialog.onFalse();
      setIsDeleting(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      setIsDeleting(false);
    }
  }, [row.AppId, confirmDialog.onFalse]);

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.AppCode}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.AppName}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(row.IsActive && 'success') || 'error'}
          >
            {(row.IsActive && 'Active') || 'Inactive'}
          </Label>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}