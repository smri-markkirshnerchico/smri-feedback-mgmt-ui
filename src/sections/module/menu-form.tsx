import { IMenu } from 'src/types/menu';

import { useState, useCallback, useEffect } from 'react';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { today, fDateTimeISO } from 'src/utils/format-time';

import { createMenu, updateMenu, deleteMenu } from 'src/api/admin/menu';

// ----------------------------------------------------------------------

export type MenuSchemaType = zod.infer<typeof MenuSchema>;

export const MenuSchema = zod.object({
  MenuName: zod.string().min(1, { message: 'Name is required' }),
  Description: zod.string().nullable(),
  Icon: zod.string().nullable(),
  Link: zod.string().nullable(),
  Sequence: schemaHelper.nullableInput(zod.number().min(1, { message: 'Sequence is required' }), { message: 'Sequence is required'}),
  EffectiveDate: schemaHelper.date({ message: { required: 'Effective Date is required' } }),
  IsFolder: zod.boolean(),
  IsActive: zod.boolean(),
  ParentMenuId: zod.string().nullable()
});

// ----------------------------------------------------------------------

type Props = {
  current?: IMenu;
  menus: IMenu[];
  menusValidating: boolean;
  moduleId: string;
  onResetCurrent: () => void;
};

export function MenuForm({ current, menus, menusValidating, moduleId, onResetCurrent }: Readonly<Props>) {
  const defaultValues: MenuSchemaType = {
    MenuName: '',
    Description: null,
    Icon: null,
    Link: '',
    Sequence: null,
    EffectiveDate: today(),
    IsFolder: false,
    IsActive: true,
    ParentMenuId: null
  };

  const methods = useForm<MenuSchemaType>({
    mode: 'all',
    resolver: zodResolver(MenuSchema),
    defaultValues,
    values: current ?? defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const post = {
      MenuId: current ? current.MenuId : '',
      MenuName: data.MenuName,
      Description: data.Description,
      Icon: data.Icon,
      Link: data.Link,
      Sequence: data.Sequence,
      EffectiveDate: fDateTimeISO(data.EffectiveDate),
      IsFolder: data.IsFolder,
      IsActive: data.IsActive,
      ParentMenuId: data.ParentMenuId,
      ModuleId: moduleId
    };

    try {
      if (current) {
        await updateMenu(post);
        toast.success('Update success!');
      } 
      else {
        await createMenu(post);
        toast.success('Create success!');
      }
      reset();
      onResetCurrent();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  });

  const parentMenus = menus.filter(m => m.IsFolder && (!current || m.MenuId !== current.MenuId));

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const confirmDialog = useBoolean();

  const handleDelete = useCallback(async () => {
    if (!current?.MenuId) {
      toast.error('No menu is currently selected.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteMenu(current?.MenuId);
      toast.success('Delete success!');
      confirmDialog.onFalse();
      onResetCurrent();
      setIsDeleting(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      setIsDeleting(false);
    }
  }, [current?.MenuId, confirmDialog.onFalse]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={`Are you sure you want to delete?`}
      action={
        <LoadingButton variant="contained" color="error" loading={isDeleting} onClick={handleDelete}>
          Delete
        </LoadingButton>
      }
    />
  );

  useEffect(() => {
    onResetCurrent();
  }, [moduleId]);

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} mb={3}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }
            }}
          >
            <Field.Text name="MenuName" label="Name" />
            <Field.Text name="Description" label="Description" />
            <Field.Text name="Icon" label="Icon" />
            <Field.Text name="Link" label="Link" />
            <Field.Text name="Sequence" label="Sequence" type="number" />
            <Field.DatePicker name="EffectiveDate" label="Effective Date" />
            <Field.Switch name="IsFolder" label="Folder" />
            <Field.Switch name="IsActive" label="Active" />
          </Box>
          <Field.Autocomplete
            name="ParentMenuId"
            label="Parent Menu"
            autoHighlight
            loading={menusValidating}
            options={parentMenus.map((option) => option.MenuId)}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={(option) => (parentMenus.find((m) => m.MenuId === option)?.MenuName || '')}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {parentMenus.find((m) => m.MenuId === option)?.MenuName || ''}
              </li>
            )}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1}>
            {!!current && (
              <Tooltip title="Delete">
                <IconButton color="error" onClick={confirmDialog.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <Stack direction="row" spacing={2}>
            {!!current && (
              <Button variant="outlined" onClick={onResetCurrent}>
                Cancel
              </Button>
            )}
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {current ? 'Save Changes' : 'Add'}
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>

      {renderConfirmDialog()}
    </>
  );
}
