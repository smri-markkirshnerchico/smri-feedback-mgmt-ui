import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, FormControlLabel, IconButton, Switch, TextField, Tooltip } from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateUpdateHoliday, DeleteHoliday } from "src/api/admin/holiday";
import { CustomDialogTitle } from "src/components/custom-dialog-title";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { IGeoHierarchyToTown } from "src/types/geographical-hierarchy";
import { IHoliday, calendarMonths } from "src/types/holiday";
import { z as zod } from "zod"

export type Props = {
    open: boolean;
    onClose: () => void;
    currentHoliday?: IHoliday;
    mutateData: () => void;
    towns: IGeoHierarchyToTown[];
}

const holidayType = [
    "Regular",
    "Special - Non-Working",
    "Special - Working",
];

export const Schema = zod
    .object({
        HolidayName: zod.string().min(1, { message: "Holiday Name is required!" }),
        HolidayDescription: zod.string().nullable().optional(),
        HolidayType: zod.string().min(1, { message: "Holiday Type is required!" }),
        IsFixed: zod.boolean(),
        IsNational: zod.boolean(),
        IsRecurring: zod.boolean(),
        Month: zod.number().nullable().optional(),
        Day: zod.number().nullable().optional(),
        Towns: zod.string().array(),
        HolidayDates: zod
            .array(zod.string())
            .optional()

    }).superRefine((data, ctx) => {
        if (!data.IsFixed) {
            if (!data.HolidayDates || data.HolidayDates.length === 0) {
                ctx.addIssue({
                    path: ["HolidayDates"],
                    code: zod.ZodIssueCode.custom,
                    message: "Holiday Date is required for non-fixed holidays",
                });
            }
        }

        if (data.IsFixed) {
            if (!data.Month) {
                ctx.addIssue({
                    path: ["Month"],
                    code: zod.ZodIssueCode.custom,
                    message: "Month is required for fixed holidays",
                });
            }

            if (!data.Day) {
                ctx.addIssue({
                    path: ["Day"],
                    code: zod.ZodIssueCode.custom,
                    message: "Day is required for fixed holidays",
                });
            }
        }
    });;

export type SchemaType = zod.infer<typeof Schema>;

