import { Dayjs } from "dayjs";

export type IDatePickerControl = Dayjs | null;

export type IDateValue = string | number | null;

export type ICalendarFilters = {
    colors: string[];
    startDate: IDatePickerControl;
    endDate: IDatePickerControl;
};

export type ICalendarDate = string | number;

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek' | 'multiMonthYear' | 'multiMonth' | 'dayGridDay' | 'dayGridWeek';

export type ICalendarRange = {
    start: ICalendarDate;
    end: ICalendarDate;
} | null;

export type ICalendarEvent = {
    id?: string;
    color: string;
    title: string,
    description: string,
    allDay: boolean;
    end: string;
    start: string;
    backgroundColor?: string;
    borderColor?: string;

    extendedProps?: any;

    //Extended props
    lovEventCode?: string;
    eventName?: string;
    isHoliday?: boolean;
    isFixed?: boolean;
    isNational?: boolean;
    isRecurring?: boolean;
};


export type SMCreateUpdateEvent = {
    EventId?: string;
    EventName: string;
    LOVEventCode: string;
    StLocId: number;
    Start: string;
    End: string;
    StoreLocation?: string;
}