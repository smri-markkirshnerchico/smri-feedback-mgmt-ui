import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { IPositionHierarchy } from 'src/types/position-hierarchy';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.positionHierarchy;

export function GetPositionHierarchies(positionCode?: string) {

    const baseUrl = endpoint.list;
    const url = positionCode && positionCode.trim() !== '' ? `${baseUrl}?positionCode=${encodeURIComponent(positionCode)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<IPositionHierarchy[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            positionHierarchies: data || [],
            positionHierarchiesLoading: isLoading,
            positionHierarchiesError: error,
            positionHierarchiesValidating: isValidating,
            positionHierarchiesEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}