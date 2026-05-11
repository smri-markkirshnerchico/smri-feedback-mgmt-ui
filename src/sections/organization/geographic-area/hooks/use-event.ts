import { info, error, primary, success, warning, secondary } from 'src/theme/core';
import type { ICalendarEvent, ICalendarRange } from 'src/types/calendar';

import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Theme } from '@mui/material/styles';
import { CALENDAR_COLOR_OPTIONS } from '../components/calendar-options';

export const CALENDAR_DATE_OPTIONS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];


// ----------------------------------------------------------------------

// export function useEvent(
//     events: ICalendarEvent[],
//     selectEventId: string,
//     selectedRange: ICalendarRange,
//     openForm: boolean
// ) {
//     const currentEvent = events.find((event) => event.id === selectEventId);

//     const defaultValues: ICalendarEvent = useMemo(
//         () => ({
//             id: '',
//             title: '',
//             allDay: false,
//             description: '',
//             color: CALENDAR_COLOR_OPTIONS[1],
//             start: selectedRange ? selectedRange.start : dayjs('2023-01-01T08:00:00').format(),
//             end: selectedRange ? selectedRange.end : dayjs('2023-01-01T12:00:00').format(),
//         }),
//         [selectedRange]
//     );

//     if (!openForm) {
//         return undefined;
//     }

//     if (currentEvent || selectedRange) {
//         return { ...defaultValues, ...currentEvent };
//     }

//     return defaultValues;
// }


export function getColorFromThemePath(theme: Theme, path: string): string {
    const resolved = path.split('.').reduce((acc: any, key: string) => {
        if (acc && key in acc) {
            return acc[key];
        }
        return null;
    }, theme.palette);

    return resolved ?? path;
}