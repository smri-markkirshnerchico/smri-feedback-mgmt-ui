import useSWR, { mutate } from 'swr'
import { endpoints } from '../endpoints'
import axios, { fetcher } from 'src/lib/axios';
import { useMemo } from 'react';
import { IHoliday, IYearlySetupHolidayDto } from 'src/types/holiday';
import { ICalendarEvent } from 'src/types/calendar';

const endpoint = endpoints.admin.holiday;

export function GetHolidays() {
    const url = endpoint.list;

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            holidays: data ?? [],
            holidaysLoading: isLoading,
            holidaysError: error,
            holidaysValidating: isValidating,
            holidaysMutate: mutate,
            holidaysEmpty: !isLoading && !isValidating

        }), [data, error, isLoading, isValidating, mutate])

    return memoizedValue;
}

export const CreateUpdateHoliday = async (post: IHoliday) => {
    const url = endpoint.createUpdate;

    await axios.post(url, post);
    mutate(url);
}

export function GetCalendarEventsByYear(Year: number) {

    const url = `${endpoint.getCalendarEventsByYear}?Year=${encodeURIComponent(Year)}`;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ICalendarEvent[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            yearHoliday: data ?? [],
            yearHolidayLoading: isLoading,
            yearHolidayError: error,
            yearHolidayValidating: isValidating,
            yearHolidayMutate: mutate,
            yearHolidayEmpty: !isLoading && !isValidating

        }), [data, error, isLoading, isValidating, mutate])

    return memoizedValue;
}
export const DeleteHoliday = async (holidayId: string) => {
    const url = `${endpoint.delete}?holidayId=${encodeURIComponent(holidayId)}`;

    await axios.delete(url);

    mutate(url);
}

export const SetupYearlyHoliday = async (data: IYearlySetupHolidayDto) => {

    const url = endpoint.yearlySetup;

    await axios.post(url, data);

    mutate(url);

}