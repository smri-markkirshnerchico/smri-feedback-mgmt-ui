import { IModule } from 'src/types/module';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { today, fDateTimeISO } from 'src/utils/format-time';

import { createModule, updateModule } from 'src/api/admin/module';

// ----------------------------------------------------------------------

export type ModuleSchemaType = zod.infer<typeof ModuleSchema>;

export const ModuleSchema = zod.object({
  ModuleCode: zod.string().min(1, { message: 'Code is required' }),
  ModuleName: zod.string().min(1, { message: 'Name is required' }),
  EffectiveDate: schemaHelper.date({ message: { required: 'Effective Date is required' } }),
  Description: zod.string().nullable(),
  Alias: zod.string().nullable(),
  Icon: zod.string().nullable(),
  Url: zod.string().nullable(),
  IsActive: zod.boolean()
});

// ----------------------------------------------------------------------

type Props = {
  current?: IModule;
  appId: string;
  open: boolean;
  onClose: () => void;
};

export function ModuleForm({ current, appId, open, onClose }: Readonly<Props>) {
  const defaultValues: ModuleSchemaType = {
    ModuleCode: '',
    ModuleName: '',
    EffectiveDate: today(),
    Description: null,
    Alias: null,
    Icon: null,
    Url: null,
    IsActive: true
  };

  const methods = useForm<ModuleSchemaType>({
    mode: 'all',
    resolver: zodResolver(ModuleSchema),
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
      ModuleId: current ? current.ModuleId : '',
      ModuleCode: data.ModuleCode,
      ModuleName: data.ModuleName,
      EffectiveDate: fDateTimeISO(data.EffectiveDate),
      Description: data.Description,
      Alias: data.Alias,
      Icon: data.Icon,
      Url: data.Url,
      IsActive: data.IsActive,
      AppId: appId
    };

    try {
      if (current) {
        await updateModule(post);
        toast.success('Update success!');
      } 
      else {
        await createModule(post);
        toast.success('Create success!');
      }
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      scroll="body"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{current ? 'Update Module' : 'Create Module'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 1 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }
              }}
            >
              <Field.Text name="ModuleCode" label="Code" />
              <Field.Text name="ModuleName" label="Name" />
              <Field.DatePicker name="EffectiveDate" label="Effective Date" />
              <Field.Text name="Description" label="Description" />
              <Field.Text name="Alias" label="Alias" />
              <Field.Text name="Icon" label="Icon" />
            </Box>
            <Field.Text name="Url" label="URL" />
            <Field.Switch name="IsActive" label="Active" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {current ? 'Save Changes' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
