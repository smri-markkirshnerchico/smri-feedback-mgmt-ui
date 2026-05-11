'use client'

import { Box, Button, ButtonGroup, Card, Divider, Drawer, IconButton, List, Tooltip, Typography } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Scrollbar } from "src/components/scrollbar";
import { MainContent } from "src/layouts/main";
import { CalendarRoot } from "../components/calendar-root";
import type { Theme, SxProps } from '@mui/material/styles';
import Calendar from '@fullcalendar/react';
import { useCalendar } from "../hooks/use-calendar";
import multiMonthPlugin from '@fullcalendar/multimonth';
import { useMemo, useState } from "react";
import { useBoolean } from "minimal-shared/hooks";
import interactionPlugin from '@fullcalendar/interaction';
import { Iconify } from "src/components/iconify";
import { GetCalendarEventsByYear } from "src/api/admin/holiday";
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from "dayjs";

export function HolidayView() {

    const flexStyles: SxProps<Theme> = {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
    };

    const {
        calendarRef,
        view,
        date,
        setView,
        onDateNext,
        onDatePrev,
        onDateToday
    } = useCalendar();

    const { yearHoliday: rawEvents, yearHolidayLoading } = GetCalendarEventsByYear(date.getFullYear());

    const calendarEvents = useMemo(() => {
        if (!rawEvents) return [];

        return rawEvents.map((ev) => {
            const start = dayjs(ev.start).format("YYYY-MM-DD");
            const end = dayjs(ev.end).add(1, 'day').format("YYYY-MM-DD");
            return {
                id: ev.id,
                title: ev.title,
                start: start,
                allDay: true,
                end: end,
                color: ev.color,
                eventName: ev.eventName ?? "",
                description: ev.description,
                lovEventCode: ev.lovEventCode,
                isHoliday: ev.isHoliday
            };
        });
    }, [rawEvents, yearHolidayLoading]);


    const DialogSideDrawer = useBoolean();

    const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
    const [clickedDate, setClickedDate] = useState<Date | null>(null);
    const handleSelectRange = (info: any) => {

        const clickedDate = dayjs(info.startStr).format("YYYY-MM-DD");

        const eventsOnClickedDate = calendarEvents.filter(e => {
            return clickedDate >= e.start && clickedDate < e.end;
        });

        setSelectedEvents(eventsOnClickedDate);
        setClickedDate(dayjs(clickedDate).toDate());

        if (eventsOnClickedDate.length > 0) {
            DialogSideDrawer.onTrue();
        }
    };
    const calendarTitle = useMemo(() => {
        const api = calendarRef.current?.getApi();
        if (!api) return "";

        const currentDate = api.getDate();

        switch (view) {
            case "multiMonthYear":
                return currentDate.getFullYear();

            case "dayGridMonth":
                return currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                });

            case "dayGridWeek": {
                const start = api.view.activeStart;
                const end = api.view.activeEnd;

                const startStr = start.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                });

                const endStr = new Date(end.getTime() - 1).toLocaleDateString(
                    undefined,
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }
                );

                return `${startStr} - ${endStr}`;
            }

            case "dayGridDay":
                return currentDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });

            default:
                return "";
        }
    }, [view, date]);

    const navigationLabels = useMemo(() => {
        switch (view) {
            case "multiMonthYear":
                return { prev: "Previous Year", next: "Next Year" };

            case "dayGridMonth":
                return { prev: "Previous Month", next: "Next Month" };

            case "dayGridWeek":
                return { prev: "Previous Week", next: "Next Week" };

            case "dayGridDay":
                return { prev: "Previous Day", next: "Next Day" };

            default:
                return { prev: "Previous", next: "Next" };
        }
    }, [view]);

    return (<MainContent maxWidth="xl">
        <CustomBreadcrumbs />
        <Card sx={{ p: 2 }}>
            <Box sx={{ position: 'relative' }}>
                <Scrollbar >
                    <CalendarRoot
                        sx={{
                            ...flexStyles,
                            '.fc.fc-media-screen': { flex: '1 1 auto' },
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                m: 2,
                                gap: 2,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Calendar View
                            </Typography>

                            <ButtonGroup
                                variant="outlined"
                                size="small"
                                sx={{
                                    backgroundColor: "background.paper",
                                    borderRadius: 2,
                                    boxShadow: 1,
                                }}
                            >
                                <Button
                                    variant={view === "multiMonthYear" ? "contained" : "outlined"}
                                    onClick={() =>
                                        calendarRef.current?.getApi().changeView("multiMonthYear")
                                    }
                                >
                                    Year
                                </Button>

                                <Button
                                    variant={view === "dayGridMonth" ? "contained" : "outlined"}
                                    onClick={() =>
                                        calendarRef.current?.getApi().changeView("dayGridMonth")
                                    }
                                >
                                    Month
                                </Button>

                                <Button
                                    variant={view === "dayGridWeek" ? "contained" : "outlined"}
                                    onClick={() =>
                                        calendarRef.current?.getApi().changeView("dayGridWeek")
                                    }
                                >
                                    Week
                                </Button>

                                <Button
                                    variant={view === "dayGridDay" ? "contained" : "outlined"}
                                    onClick={() =>
                                        calendarRef.current?.getApi().changeView("dayGridDay")
                                    }
                                >
                                    Day
                                </Button>
                            </ButtonGroup>
                        </Box>

                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            ml: 2,
                            mr: 2
                        }}>
                            <Box>
                                <Typography variant="h3">
                                    {calendarTitle}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
                                <Tooltip title={navigationLabels.prev} placement="top">
                                    <IconButton onClick={onDatePrev}>
                                        <Iconify icon="solar:arrow-left-linear" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={navigationLabels.next}>
                                    <IconButton onClick={onDateNext}>
                                        <Iconify icon="solar:arrow-right-linear" />
                                    </IconButton>
                                </Tooltip>
                                <Button variant="outlined" onClick={onDateToday} color="primary">
                                    Today
                                </Button>
                            </Box>
                        </Box>

                        <Calendar
                            weekends
                            editable
                            selectable={true}
                            rerenderDelay={10}
                            allDayMaintainDuration
                            eventResizableFromStart
                            ref={calendarRef}
                            initialDate={date}
                            headerToolbar={false}
                            initialView="multiMonthYear"
                            datesSet={(arg: any) => {
                                setView(arg.view.type)
                            }}
                            // dayMaxEventRows={3}
                            dayHeaderFormat={{ weekday: 'short' }}
                            // eventDisplay="none"
                            eventDisplay={
                                view === "multiMonthYear" || view === "dayGridMonth"
                                    ? "none"
                                    : "auto"
                            }
                            eventSources={[{ events: calendarEvents }]}
                            select={handleSelectRange}
                            aspectRatio={2}
                            multiMonthMaxColumns={3}
                            // displayEventTime={false}
                            plugins={[
                                multiMonthPlugin,
                                interactionPlugin,
                                dayGridPlugin,
                                // timeGridPlugin
                            ]}
                            dayCellContent={(arg) => {
                                if (view === "dayGridWeek" || view === "dayGridDay") {
                                    return { html: arg.dayNumberText };
                                }

                                const day = arg.date;
                                const dayNumber = arg.dayNumberText;

                                const eventOnDay = calendarEvents.find(e => {
                                    const start = e.start;
                                    const end = e.end;
                                    const current = dayjs(day).format("YYYY-MM-DD");
                                    return current >= start && current < end;
                                });


                                let borderColor = "";

                                if (eventOnDay) {
                                    if (eventOnDay.isHoliday) {
                                        borderColor = 'red';
                                    } else {
                                        borderColor = 'green';
                                    }
                                    return {
                                        html: `
                                            <div style="
                                                display: inline-flex;
                                                align-items: center;
                                                justify-content: center;
                                                width: 28px;
                                                height: 28px;
                                                border: 2px solid ${borderColor};
                                                border-radius: 50%;
                                                font-weight: bold;
                                            ">
                                                ${dayNumber}
                                            </div>
                                        `
                                    };

                                }

                                return { html: dayNumber };

                            }}

                        />
                    </CalendarRoot>
                </Scrollbar>
            </Box>
        </Card>

        <Drawer
            anchor="right"
            open={DialogSideDrawer.value}
            onClose={DialogSideDrawer.onFalse}>
            <Box sx={{ width: 320, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Events on {clickedDate ? clickedDate.toDateString() : ''}
                </Typography>

                <List>
                    {selectedEvents.map((ev) => (
                        <Box key={ev.id} sx={{ mt: 2 }}>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                {ev.isHoliday ? (
                                    <Iconify icon="clarity:on-holiday-line" sx={{ color: "red", height: 30, width: 30 }} />
                                ) : (
                                    <Iconify icon="mi:shopping-cart" sx={{ color: "green", height: 30, width: 30 }} />
                                )}
                                <Typography variant="h6">{ev.eventName ?? ev.title}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" fontWeight={300}>{ev.description}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1, mb: 1 }}>
                                <Box>
                                    <Iconify icon="ci:calendar" sx={{ color: "blue", height: 30, width: 30 }} />
                                </Box>
                                <Box sx={{ display: "block" }}>
                                    <Typography variant="body2">{`Start: ${dayjs(ev.start).format('MMMM DD,YYYY')}`}</Typography>
                                    <Typography variant="body2">{`End: ${dayjs(ev.end).add(-1, 'day').format('MMMM DD,YYYY')}`}</Typography>
                                </Box>
                            </Box>
                            <Divider />
                        </Box>
                    ))}
                </List>
            </Box>
        </Drawer>
    </MainContent>)
}