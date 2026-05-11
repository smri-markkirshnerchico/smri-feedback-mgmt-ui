import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useBoolean } from "minimal-shared/hooks";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateUpdateSMEvent, DeleteCalendarEvent } from "src/api/admin/sm-events";
import { ConfirmDialog } from "src/components/custom-dialog";
import { CustomDialogTitle } from "src/components/custom-dialog-title";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { ICalendarEvent, SMCreateUpdateEvent } from "src/types/calendar";
import { LOValuesDto } from "src/types/lov";
import { IStoreLocation } from "src/types/store-location";
import { z as zod } from "zod";

export type Props = {
    open: boolean;
    onClose: () => void;
    currentStoreLocation: IStoreLocation;
    currentEvent?: ICalendarEvent;
    mutateEvents: () => void;
    // lovGroups: Record<string, string>;
    mode: string;
    lovValues: LOValuesDto[];
}
export const EventSchema = zod
    .object({
        Event: zod.object({
            value: zod.string(),
            label: zod.string(),
        }).nullable(),
        LOVEventCode: zod.string(),
        EventName: zod.string(),
        StartDate: zod.string(),
        EndDate: zod.string(),
    })
    .superRefine((data, ctx) => {
        if (!data.Event) {
            ctx.addIssue({
                path: ["Event"],
                message: "Event is required",
                code: zod.ZodIssueCode.custom,
            });
        }

        const start = new Date(data.StartDate);
        const end = new Date(data.EndDate);

        if (isNaN(start.getTime())) {
            ctx.addIssue({
                path: ["StartDate"],
                message: "Start Date is invalid",
                code: zod.ZodIssueCode.custom,
            });
        }

        if (isNaN(end.getTime())) {
            ctx.addIssue({
                path: ["EndDate"],
                message: "End Date is invalid",
                code: zod.ZodIssueCode.custom,
            });
        }

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            if (end.getTime() < start.getTime()) {
                ctx.addIssue({
                    path: ["EndDate"],
                    message: "End Date must be greater or equal than Start Date",
                    code: zod.ZodIssueCode.custom,
                });
            }
        }
    });
export type EventSchemaType = zod.infer<typeof EventSchema>

