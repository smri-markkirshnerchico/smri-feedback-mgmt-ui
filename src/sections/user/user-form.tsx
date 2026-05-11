import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GetOrgHierarchies } from "src/api/admin/organizational-hierarchy";
import { GetPositions } from "src/api/admin/position";
import { GetPositionLevel } from "src/api/admin/position-level";
import { getSessionResponsibilities } from "src/api/admin/session";
import { CreateUser, FindUser, UpdateUser } from "src/api/admin/user";
import { CustomDialogTitle } from "src/components/custom-dialog-title";
import { Field, Form, schemaHelper } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { IOrganizationalHierarchy } from "src/types/organization-hierarchy";
import { IUserDto } from "src/types/user";
import { z as zod } from "zod"

export type Props = {
    open: boolean;
    onClose: () => void;
    current?: IUserDto;
    mutateUser: () => void;
}


export type UserSchemaType = zod.infer<typeof UserSchema>;

export const UserSchema = zod.object({
    User: zod.object({
        UserId: zod.string().nullable().optional(),
        EmployeeNumber: zod.string().min(1, { message: 'Employee Number is required' }),
        SSSNumber: zod.string().min(1, { message: 'SSS Number is required' }),
        FirstName: zod.string().min(1, { message: 'First Name is required' }),
        MiddleName: zod.string().nullable(),
        LastName: zod.string().min(1, { message: 'Last Name is required' }),
        EmailAddress: zod.string().nullable(),
        CompanyCode: schemaHelper.nullableInput(zod.string().min(1, { message: 'Company is required' }), { message: 'Company is required' }),
        BranchCode: schemaHelper.nullableInput(zod.string().min(1, { message: 'Branch is required' }), { message: 'Branch is required' }),
        DivisionCode: schemaHelper.nullableInput(zod.string().min(1, { message: 'Division is required' }), { message: 'Division is required' }),
        DepartmentCode: schemaHelper.nullableInput(zod.string().min(1, { message: 'Department is required' }), { message: 'Department is required' }),
        PositionCode: schemaHelper.nullableInput(zod.string().min(1, { message: 'Position is required' }), { message: 'Position is required' }),
        PositionLevelID: schemaHelper.nullableInput(zod.number().min(1, { message: 'Position Level is required' }), { message: 'Position Level is required' }),
        IsActive: zod.boolean(),
        IsResigned: zod.boolean(),
    }),
    UserAlloc: zod.string().array().nullable().optional()
});

// ----------------------------------------------------------------------

