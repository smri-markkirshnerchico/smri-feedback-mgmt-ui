import { IApplication } from 'src/types/application';

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
import { Form, Field } from 'src/components/hook-form';

import { createApplication, updateApplication } from 'src/api/app/application';

// ----------------------------------------------------------------------

export type ApplicationSchemaType = zod.infer<typeof ApplicationSchema>;

export const ApplicationSchema = zod.object({
  AppCode: zod.string().min(1, { message: 'Code is required' }),
  AppName: zod.string().min(1, { message: 'Name is required' }),
  IsActive: zod.boolean()
});

// ----------------------------------------------------------------------

type Props = {
  current?: IApplication;
  open: boolean;
  onClose: () => void;
};

export function ApplicationForm({ current, open, onClose }: Readonly<Props>) {
  const defaultValues: ApplicationSchemaType = {
    AppCode: '',
    AppName: '',
    IsActive: true
  };

  const methods = useForm<ApplicationSchemaType>({
    mode: 'all',
    resolver: zodResolver(ApplicationSchema),
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
      AppId: current ? current.AppId : '',
      AppCode: data.AppCode,
      AppName: data.AppName,
      IsActive: data.IsActive
    };

    try {
      if (current) {
        await updateApplication(post);
        toast.success('Update success!');
      } 
      else {
        await createApplication(post);
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
      <DialogTitle>{current ? 'Update Application' : 'Create Application'}</DialogTitle>

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
              <Field.Text name="AppCode" label="Code" />
              <Field.Text name="AppName" label="Name" />
            </Box>
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
