import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { ISMEvents } from 'src/types/sm-events';
import { ICalendarEvent, SMCreateUpdateEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.smEvents;

export function GetSMEventsByStLocId(stLocId: string) {

    const baseUrl = `${endpoint.list}?stLocId=${encodeURIComponent(stLocId)}`;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ISMEvents[]>(baseUrl, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            smEvents: data || [],
            smEventsLoading: isLoading,
            smEventsError: error,
            smEventsValidating: isValidating,
            smEventsEmpty: !isLoading && !isValidating && !data?.length,
            smEventsMutate: mutate
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}


export function GetCalendarEventsByStoreLocId(stLocId: number) {

    const baseUrl = `${endpoint.calendarEvents}?stLocId=${encodeURIComponent(stLocId)}`;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ICalendarEvent[]>(baseUrl, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            calendarEvents: data || [],
            calendarEventsLoading: isLoading,
            calendarEventsError: error,
            calendarEventsValidating: isValidating,
            calendarEventsEmpty: !isLoading && !isValidating && !data?.length,
            calendarEventsMutate: mutate
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export const CreateUpdateSMEvent = async (lov: SMCreateUpdateEvent) => {
    const url = endpoint.createUpdate;

    await axios.post(url, lov);

    mutate(url);

}

export const DeleteCalendarEvent = async (smEventId: string, stLocId: number) => {

    const url = `${endpoint.delete}?smEventId=${encodeURIComponent(smEventId)}&stLocId=${encodeURIComponent(stLocId)}`;

    await axios.delete(url);

    mutate(url);
}