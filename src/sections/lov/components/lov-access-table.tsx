import { Autocomplete, Box, Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getSessionApplications, getSessionModules } from "src/api/admin/session";
import { Iconify } from "src/components/iconify";
import { ISessionApplication, ISessionModule } from "src/types/session";

interface LOVAccessTableProps {
    control: any;
    fields: any[];
    append: (data: any) => void;
    remove: (index: number) => void;
    sessionApps: ISessionApplication[];
    sessionAppsLoading: boolean;

    sessionModules: ISessionModule[];
    sessionModulesLoading: boolean;

}

export function LOVAccessTable({ control, fields, append, remove,
    sessionApps, sessionAppsLoading,
    sessionModules, sessionModulesLoading }: Readonly<LOVAccessTableProps>) {
    const { setValue, watch } = useFormContext();

    return (
        <Box sx={{ boxShadow: 4, mb: 3 }}>
            <Table sx={{ width: "100%" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "20%" }}>Application</TableCell>
                        <TableCell sx={{ width: "70%" }}>Module</TableCell>
                        <TableCell sx={{ width: "10%" }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((item, index) => {

                        const options = index === 0
                            ? [{ AppName: "ALL", AppId: 'ALL' }, ...sessionApps]
                            : sessionApps;

                        const selectedApplicationId = watch(`Access[${index}].AppId`);

                        const isAll = selectedApplicationId === 'ALL';

                        const modulesForApplication = sessionModules.filter((x) => x.AppId === selectedApplicationId);

                        const disableAddButton = fields.some((fieldItem, idx) => selectedApplicationId === 'ALL');

                        return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Controller
                                        name={`Access[${index}].AppId`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Autocomplete
                                                {...field}
                                                loading={sessionAppsLoading}
                                                options={options}
                                                getOptionLabel={(option) => option.AppName ?? 'Unknown'}
                                                value={options.find((option) => option.AppId === field.value) || null}
                                                onChange={(_, value) => {
                                                    field.onChange(value?.AppId);
                                                    setValue(`Access[${index}].AppName`, value?.AppName || 'Unknown');

                                                    if (value?.AppId === 'ALL') {
                                                        fields.forEach((_, idx) => {
                                                            if (idx !== index) {
                                                                remove(idx);
                                                            }
                                                        })
                                                    }

                                                    const allModulesForApp = sessionModules.filter((x) => x.AppId === value?.AppId);

                                                    const modulesForSelectedApp = value?.AppId === 'ALL' ? [] : allModulesForApp;
                                                    setValue(`Access[${index}].Modules`, modulesForSelectedApp);

                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        error={!!fieldState?.error}
                                                        helperText={fieldState?.error?.message}
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Controller
                                        name={`Access[${index}].Modules`}
                                        control={control}
                                        render={({ field, fieldState }) => {
                                            const availableModules = modulesForApplication.filter(
                                                (module) => !field.value?.some((v: any) => v.ModuleId === module.ModuleId)
                                            );

                                            return (
                                                <Autocomplete
                                                    {...field}
                                                    multiple
                                                    loading={sessionModulesLoading}
                                                    options={availableModules}
                                                    getOptionLabel={(option) => option.ModuleName}
                                                    value={field.value || []}
                                                    color="info"
                                                    onChange={(_, newValue) => {
                                                        field.onChange(newValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={!!fieldState?.error}
                                                            helperText={fieldState?.error?.message}
                                                            size="small"
                                                        />
                                                    )}
                                                    renderTags={(selected, getTagProps) =>
                                                        selected.map((option, index) => (
                                                            <Chip
                                                                {...getTagProps({ index })}
                                                                key={option.ModuleId}
                                                                label={option.ModuleName}
                                                                size="small"
                                                                color="info"
                                                                variant="soft"
                                                            />
                                                        ))
                                                    }
                                                    disabled={isAll}
                                                />
                                            );
                                        }}
                                    />
                                </TableCell>

                                <TableCell sx={{ justifyItems: "center" }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {fields.length > 1 && (
                                            <Tooltip title="Remove" placement="top">
                                                <IconButton onClick={() => remove(index)}>
                                                    <Iconify icon="pajamas:remove" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        <Tooltip title="Add" placement="top">
                                            <IconButton onClick={() => append({
                                                LOVCode: "",
                                                LOVDescription: "",
                                                Remarks: "",
                                                ReturnValue: "",
                                                DisplaySequence: fields.length + 1,
                                            })}
                                                disabled={disableAddButton}
                                            >
                                                <Iconify icon="ic:baseline-add" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )
                    })}


                </TableBody>
            </Table>
        </Box>
    )
}