import { IOrgAccess } from 'src/types/responsibility';

import { useState, useCallback, useEffect } from 'react';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
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

import { getSessionCompanies, getSessionBranches, getSessionDivisions, getSessionDeparments, getSessionPositionLevels } from 'src/api/admin/session';
import { createOrgAccess, updateOrgAccess, deleteOrgAccess } from 'src/api/admin/responsibility';

// ----------------------------------------------------------------------

export type OrgAccessType = zod.infer<typeof OrgAccessSchema>;

export const OrgAccessSchema = zod.object({
  CompanyCode: schemaHelper.nullableInput(zod.string().min(1, { message: 'Company is required' }), { message: 'Company is required'}),
  BranchCode: zod.string().nullable(),
  DivisionCode: zod.string().nullable(),
  DepartmentCode: zod.string().nullable(),
  PositionLevel: zod.number().array().min(1, { message: 'Choose at least one option' })
});

// ----------------------------------------------------------------------

type Props = {
  current?: IOrgAccess;
  moduleId: string;
  respId: string;
  coGrpCode: string;
  open: boolean;
  onClose: () => void;
};

export function ResponsibilityOrgAccessForm({ current, moduleId, respId, coGrpCode, open, onClose }: Readonly<Props>) {
  const { sessionPositionLevels, sessionPositionLevelsValidating } = getSessionPositionLevels();

  const defaultValues: OrgAccessType = {
    CompanyCode: null,
    BranchCode: null,
    DivisionCode: null,
    DepartmentCode: null,
    PositionLevel: sessionPositionLevels?.map(m => m.PositionLevelId) || []
  };

  const methods = useForm<OrgAccessType>({
    mode: 'all',
    resolver: zodResolver(OrgAccessSchema),
    defaultValues,
    values: current ?? defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const post = {
      OrgAccessId: current ? current.OrgAccessId : '',
      CompanyCode: data.CompanyCode === 'ALL' ? null : data.CompanyCode,
      BranchCode: data.BranchCode,
      DivisionCode: data.DivisionCode,
      DepartmentCode: data.DepartmentCode,
      PositionLevel: data.PositionLevel,
      ModuleId: moduleId,
      RespId: respId
    };

    try {
      if (current) {
        await updateOrgAccess(post);
        toast.success('Update success!');
      }
      else {
        await createOrgAccess(post);
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
    if (!current?.OrgAccessId) {
      toast.error('No access is currently selected.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteOrgAccess(current?.OrgAccessId, moduleId, respId);
      toast.success('Delete success!');
      confirmDialog.onFalse();
      onClose();
      setIsDeleting(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      setIsDeleting(false);
    }
  }, [current?.OrgAccessId, confirmDialog.onFalse]);

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

  const values = watch();

  const { sessionCompanies, sessionCompaniesValidating } = getSessionCompanies(coGrpCode);
  const { sessionBranches, sessionBranchesValidating } = getSessionBranches(values.CompanyCode === 'ALL' ? undefined : values.CompanyCode?.toString());
  const { sessionDivisions, sessionDivisionsValidating } = getSessionDivisions(values.CompanyCode?.toString(), values.BranchCode?.toString());
  const { sessionDepartments, sessionDepartmentsValidating } = getSessionDeparments(values.CompanyCode?.toString(), values.BranchCode?.toString(), values.DivisionCode?.toString());

  useEffect(() => {
    if (current?.CompanyCode === null) {
      setValue('CompanyCode', 'ALL');
    }
  }, [current?.CompanyCode, open]);

  useEffect(() => {
    const isEqual = values.CompanyCode === current?.CompanyCode;
    setValue('BranchCode', isEqual ? current?.BranchCode : defaultValues.BranchCode);
  }, [values.CompanyCode]);

  useEffect(() => {
    const isEqual = values.BranchCode === current?.BranchCode;
    setValue('DivisionCode', isEqual ? current?.DivisionCode : defaultValues.DivisionCode);
  }, [values.BranchCode]);

  useEffect(() => {
    const isEqual = values.DivisionCode === current?.DivisionCode;
    setValue('DepartmentCode', isEqual ? current?.DepartmentCode : defaultValues.DepartmentCode);
  }, [values.DivisionCode]);

  useEffect(() => {
    if (current?.PositionLevel === null) {
      setValue('PositionLevel', defaultValues.PositionLevel);
    }
  }, [current?.PositionLevel, open]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      scroll="body"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{current ? 'Update Org Access' : 'Create Org Access'}</DialogTitle>

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
              <Field.Autocomplete
                name="CompanyCode"
                label="Company"
                autoHighlight
                loading={sessionCompaniesValidating}
                options={['ALL', ...sessionCompanies.map((option) => option.CompanyCode)]}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) =>
                  option === 'ALL' ? 'ALL COMPANIES' : sessionCompanies.find(m => m.CompanyCode === option)?.CompanyDesc || ''
                }
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option === 'ALL' ? 'ALL COMPANIES' : sessionCompanies.find(m => m.CompanyCode === option)?.CompanyDesc || ''}
                  </li>
                )}
              />
              <Field.Autocomplete
                name="BranchCode"
                label="Branch"
                autoHighlight
                loading={sessionBranchesValidating}
                options={sessionBranches.map((option) => option.BranchCode)}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) => (sessionBranches.find(m => m.BranchCode === option)?.BranchDesc || '')}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {sessionBranches.find(m => m.BranchCode === option)?.BranchDesc || ''}
                  </li>
                )}
              />
              <Field.Autocomplete
                name="DivisionCode"
                label="Division"
                autoHighlight
                loading={sessionDivisionsValidating}
                options={sessionDivisions.map((option) => option.DivisionCode)}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) => (sessionDivisions.find(m => m.DivisionCode === option)?.DivisionDesc || '')}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {sessionDivisions.find(m => m.DivisionCode === option)?.DivisionDesc || ''}
                  </li>
                )}
              />
              <Field.Autocomplete
                name="DepartmentCode"
                label="Department"
                autoHighlight
                loading={sessionDepartmentsValidating}
                options={sessionDepartments.map((option) => option.DepartmentCode)}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) => (sessionDepartments.find(m => m.DepartmentCode === option)?.DepartmentDesc || '')}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {sessionDepartments.find((m) => m.DepartmentCode === option)?.DepartmentDesc || ''}
                  </li>
                )}
              />
            </Box>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' }
              }}
            >
              {values.PositionLevel != null && (
                <Field.Autocomplete
                  name="PositionLevel"
                  label="Access Level"
                  placeholder="+ Level"
                  multiple
                  disableCloseOnSelect
                  loading={sessionPositionLevelsValidating}
                  options={sessionPositionLevels.map((option) => option.PositionLevelId)}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option) => (sessionPositionLevels.find(m => m.PositionLevelId === option)?.PositionLevelDesc || '')}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {sessionPositionLevels.find(m => m.PositionLevelId === option)?.PositionLevelDesc || ''}
                    </li>
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={sessionPositionLevels.find(m => m.PositionLevelId === option)?.PositionLevelDesc || ''}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    ))
                  }
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
            {current ? 'Save changes' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>

      {renderConfirmDialog()}
    </Dialog>
  );
}