export function UserForm({ open, onClose, current, mutateUser }: Readonly<Props>) {
    const defaultValues: UserSchemaType = {
        User: {
            UserId: current?.UserId,
            EmployeeNumber: current?.EmpId ?? '',
            SSSNumber: current?.SssNo ?? '',
            FirstName: current?.FirstName ?? '',
            MiddleName: current?.MiddleName ?? '',
            LastName: current?.LastName ?? '',
            EmailAddress: current?.EmailAddress ?? '',
            CompanyCode: current?.CompanyCode ?? '',
            BranchCode: current?.BranchCode ?? '',
            DivisionCode: current?.DivisionCode ?? '',
            DepartmentCode: current?.DepartmentCode ?? '',
            PositionCode: current?.PositionCode ?? '',
            PositionLevelID: current?.PositionLevelId ?? 0,
            IsActive: current?.IsActive ?? true,
            IsResigned: false,
        },
        UserAlloc: current?.Responsibility ?? []
    };

    const { sessionResps, sessionRespsLoading, sessionRespsValidating } = getSessionResponsibilities();

    const methods = useForm<UserSchemaType>({
        mode: 'all',
        resolver: zodResolver(UserSchema),
        defaultValues,
    });


    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();


    const isDisabled = true;

    const empNo = values.User.EmployeeNumber?.trim() || '';
    const debouncedEmpNo = useDebounce(empNo);

    const { user, userValidating } = FindUser(debouncedEmpNo);

    console.log(user);
    useEffect(() => {
        if (!current || user) {
            setValue('User.SSSNumber', user?.SssNo ?? defaultValues.User.SSSNumber);
            setValue('User.FirstName', user?.FirstName ?? defaultValues.User.FirstName);
            setValue('User.LastName', user?.LastName ?? defaultValues.User.LastName);
            setValue('User.MiddleName', user?.MiddleName ?? defaultValues.User.MiddleName);
            setValue('User.EmailAddress', user?.EmailAddress ?? defaultValues.User.EmailAddress);
            setValue('User.CompanyCode', user?.CompanyCode ?? defaultValues.User.CompanyCode);
            setValue('User.BranchCode', user?.BranchCode ?? defaultValues.User.BranchCode);
            setValue('User.DivisionCode', user?.DivisionCode ?? defaultValues.User.DivisionCode);
            setValue('User.DepartmentCode', user?.DepartmentCode ?? defaultValues.User.DepartmentCode);
            setValue(
                'User.PositionCode',
                user?.PositionCode ?? defaultValues.User.PositionCode ?? null
            );
            setValue('User.PositionLevelID', user?.PositionLevelId ? Number(user.PositionLevelId) : defaultValues.User.PositionLevelID);
            setValue('User.IsResigned', user?.IsResigned ?? false);
            setValue('UserAlloc', defaultValues.UserAlloc ?? []);
            // setValue('User.IsActive', user?.IsActive ?? true)
        }
    }, [user, current]);

    const { orgHierarchies, orgHierarchiesLoading } = GetOrgHierarchies();
    const { positions, positionsLoading } = GetPositions();
    const { positionLevels, positionLevelsLoading } = GetPositionLevel();

    const onSubmit = handleSubmit(async (data) => {

        const company = orgHierarchies.find(
            (m) => m.CompanyCode === data.User.CompanyCode
        );

        const branch = company?.Branches.find(
            (b) => b.BranchCode === data.User.BranchCode
        );

        const division = branch?.Divisions.find(
            (d) => d.DivisionCode === data.User.DivisionCode
        );

        const department = division?.Departments.find(
            (d) => d.DepartmentCode == data.User.DepartmentCode
        );

        const position = positions.find(
            (p) => p.PositionCode == data.User.PositionCode
        );

        const post: IUserDto = {
            UserId: current?.UserId,
            EmpId: data.User.EmployeeNumber,
            SssNo: data.User.SSSNumber,
            FirstName: data.User.FirstName,
            MiddleName: data.User.MiddleName ?? '',
            LastName: data.User.LastName,
            EmailAddress: data.User.EmailAddress ?? '',
            CompanyCode: data.User.CompanyCode ?? '',
            CompanyDesc: company?.CompanyDesc,
            BranchCode: data.User.BranchCode ?? '',
            BranchDesc: branch?.BranchDesc,
            DivisionCode: data.User.DivisionCode ?? '',
            DivisionDesc: division?.DivisionDesc,
            DepartmentCode: data.User.DepartmentCode ?? '',
            DepartmentDesc: department?.DepartmentDesc,
            PositionLevelId: data.User.PositionLevelID ?? 0,
            PositionCode: data.User.PositionCode ?? '',
            PositionDesc: position?.PositionLongDesc,
            IsResigned: data.User.IsResigned,
            IsActive: data.User.IsActive,
            Responsibility: data.UserAlloc ?? []
        };


        try {
            if (current) {
                await UpdateUser(post);
                toast.success('Update success!');
            }
            else {
                await CreateUser(post);
                toast.success('Create success!');
            }
            mutateUser();
            reset();
            onClose();
        } catch (error: any) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'An unknown error occurred';

            toast.error(message);
        }
    });

    const selectedCompanyCode = watch('User.CompanyCode');
    const selectedBranchCode = watch('User.BranchCode');
    const selectedDivisionCode = watch('User.DivisionCode');

    const branchOptions = orgHierarchies.find((b) => b.CompanyCode == selectedCompanyCode)?.Branches || [];
    const divisionOptions = branchOptions.find((d) => d.BranchCode == selectedBranchCode)?.Divisions || [];
    const departmentOptions = divisionOptions.find((d) => d.DivisionCode == selectedDivisionCode)?.Departments || [];


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="body">

            <CustomDialogTitle
                title={!current ? 'Create User' : 'Update User'}
                onClose={onClose}
            />

            <Form methods={methods} onSubmit={onSubmit}>
                <DialogContent sx={{ py: 1 }}>
                    <Stack spacing={3}>
                        {!current && (
                            <>
                                <Alert variant="outlined" severity="info">
                                    Enter an employee number to populate the corresponding details.
                                </Alert>

                                {userValidating && (
                                    <Alert variant="outlined" severity="info">
                                        Loading employee details, please wait...
                                    </Alert>
                                )}

                                {user && !userValidating && (
                                    <Alert variant="outlined" severity="success">
                                        Employee details loaded successfully!
                                    </Alert>
                                )}

                                {!user && !userValidating && (
                                    <Alert variant="outlined" severity="warning">
                                        No employee details found.
                                    </Alert>
                                )}
                            </>
                        )}

                        <Box
                            sx={{
                                rowGap: 3,
                                columnGap: 2,
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }
                            }}
                        >
                            <Field.Text name="User.EmployeeNumber" label="Employee Number" disabled={!!current} />
                            <Field.Text name="User.SSSNumber" label="SSS Number" disabled={isDisabled} />
                            <Field.Text name="User.FirstName" label="First Name" disabled={isDisabled} />
                            <Field.Text name="User.LastName" label="Last Name" disabled={isDisabled} />
                            <Field.Text name="User.MiddleName" label="Middle Name" disabled={isDisabled} />
                            <Field.Text name="User.EmailAddress" label="Email Address" disabled={isDisabled} />
                        </Box>
                        <Box
                            sx={{
                                rowGap: 3,
                                columnGap: 2,
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }
                            }}
                        >
                            <Field.Autocomplete
                                name="User.CompanyCode"
                                label="Company"
                                autoHighlight
                                loading={orgHierarchiesLoading}
                                options={orgHierarchies.map((option: IOrganizationalHierarchy) => option.CompanyCode)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => (orgHierarchies.filter((m) => m.CompanyCode === option)[0]?.CompanyDesc || '')}
                                renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                        {orgHierarchies.filter((m) => m.CompanyCode === option)[0]?.CompanyDesc || ''}
                                    </li>
                                )}
                                disabled={isDisabled}
                            />
                            <Field.Autocomplete
                                name="User.BranchCode"
                                label="Branch"
                                autoHighlight
                                loading={orgHierarchiesLoading}
                                options={branchOptions.map((option) => option.BranchCode)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => (branchOptions.filter((m) => m.BranchCode === option)[0]?.BranchDesc || '')}
                                renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                        {branchOptions.filter((m) => m.BranchCode === option)[0]?.BranchDesc || ''}
                                    </li>
                                )}
                                disabled={isDisabled}
                            />
                            <Field.Autocomplete
                                name="User.DivisionCode"
                                label="Division"
                                autoHighlight
                                loading={orgHierarchiesLoading}
                                options={divisionOptions.map((option) => option.DivisionCode)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => (divisionOptions.filter((m) => m.DivisionCode === option)[0]?.DivisionDesc || '')}
                                renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                        {divisionOptions.filter((m) => m.DivisionCode === option)[0]?.DivisionDesc || ''}
                                    </li>
                                )}
                                disabled={isDisabled}
                            />
                            <Field.Autocomplete
                                name="User.DepartmentCode"
                                label="Department"
                                autoHighlight
                                loading={orgHierarchiesLoading}
                                options={departmentOptions.map((option) => option.DepartmentCode)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => (departmentOptions.filter((m) => m.DepartmentCode === option)[0]?.DepartmentDesc || '')}
                                renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                        {departmentOptions.filter((m) => m.DepartmentCode === option)[0]?.DepartmentDesc || ''}
                                    </li>
                                )}
                                disabled={isDisabled}
                            />
                            <Field.Autocomplete
                                name="User.PositionCode"
                                label="Position"
                                autoHighlight
                                loading={positionsLoading}
                                options={positions.map((option) => option.PositionCode)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => (positions.filter((m) => m.PositionCode === option)[0]?.PositionLongDesc || '')}
                                renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                        {positions.filter((m) => m.PositionCode === option)[0]?.PositionLongDesc || ''}
                                    </li>
                                )}
                                disabled={isDisabled}
                            />
                            <Field.Autocomplete
                                name="User.PositionLevelID"
                                label="Position Level"
                                autoHighlight
                                loading={positionLevelsLoading}
                                options={positionLevels.map((option) => option.PositionLevelId)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => (positionLevels.filter((m) => m.PositionLevelId === option)[0]?.Description || '')}
                                renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                        {positionLevels.filter((m) => m.PositionLevelId === option)[0]?.Description || ''}
                                    </li>
                                )}
                                disabled={isDisabled}
                            />
                            <Field.Switch name="User.IsActive" label="Active" />
                            <Field.Switch name="User.IsResigned" label="Resigned" disabled={isDisabled} />
                        </Box>
                        <Box
                            sx={{
                                rowGap: 3,
                                columnGap: 2,
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)' }
                            }}
                        >
                            <Field.Autocomplete
                                name="UserAlloc"
                                label="User Responsibilities"
                                placeholder="+ Responsibility"
                                multiple
                                disableCloseOnSelect
                                loading={sessionRespsValidating}
                                options={sessionResps.map((option) => option.RespId)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => (sessionResps.filter((m) => m.RespId === option)[0]?.RespName || '')}
                                renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                        {sessionResps.filter((m) => m.RespId === option)[0]?.RespName || ''}
                                    </li>
                                )}
                                renderTags={(selected, getTagProps) =>
                                    selected.map((option, index) => (
                                        <Chip
                                            {...getTagProps({ index })}
                                            key={option}
                                            label={sessionResps.filter((m) => m.RespId === option)[0]?.RespName || ''}
                                            size="small"
                                            color="info"
                                            variant="soft"
                                        />
                                    ))
                                }
                            />
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>

                    <LoadingButton type="submit" color="primary" variant="contained" loading={isSubmitting}>
                        {!current ? 'Create' : 'Save changes'}
                    </LoadingButton>
                </DialogActions>
            </Form>

        </Dialog>
    )
}