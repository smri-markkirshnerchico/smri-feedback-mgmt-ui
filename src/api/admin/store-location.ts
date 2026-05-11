import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/lib/axios';
import { endpoints } from '../endpoints';
import { IStoreLocation } from 'src/types/store-location';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.storeLocation;

export function GetStoreLocations(stLocId?: number) {

    const baseUrl = endpoint.list;
    const url = stLocId && stLocId !== 0 ? `${baseUrl}?stLocId=${encodeURIComponent(stLocId)}` : baseUrl;

    const { data, isLoading, error, isValidating, mutate } = useSWR<IStoreLocation[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            storeLocations: data || [],
            storeLocationsLoading: isLoading,
            storeLocationsError: error,
            storeLocationsValidating: isValidating,
            storeLocationsEmpty: !isLoading && !isValidating && !data?.length,
            storeLocationsMutate: mutate
        }),
        [data, error, isLoading, isValidating,]
    );

    return memoizedValue;
}