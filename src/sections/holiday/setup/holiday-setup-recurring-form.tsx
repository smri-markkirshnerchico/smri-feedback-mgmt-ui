import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, TextField, Typography } from "@mui/material";
import { CustomDialogTitle } from "src/components/custom-dialog-title";
import { IHoliday, IHolidayDatesDto, IYearlySetupHolidayDto, calendarMonths } from "src/types/holiday";
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetupYearlyHoliday } from "src/api/admin/holiday";
import dayjs from "dayjs";


export type Props = {
    open: boolean;
    onClose: () => void;
    year: number;
    holidays: IHoliday[];
    mutate: () => void;
}

export function HolidaySetupRecurringForm({ open, onClose, year, holidays, mutate }: Readonly<Props>) {

    const getHolidayDateForYear = (holiday: IHoliday, year: number) => {
        return holiday.HolidayDates.find(d => new Date(d).getFullYear() === year);
    };

    const fixedRecurring = holidays.filter(h =>
        h.IsFixed && h.IsRecurring
    );

    const nonFixedRecurring = holidays.filter(h =>
        !h.IsFixed && h.IsRecurring
    ).sort((a, b) => {
        return a.HolidayName.localeCompare(b.HolidayName)
    });

    useEffect(() => {
        nonFixedRecurring.forEach(h => {
            const existingDate = getHolidayDateForYear(h, year);

            if (existingDate) {
                methods.setValue(`HolidayDates.${h.HolidayId}`, existingDate);
            }
        });
    }, [nonFixedRecurring, year]);

    const [selectedDates, setSelectedDates] = useState<Record<string, string>>(
        {}
    );


    const methods = useForm<{
        HolidayDates: Record<string, string>;
    }>({
        defaultValues: {
            HolidayDates: nonFixedRecurring.reduce((acc, h) => {
                if (h.HolidayId) acc[h.HolidayId] = "";
                return acc;
            }, {} as Record<string, string>),
        },
    });


    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const handleFormSubmit = methods.handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {

            const holidayDatesArray: IHolidayDatesDto[] = Object.entries(data.HolidayDates ?? {}).map(
                ([HolidayId, dates]) => ({
                    HolidayId,
                    EventDate: dates
                })
            );

            const post: IYearlySetupHolidayDto = {
                Year: year,
                HolidayDates: holidayDatesArray
            };

            await SetupYearlyHoliday(post);

            toast.success(`Successfully setup calendar for year ${year}`);
            mutate();

            onClose();
        } catch (error: any) {

            const message =
                error?.response?.data ??
                error?.message ??
                'An unknown error occurred.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    });


    return (
        <FormProvider {...methods}>
            <Dialog open={open}
                onClose={onClose} fullWidth maxWidth="lg">
                <CustomDialogTitle
                    title={`${year} - Holiday Setup`}
                    onClose={onClose}
                />
                <DialogContent sx={{ overflow: "visible" }}>
                    <Grid container spacing={2} alignItems="stretch">
                        {/* Fixed Holidays */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardHeader title="Fixed Recurring Holidays" />

                                <CardContent sx={{ maxHeight: 400, overflowY: "auto" }}>
                                    {fixedRecurring.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No fixed recurring holidays found.
                                        </Typography>
                                    )}

                                    {fixedRecurring.map(h => (
                                        <Box key={h.HolidayId} sx={{ mb: 2 }}>
                                            <Box sx={{
                                                display: "flex", alignItems: "center",
                                                justifyContent: "space-between",
                                                alignContent: "center"
                                            }}>
                                                <Typography variant="subtitle1" fontWeight={600} sx={{ maxWidth: 200 }}>
                                                    {h.HolidayName}
                                                </Typography>

                                                <Typography variant="body2">
                                                    {calendarMonths.find(m => m.value === h.Month)?.label || "N/A"} {h.Day}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {h.HolidayDescription ?? ""}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Non-Fixed Holidays */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardHeader title="Non-Fixed Recurring Holidays" />

                                <CardContent sx={{ maxHeight: 400, overflowY: "auto" }}>
                                    {nonFixedRecurring.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No non-fixed recurring holidays found.
                                        </Typography>
                                    )}

                                    {nonFixedRecurring.map(h => (
                                        <Box key={h.HolidayId} sx={{ mb: 2 }}>
                                            <Box sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                alignContent: "center"
                                            }}>
                                                <Box>

                                                    <Typography variant="subtitle1" fontWeight={600} sx={{ maxWidth: 200 }}>
                                                        {h.HolidayName}
                                                    </Typography>

                                                    <Typography variant="body2" color="text.secondary">
                                                        {h.HolidayDescription || ""}
                                                    </Typography>

                                                </Box>

                                                <Box>

                                                    <Controller
                                                        control={methods.control}
                                                        name={`HolidayDates.${h.HolidayId}`}
                                                        render={({ field }) => {
                                                            // const valueObject = field.value
                                                            //     ? new Date(field.value.toString()).setHours(10)
                                                            //     : null;

                                                            const valueObject = field.value
                                                                ? new DateObject(field.value)
                                                                : new DateObject({ year, month: 1, day: 1 });

                                                            return (
                                                                <DatePicker
                                                                    calendarPosition="left-start"
                                                                    value={valueObject}
                                                                    onChange={(date: DateObject) => {
                                                                        const isoDate = date.format("YYYY-MM-DD");
                                                                        field.onChange(isoDate);
                                                                    }}
                                                                    minDate={`${year}-01-01`}
                                                                    maxDate={`${year}-12-31`}
                                                                    render={(value, openCalendar) => (
                                                                        <TextField
                                                                            label="Select Day"
                                                                            value={
                                                                                field.value
                                                                                    ? dayjs(field.value.toString()).format("MMMM DD, YYYY")
                                                                                    : ""
                                                                            }
                                                                            onClick={openCalendar}
                                                                            fullWidth
                                                                            autoComplete="off"
                                                                        />
                                                                    )}
                                                                />
                                                            );
                                                        }}
                                                    />

                                                </Box>

                                            </Box>


                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        onClick={handleFormSubmit}
                        disabled={nonFixedRecurring.length === 0}>
                        Submit
                    </LoadingButton>
                </DialogActions>
            </Dialog>

        </FormProvider>
    )
}