export function HolidaySetupForm({ open, onClose, currentHoliday, mutateData, towns }: Readonly<Props>) {

    const yearToday = new Date().getFullYear();
    const schema = Schema;
    const methods = useForm<SchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            HolidayName: currentHoliday?.HolidayName ?? '',
            HolidayDescription: currentHoliday?.HolidayDescription ?? '',
            HolidayType: currentHoliday?.HolidayType ?? 'Regular',
            IsFixed: currentHoliday?.IsFixed ?? true,
            IsNational: currentHoliday?.IsNational ?? true,
            IsRecurring: currentHoliday?.IsRecurring ?? true,
            Month: currentHoliday?.Month ?? 1,
            Day: currentHoliday?.Day ?? 1,
            Towns: currentHoliday?.Towns?.map(t => t.TownCode) ?? [],
            // HolidayDates: currentHoliday?.HolidayDates
            //     ?.find(d => new Date(d).getFullYear() === yearToday) ?? null

            // HolidayDates: currentHoliday?.HolidayDates.filter(x => new Date(x).getFullYear() == yearToday) ?? []

            HolidayDates:
                currentHoliday?.HolidayDates
                    ?.filter(x => new Date(x).getFullYear() === yearToday) ?? []
        },
    });


    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitting }
    } = methods;
    const values = watch();

    function getDaysInMonth(month: number | null): number[] {
        if (!month) return [];

        const year = new Date().getFullYear();
        const days = new Date(year, month, 0).getDate();

        return Array.from({ length: days }, (_, i) => i + 1);
    }

    const calendarDays = getDaysInMonth(values.Month ?? 0);

    const onSubmit = handleSubmit(async (data) => {
        const post: IHoliday = {
            HolidayId: currentHoliday?.HolidayId,
            HolidayName: data.HolidayName,
            HolidayDescription: data.HolidayDescription ?? "",
            HolidayType: data.HolidayType,
            IsFixed: data.IsFixed,
            IsNational: data.IsNational,
            IsRecurring: data.IsRecurring,
            Month: data.Month ?? undefined,
            Day: data.Day ?? undefined,
            HolidayDates: data.HolidayDates ?? [],
            Towns: data.Towns?.map((code: string) => ({
                TownCode: code,
                TownName: towns.find(t => t.TownCode === code)?.TownName ?? code
            }))
        };
        try {
            await CreateUpdateHoliday(post);
            if (currentHoliday) {
                toast.success('Holiday successfully updated!');
            }
            else {
                toast.success('Holiday successfully created!');
            }
            mutateData();
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

    const handleDelete = async () => {
        try {
            await DeleteHoliday(currentHoliday?.HolidayId ?? '');
            toast.success("Holiday successfully deleted");
            mutateData();
            reset();
            onClose();
        } catch (error: any) {
            const message =
                error?.response?.data ??
                error?.message ??
                'An unknown error occurred.';
            toast.error(message);
        }

    }

    // useEffect(() => {
    //     if (values.IsFixed) {
    //         setValue('IsRecurring', true);
    //     }
    // }, [values.IsFixed]);

    const townMap = useMemo(() => {
        const map: Record<string, { TownName: string; ProvinceName: string }> = {};
        towns.forEach(t => {
            map[t.TownCode] = { TownName: t.TownName, ProvinceName: t.ProvinceName };
        });
        return map;
    }, [towns]);

    return <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
        <Form methods={methods} onSubmit={onSubmit}>
            <CustomDialogTitle
                title={currentHoliday ? "Update Holiday" : "Create Holiday"}
                onClose={onClose}
            />
            <DialogContent>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2
                }}>
                    <Box sx={{ gridColumn: "span 2" }}>
                        <Field.Text
                            name="HolidayName"
                            label="Holiday Name"
                        />
                    </Box>

                    <Box sx={{ gridColumn: "span 2" }}>
                        <Field.Text
                            name="HolidayDescription"
                            label="Description"
                            multiline
                            rows={3}
                        />
                    </Box>

                    <Box sx={{ gridColumn: "span 2" }}>
                        <Field.Autocomplete
                            name="HolidayType"
                            label="Holiday Type"
                            autoHighlight
                            options={holidayType}
                            getOptionLabel={(option) => option}
                            disableClearable
                        />
                    </Box>

                    <Box sx={{ gridColumn: "span 2" }}>
                        <Controller
                            name="IsFixed"
                            control={methods.control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...field}
                                            checked={field.value || false}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    }
                                    label="Fixed"
                                />
                            )}
                        />


                        <Controller
                            name="IsNational"
                            control={methods.control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...field}
                                            checked={field.value || false}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    }
                                    label="National"
                                />
                            )}
                        />


                        <Controller
                            name="IsRecurring"
                            control={methods.control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...field}
                                            checked={field.value || false}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    }
                                    label="Recurring"
                                />
                            )}
                        />

                    </Box>

                    {values.IsFixed ? (
                        <>
                            <Box sx={{ gridColumn: "span 1" }}>
                                <Field.Autocomplete
                                    name="Month"
                                    label="Month"
                                    autoHighlight
                                    options={calendarMonths}
                                    getOptionLabel={(option) => option.label}
                                    isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                    disableClearable
                                    onChange={(_, selected) => {
                                        methods.setValue("Month", selected?.value ?? null);
                                        methods.setValue("Day", null);
                                    }}
                                    value={
                                        calendarMonths.find(m => m.value === values.Month) ?? null
                                    }
                                />
                            </Box>
                            <Box>

                                <Field.Autocomplete
                                    name="Day"
                                    label="Day"
                                    autoHighlight
                                    options={calendarDays}
                                    getOptionLabel={(day) => day.toString()}
                                    isOptionEqualToValue={(opt, val) => opt === val}
                                    disableClearable
                                    onChange={(_, selected) => {
                                        methods.setValue("Day", selected ?? null);
                                    }}
                                    value={values.Day ?? null}
                                    disabled={calendarDays.length === 0}
                                />
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ gridColumn: "span 2" }}>
                            <Controller
                                control={methods.control}
                                name="HolidayDates"
                                render={({ field, fieldState }) => {
                                    const yearToday = new Date().getFullYear();

                                    return (
                                        <DatePicker
                                            multiple={false} // single date selection
                                            calendarPosition="top"
                                            value={field.value?.[0] ? new Date(field.value[0]) : null} // pick the first element if array exists
                                            onChange={(date: DateObject) => {
                                                if (!date) {
                                                    field.onChange([]); // empty array if cleared
                                                    return;
                                                }

                                                const d = date.toDate();
                                                if (d.getFullYear() !== yearToday) return;

                                                d.setHours(10, 0, 0, 0);
                                                field.onChange([d.toISOString().split("T")[0]]); // always wrap in array
                                            }}
                                            minDate={new Date(yearToday, 0, 1)}
                                            maxDate={new Date(yearToday, 11, 31)}
                                            render={(value, openCalendar) => (
                                                <TextField
                                                    label="Select Holiday Date"
                                                    value={field.value?.[0] || ""} // show first date in array
                                                    onClick={openCalendar}
                                                    sx={{ minWidth: 550 }}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    );
                                }}
                            />


                        </Box>
                    )}

                    {!values.IsNational && (
                        <Box sx={{ gridColumn: "span 2" }}>
                            <Field.Autocomplete
                                name="Towns"
                                label="Local Towns"
                                multiple
                                disableCloseOnSelect
                                options={towns.map(option => option.TownCode)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => {
                                    const town = townMap[option];
                                    return town ? `${town.TownName} - ${town.ProvinceName}` : '';
                                }}
                                renderOption={(props, option) => {
                                    const town = townMap[option];
                                    return (
                                        <li {...props} key={option}>
                                            {town ? `${town.TownName} - ${town.ProvinceName}` : ''}
                                        </li>
                                    );
                                }}
                                renderTags={(selected, getTagProps) =>
                                    selected.map((option, index) => {
                                        const town = townMap[option];
                                        return (
                                            <Chip
                                                {...getTagProps({ index })}
                                                key={option}
                                                label={town ? `${town.TownName} - ${town.ProvinceName}` : ''}
                                                size="small"
                                                color="info"
                                                variant="soft"
                                            />
                                        );
                                    })
                                }
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
            }}>
                <Box>

                    {currentHoliday != undefined && (
                        <Tooltip title="Delete" placement="right">
                            <IconButton onClick={handleDelete}>
                                <Iconify icon="tabler:trash" sx={{ color: "error.main" }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <Box sx={{
                    display: "flex",
                    gap: 2
                }}>
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                    <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                        Submit
                    </LoadingButton>
                </Box>
            </DialogActions>
        </Form>
    </Dialog>
}