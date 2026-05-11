import { IResponsibility } from 'src/types/responsibility';

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

import {
  createResponsibility, 
  updateResponsibility, 
  deleteResponsibility, 
  getResponsibilityModuleAccess
} from 'src/api/admin/responsibility';

import { getSessionCompanyGroups } from 'src/api/admin/session';

// ----------------------------------------------------------------------

export type ResponsibilitySchemaType = zod.infer<typeof ResponsibilitySchema>;

export const ResponsibilitySchema = zod.object({
  RespName: zod.string().min(1, { message: 'Name is required' }),
  CoGrpCode: schemaHelper.nullableInput(zod.string().min(1, { message: 'Company Group is required' }), { message: 'Company Group is required'}),
  EffectiveDate: schemaHelper.date({ message: { required: 'Effective Date is required' } }),
  IsActive: zod.boolean()
});

// ----------------------------------------------------------------------

type Props = {
  roleId: string;
  isDevSet: boolean;
  isDevOps: boolean;
  current?: IResponsibility;
  open: boolean;
  onClose: () => void;
};

export function ResponsibilityForm({ roleId, isDevSet, isDevOps, current, open, onClose }: Readonly<Props>) {
  const { respModuleAccess, respModuleAccessValidating, respModuleAccessEmpty } = getResponsibilityModuleAccess(open, roleId, current?.RespId);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const handleSetSelectedItems = useCallback((items: string[]) => {
    setSelectedItems(items);
  }, []);

  useEffect(() => {
    setSelectedItems(respModuleAccess.filter(m => m.IsSelected).map(m => m.Id));
  }, [respModuleAccess]);

  const defaultValues: ResponsibilitySchemaType = {
    RespName: '',
    CoGrpCode: '',
    EffectiveDate: today(),
    IsActive: true
  };

  const methods = useForm<ResponsibilitySchemaType>({
    mode: 'all',
    resolver: zodResolver(ResponsibilitySchema),
    defaultValues,
    values: current ?? defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const selected = respModuleAccess.filter(item => selectedItems.includes(item.Id));

    const module = selected.filter(item => item.IsModule).map(module => ({
      ModuleId: module.Id,
      MenuId: selected.filter(menu => menu.ModuleId === module.Id).map(menu => menu.Id),
      OrgAccess: []
    }));

    const post = {
      RespId: current ? current.RespId : '',
      RespName: data.RespName,
      CoGrpCode: data.CoGrpCode,
      EffectiveDate: fDateTimeISO(data.EffectiveDate),
      IsActive: data.IsActive,
      RoleId: roleId,
      Module: module
    };

    try {
      if (current) {
        await updateResponsibility(post);
        toast.success('Update success!');
      } 
      else {
        await createResponsibility(post);
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
    if (!current?.RespId) {
      toast.error('No responsibility is currently selected.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteResponsibility(current?.RespId);
      toast.success('Delete success!');
      confirmDialog.onFalse();
      onClose();
      setIsDeleting(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      setIsDeleting(false);
    }
  }, [current?.RespId, confirmDialog.onFalse]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={`Are you sure you want to delete '${current?.RespName}'?`}
      action={
        <LoadingButton variant="contained" color="error" loading={isDeleting} onClick={handleDelete}>
          Delete
        </LoadingButton>
      }
    />
  );

  const { sessionCoGrps, sessionCoGrpsValidating } = getSessionCompanyGroups();

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      scroll="body"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{current ? 'Update Responsibility' : 'Create Responsibility'}</DialogTitle>

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
                <Field.Text name="RespName" label="Name" />
                <Field.DatePicker name="EffectiveDate" label="Effective Date" />
                <Field.Autocomplete
                  name="CoGrpCode"
                  label="Company Group"
                  autoHighlight
                  loading={sessionCoGrpsValidating}
                  options={sessionCoGrps.map((option) => option.CoGrpCode)}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option) => sessionCoGrps.find((m) => m.CoGrpCode === option)?.CoGrpDesc || ''}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {sessionCoGrps.find((m) => m.CoGrpCode === option)?.CoGrpDesc}
                    </li>
                  )}
                />
                <Field.Switch name="IsActive" label="Active" />
              </Box>
              {isDevSet && (
                  <Alert variant="outlined" severity="info">
                    All Access Applied
                  </Alert>
              ) || (
                <ModuleAccessTree
                  list={respModuleAccess}
                  listValidating={respModuleAccessValidating}
                  listEmpty={respModuleAccessEmpty}
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
