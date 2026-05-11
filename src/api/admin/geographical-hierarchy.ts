import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { IGeographicalHierarchy } from 'src/types/geographical-hierarchy';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.geoHierarchy;

export function GetGeographicalHierarchies(keyword?: string) {

    const baseUrl = endpoint.list;
    const url = keyword && keyword !== '' ? `${baseUrl}?keyword=${encodeURIComponent(keyword)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<IGeographicalHierarchy[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            geoHierarchies: data || [],
            geoHierarchiesLoading: isLoading,
            geoHierarchiesError: error,
            geoHierarchiesValidating: isValidating,
            geoHierarchiesEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}