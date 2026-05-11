import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ListOfValueDto } from "src/types/lov";
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LOValuesTable } from "./components/lov-values-table";
import { CreateUpdateLOV } from "src/api/admin/lov";
import { useState } from "react";
import { LOVAccessTable } from "./components/lov-access-table";
import { ISessionApplication, ISessionModule } from "src/types/session";
import { CustomDialogTitle } from "src/components/custom-dialog-title";
import LoadingButton from "@mui/lab/LoadingButton";

export const ModuleDataSchema = zod.object({
    ModuleId: zod.string().min(1, { message: 'ModuleId is required' }),
    ModuleName: zod.string().min(1, { message: 'ModuleName is required' }),
});
// export const ApplicationDataSchema = zod.object({
//     AppId: zod.string().min(1, { message: 'Application is required!' }),
//     AppName: zod.string().min(1, { message: 'Application is required' }),
//     Modules: zod.array(ModuleDataSchema)
// }).superRefine((data: any, ctx: any) => {
//     if (data.AppId !== 'ALL' && data.Modules.length === 0) {
//         ctx.addIssue({
//             path: ['Modules'],
//             message: 'At least select one module for the selected application',
//             code: zod.ZodIssueCode.custom
//         });
//     }
// });

export const LOValuesSchema = zod.object({
    LOVCode: zod.string().trim().min(1, { message: "LOV Code is required" }),
    LOVDescription: zod.string().trim().min(1, { message: 'Description is required' }),
    Remarks: zod.string().trim().nullable().optional(),
    ReturnValue: zod.string().trim().nullable().optional(),
    DisplaySequence: zod.coerce.number()
        .int({ message: "Display sequence must be a whole number" })
        .min(1, { message: "Display sequence is required" }),

    Modules: zod.array(ModuleDataSchema).default([])
});

export const LovSchema = zod.object({
    LOVID: zod.string().optional().nullable(),
    LOVGroup: zod.string().trim().min(1, { message: "Group is required" }),
    Values: zod.array(LOValuesSchema).min(1, { message: "At least one value is required" }),
    IsActive: zod.boolean(),
    // Access: zod.array(ApplicationDataSchema).min(1, { message: "At least select one module for the selected application" })
});

export type LovSchemaType = zod.infer<typeof LovSchema>

export type Props = {
    open: boolean;
    onClose: () => void;
    current?: ListOfValueDto;
    mutateLOV: () => void;


    // sessionApps: ISessionApplication[];
    // sessionAppsLoading: boolean;

    sessionModules: ISessionModule[];
    sessionModulesLoading: boolean;
}

export function LOVTableForm({ open, onClose, current, mutateLOV,
    // sessionApps, sessionAppsLoading,
    sessionModules, sessionModulesLoading }: Readonly<Props>) {
    const defaultValues: LovSchemaType = {
        LOVGroup: current?.LOVGroup ?? '',
        IsActive: true,
        Values: current?.Values || [{ LOVCode: '', LOVDescription: '', DisplaySequence: 1, Remarks: null, ReturnValue: null, Modules: [] }],
        // Access: current?.Access && current?.Access.length > 0
        //     ? current.Access
        //     : [{ AppId: 'ALL', AppName: 'ALL', Modules: [] }],
    };

    const methods = useForm<LovSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(LovSchema),
        defaultValues
    });


    const {
        reset,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = methods;

    const { fields: ValuesField, append: ValuesAppend, remove: ValuesRemove } = useFieldArray({
        control,
        name: "Values"
    });

    // const { fields: AccessField, append: AccessAppend, remove: AccessRemove } = useFieldArray({
    //     control,
    //     name: "Access"
    // })

    const onSubmit = handleSubmit(async (data) => {
        const post: ListOfValueDto = {
            LOVID: current?.LOVID,
            IsActive: data.IsActive,
            LOVGroup: data.LOVGroup,
            Values: data.Values
            // Access: data.Access.some((x) => x.AppId === 'ALL') ? [] : data.Access
        };
        try {
            await CreateUpdateLOV(post);
            if (current) {
                toast.success('Update success!');
            }
            else {
                toast.success('Create success!');
            }
            mutateLOV();
            reset();
            onClose();
        } catch (error: any) {
            const message =
                error?.response?.data ??
                error?.message ??
                'An unknown error occurred.';
            toast.error(message);
        }
    });

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" scroll="body">
        <CustomDialogTitle
            title={(current ? "Edit" : "Add") + " List of Value"}
            onClose={onClose}
        />

        <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent>
                <Card sx={{ p: 2, mb: 2, mt: 1, gap: 2, boxShadow: 4 }}>
                    <Stack spacing={2}>
                        <Box sx={{ rowGap: 3, columnGap: 2, display: "grid", gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" } }}>
                            <Field.Text name="LOVGroup" label="Group" variant="outlined" />
                            <Field.Switch name="IsActive" label="Active" />
                        </Box>

                        <Card sx={{ p: 2, boxShadow: 4 }}>
                            <LOValuesTable
                                control={methods.control}
                                fields={ValuesField}
                                append={ValuesAppend}
                                remove={ValuesRemove}
                                sessionModules={sessionModules}
                            />
                        </Card>
                    </Stack>
                </Card>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Close
                </Button>
                <LoadingButton variant="contained" color="primary" type="submit" loading={isSubmitting}>
                    Submit
                </LoadingButton>
            </DialogActions>
        </Form>
    </Dialog>
}