export function StoreLocationEventDialog({ open, onClose, currentStoreLocation, currentEvent,
    mutateEvents, lovValues, mode }: Readonly<Props>) {

    const lovMap = useMemo(() => {
        return lovValues.reduce<Record<string, LOValuesDto>>((acc, cur) => {
            acc[cur.LOVCode] = cur;
            return acc;
        }, {});
    }, [lovValues]);

    const dateToday = new Date();
    const defaultValues: EventSchemaType = {
        Event: currentEvent?.extendedProps?.lovEventCode && lovMap[currentEvent.extendedProps.lovEventCode]
            ? {
                value: currentEvent.extendedProps.lovEventCode,
                label: lovMap[currentEvent.extendedProps.lovEventCode].LOVDescription
            }
            : null,
        LOVEventCode: currentEvent?.extendedProps?.lovEventCode ?? "",
        EventName: currentEvent?.extendedProps?.eventName ?? "",
        StartDate: currentEvent?.start ? new Date(currentEvent.start).toISOString() : dateToday.toISOString(),
        EndDate: currentEvent?.end
            ? new Date(currentEvent.end).toISOString()
            : currentEvent?.start
                ? new Date(currentEvent.start).toISOString()
                : dateToday.toISOString(),
    };


    const methods = useForm<EventSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(EventSchema),
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { isSubmitting }
    } = methods;

    const values = watch();


    const onSubmit = handleSubmit(async (data) => {
        const post: SMCreateUpdateEvent = {
            StLocId: currentStoreLocation.StLocId ?? 0,
            EventId: currentEvent?.id,
            Start: data.StartDate,
            End: data.EndDate,
            EventName: data.EventName,
            LOVEventCode: data.LOVEventCode,
            StoreLocation: `${currentStoreLocation.CompanyDesc} - ${currentStoreLocation.BranchDesc}`
        };

        try {
            await CreateUpdateSMEvent(post);
            if (mode == 'create') {
                toast.success('Successfully created event!');
            } else {

                toast.success('Successfully updated event!');
            }
            mutateEvents();
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

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await DeleteCalendarEvent(currentEvent?.id ?? "", currentStoreLocation.StLocId)
            toast.success('Successfully deleted event!');
            mutateEvents();
            reset();
            onClose();

        } catch (error: any) {
            const message =
                error?.response?.data ??
                error?.message ??
                'An unknown error occurred.';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    }
    const confirmDialog = useBoolean();

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Delete"
            content={`Are you sure you want to delete this event?`}
            action={
                <LoadingButton variant="contained" color="error" loading={isDeleting} onClick={handleDelete}>
                    Delete
                </LoadingButton>
            }
        />
    );

    const eventReturnValue =
        currentEvent?.extendedProps?.lovEventCode
            ? lovMap[currentEvent.extendedProps.lovEventCode]?.ReturnValue
            : undefined;

    const enableEndDate = useBoolean(eventReturnValue != undefined && Number(eventReturnValue) > 0);

    useEffect(() => {

        const returnValueRaw = lovMap[values.LOVEventCode]?.ReturnValue ?? 0;
        if (Number(returnValueRaw)) {

            const startDate = dayjs(values.StartDate);
            let newEndDate = startDate.toISOString();
            if (Number(returnValueRaw) > 0) {
                newEndDate = startDate.add(Number(returnValueRaw) - 1, "day").toISOString();
            }

            setValue("EndDate", newEndDate, { shouldValidate: true });

        }

    }, [values.StartDate, values.LOVEventCode])

    return <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
        {confirmDialog.value && renderConfirmDialog()}
        <Form methods={methods} onSubmit={onSubmit}>
            <CustomDialogTitle
                title={mode == 'create' ? "Create Event" : "Update Event"}
                onClose={onClose}
            />
            <DialogContent>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 1fr)",
                    mt: 2,
                    rowGap: 2,
                    gap: 2
                }}>

                    <Box>
                        <Field.Autocomplete
                            name="Event"
                            label="Event"
                            autoHighlight
                            options={lovValues.map(v => ({
                                value: v.LOVCode,
                                label: v.LOVDescription,
                            }))}
                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                            getOptionLabel={(option) => option.label}
                            value={
                                values.LOVEventCode && lovMap[values.LOVEventCode]
                                    ? { value: values.LOVEventCode, label: lovMap[values.LOVEventCode].LOVDescription }
                                    : null
                            }
                            renderOption={(props, option) => (
                                <li {...props} key={option.value}>
                                    {option.label}
                                </li>
                            )}
                            onChange={(_, selected) => {
                                setValue("Event", selected ?? null, { shouldValidate: true });
                                setValue("LOVEventCode", selected?.value ?? "");
                                setValue("EventName", selected?.label ?? "");

                                if (selected) {
                                    const returnValueRaw = lovMap[selected.value]?.ReturnValue ?? 0;
                                    const returnValue = Number(returnValueRaw);
                                    const startDateStr = getValues("StartDate");

                                    if (Number(returnValueRaw) > 1) {
                                        enableEndDate.onTrue();
                                    } else {
                                        enableEndDate.onFalse();
                                    }
                                    if (startDateStr) {
                                        const startDate = dayjs(startDateStr);
                                        let newEndDate = startDate.toISOString();
                                        if (returnValue > 0) {
                                            newEndDate = startDate.add(returnValue - 1, "day").toISOString();
                                        }

                                        setValue("EndDate", newEndDate, { shouldValidate: true });
                                    }
                                }
                            }}
                        />


                        {methods.formState.errors.Event && (
                            <Box mt={0.5} ml={2}>
                                <Typography variant="caption" color="error">
                                    {methods.formState.errors.EventName?.message}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box>
                        <Field.DatePicker
                            name="StartDate"
                            label="Start Date"

                        />
                    </Box>

                    <Box>
                        <Field.DatePicker
                            name="EndDate"
                            label="End Date"
                            disabled={enableEndDate.value}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ flexShrink: 0 }}>
                {currentEvent?.id != null && (
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

                <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="primary">
                    Submit
                </LoadingButton>
            </DialogActions>


        </Form>
    </Dialog>
}