import { IRole } from 'src/types/role';

import { useState, useCallback, useEffect } from 'react';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { today, fDateTimeISO } from 'src/utils/format-time';

import { ModuleAccessTree } from './module-access-tree';

import { createRole, updateRole, deleteRole, getRoleModuleAccess } from 'src/api/admin/role';

// ----------------------------------------------------------------------

export type RoleSchemaType = zod.infer<typeof RoleSchema>;

export const RoleSchema = zod.object({
  RoleCode: zod.string().min(1, { message: 'Code is required' }),
  RoleName: zod.string().min(1, { message: 'Name is required' }),
  EffectiveDate: schemaHelper.date({ message: { required: 'Effective Date is required' } }),
  IsActive: zod.boolean(),
  IsDevOps: zod.boolean(),
  IsSysAd: zod.boolean(),
  IsWF: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  isDevSet: boolean;
  isDevOps: boolean;
  appId: string;
  current?: IRole;
  open: boolean;
  onClose: () => void;
};

export function RoleForm({ isDevSet, isDevOps, appId, current, open, onClose }: Readonly<Props>) {
  const { roleModuleAccess, roleModuleAccessValidating, roleModuleAccessEmpty } = getRoleModuleAccess(appId, current?.RoleId);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSetSelectedItems = useCallback((items: string[]) => {
    setSelectedItems(items);
  }, []);

  useEffect(() => {
    setSelectedItems(roleModuleAccess.filter(m => m.IsSelected).map(m => m.Id));
  }, [roleModuleAccess]);

  const defaultValues: RoleSchemaType = {
    RoleCode: '',
    RoleName: '',
    EffectiveDate: today(),
    IsActive: true,
    IsDevOps: false,
    IsSysAd: false,
    IsWF: false,
  };

  const methods = useForm<RoleSchemaType>({
    mode: 'all',
    resolver: zodResolver(RoleSchema),
    defaultValues,
    values: current ?? defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const selected = roleModuleAccess.filter(item => selectedItems.includes(item.Id));

    const module = selected.filter(item => item.IsModule).map(module => ({
      ModuleId: module.Id,
      MenuId: selected.filter(menu => menu.ModuleId === module.Id).map(menu => menu.Id)
    }));

    const post = {
      RoleID: current ? current.RoleId : '',
      RoleCode: data.RoleCode,
      RoleName: data.RoleName,
      EffectiveDate: fDateTimeISO(data.EffectiveDate),
      IsActive: data.IsActive,
      IsDevOps: data.IsDevOps,
      IsSysAd: data.IsSysAd,
      AppId: appId,
      Module: module,
      IsWF: data.IsWF
    };

    try {
      if (current) {
        await updateRole(post);
        toast.success('Update success!');
      }
      else {
        await createRole(post);
        toast.success('Create success!');
      }
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  });

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const confirmDialog = useBoolean();

  const handleDelete = useCallback(async () => {
    if (!current?.RoleId) {
      toast.error('No role is currently selected.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteRole(current?.RoleId);
      toast.success('Delete success!');
      confirmDialog.onFalse();
      onClose();
      setIsDeleting(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      setIsDeleting(false);
    }
  }, [current?.RoleId, confirmDialog.onFalse]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={`Are you sure you want to delete '${current?.RoleName}'?`}
      action={
        <LoadingButton variant="contained" color="error" loading={isDeleting} onClick={handleDelete}>
          Delete
        </LoadingButton>
      }
    />
  );

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      scroll="body"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{current ? 'Update Role' : 'Create Role'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 1 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 6,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }
              }}
            >
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 6,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Field.Text name="RoleCode" label="Code" />
                <Field.Text name="RoleName" label="Name" />
                <Field.DatePicker name="EffectiveDate" label="Effective Date" />
                <Box
                  sx={{
                    rowGap: 3,
                    columnGap: 6,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }
                  }}
                >
                  <Field.Switch name="IsActive" label="Active" />
                  {!current?.IsDevSet && (
                    <>
                      {isDevSet && (
                        <Field.Switch name="IsDevOps" label="DevOps" />
                      )}
                      {!current?.IsDevOps && (
                        <>
                          {(isDevSet || isDevOps) && (
                            <Field.Switch name="IsSysAd" label="SysAd" />
                          )}
                          {(isDevSet || isDevOps) && (
                            <Field.Switch name="IsWF" label="Workflow" />
                          )}
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Box>
              {current?.IsDevSet && (
                <Alert variant="outlined" severity="info">
                  All Access Applied
                </Alert>
              ) || (
                  <ModuleAccessTree
                    list={roleModuleAccess}
                    listValidating={roleModuleAccessValidating}
                    listEmpty={roleModuleAccessEmpty}
                    selectedItems={selectedItems}
                    onSetSelectedItems={handleSetSelectedItems}
                  />
                )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ flexShrink: 0 }}>
          {!!current && (
            <Tooltip title="Delete">
              <IconButton color="error" onClick={confirmDialog.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {current ? 'Save Changes' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>

      {renderConfirmDialog()}
    </Dialog>
  );
}
