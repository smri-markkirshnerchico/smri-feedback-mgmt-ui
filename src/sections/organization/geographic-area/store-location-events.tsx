import { Box, Button, Card, Dialog, DialogActions, DialogContent, IconButton, Tooltip, Typography } from "@mui/material";
import { CustomDialogTitle } from "src/components/custom-dialog-title";
import { IStoreLocation } from "src/types/store-location"
import { CalendarRoot } from "./components/calendar-root";
import type { Theme, SxProps } from '@mui/material/styles';

import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import { startTransition, useEffect, useMemo, useState } from 'react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendar } from "./hooks/use-calendar";
import { useBoolean } from "minimal-shared/hooks";
import { StoreLocationEventDialog } from "./store-location-event-dialog";
import { GetCalendarEventsByStoreLocId } from "src/api/admin/sm-events";
import { ICalendarEvent } from "src/types/calendar";
import { CALENDAR_COLOR_OPTIONS } from "./components/calendar-options";
import { GetLOVByGroup } from "src/api/admin/lov";
import { LOValuesDto } from "src/types/lov";
import { Iconify } from "src/components/iconify";

export type Props = {
  currentStoreLocation?: IStoreLocation;
  open: boolean;
  onClose: () => void;
}

export function StoreLocationEvents({ currentStoreLocation, open, onClose }: Readonly<Props>) {

  if (currentStoreLocation == null) return;
  const { calendarEvents: rawEvents, calendarEventsLoading, calendarEventsMutate } = GetCalendarEventsByStoreLocId(currentStoreLocation.StLocId ?? "");

  const { lovGroup, lovGroupLoading } = GetLOVByGroup('SMEvents');

  const [lovValues, setLovValues] = useState<LOValuesDto[]>([]);

  useEffect(() => {
    if (lovGroup && !lovGroupLoading) {
      setLovValues(lovGroup.Values);
    }

  }, [lovGroupLoading, lovGroup]);

  const recordListOfValues = Object.fromEntries(lovValues.map((x: LOValuesDto) => [String(x.LOVCode), String(x.LOVDescription)]));

  const calendarEvents = useMemo(() => {
    if (!rawEvents) return [];

    return rawEvents.map((ev) => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);

      start.setHours(10, 0, 0, 0);
      end.setHours(10, 0, 0, 0);
      return {
        id: ev.id,
        title: ev.title,
        start: start,
        allDay: false,
        end: end,
        color: ev.color,
        eventName: ev.eventName ?? "",
        lovEventCode: ev.lovEventCode,
      };
    });
  }, [rawEvents, calendarEventsLoading]);



  const flexStyles: SxProps<Theme> = {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const {
    calendarRef,
    view,
    date,
    onDateNext,
    onDatePrev,
    onDateToday
  } = useCalendar();

  const DialogCreateUpdateEvent = useBoolean();

  const [mode, setMode] = useState<'create' | 'update'>('create');
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | undefined>(undefined);

  const handleEventClick = (info: any) => {

    setSelectedEvent(info.event);
    setMode('update');
    DialogCreateUpdateEvent.onTrue();
  };

  const handleSelectRange = (info: any) => {

    const start = new Date(info.start);
    const end = new Date(info.end);
    start.setHours(10, 0, 0, 0);
    end.setHours(10, 0, 0, 0);

    setSelectedEvent({
      start: start.toISOString(),
      end: end.toISOString(),
      color: '',
      allDay: false,
      title: '',
      description: ''
    });
    setMode('create');
    DialogCreateUpdateEvent.onTrue();
  };


  const renderDialogEvent = () => {
    return <StoreLocationEventDialog
      open={DialogCreateUpdateEvent.value}
      onClose={DialogCreateUpdateEvent.onFalse}
      currentStoreLocation={currentStoreLocation}
      currentEvent={selectedEvent}
      mutateEvents={calendarEventsMutate}
      // lovGroups={recordListOfValues}
      lovValues={lovValues}
      mode={mode}
    />
  }

  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="body">
    {DialogCreateUpdateEvent.value && renderDialogEvent()}
    <CustomDialogTitle
      title={`${currentStoreLocation.CompanyDesc} - ${currentStoreLocation.BranchDesc}`}
      onClose={onClose}
    />

    <DialogContent>
      <Card sx={{ m: 2, p: 2, boxShadow: 4 }}>

        <CalendarRoot sx={{
          ...flexStyles,
          '.fc.fc-media-screen': { flex: '1 1 auto' },
        }}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            ml: 2,
            mr: 2
          }}>
            <Box>
              <Typography variant="h3">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
              <Tooltip title={"Previous Month"} placement="top">
                <IconButton onClick={onDatePrev}>
                  <Iconify icon="solar:arrow-left-linear" />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Next Month"}>
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
            selectable
            rerenderDelay={10}
            allDayMaintainDuration
            eventResizableFromStart
            ref={calendarRef}
            initialDate={date}
            headerToolbar={false}
            // initialView={view}
            initialView="dayGridMonth"
            dayMaxEventRows={3}
            dayHeaderFormat={{ weekday: 'long' }}
            eventDisplay="block"
            // events={calendarEvents}
            eventSources={[{ events: calendarEvents }]}
            select={handleSelectRange}
            eventClick={handleEventClick}
            allDaySlot={false}
            aspectRatio={3}
            displayEventTime={false}
            plugins={[
              listPlugin,
              dayGridPlugin,
              timelinePlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            contentHeight={480}
          />
        </CalendarRoot>
      </Card>
    </DialogContent>

    <DialogActions>
      <Button variant="outlined" onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
}