import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { fetcher } from 'src/lib/axios';
import { endpoints } from '../endpoints';
import { IPosition } from 'src/types/position';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.position;

export function GetPositions(positionCode?: string) {

    const baseUrl = endpoint.list;
    const url = positionCode && positionCode.trim() !== '' ? `${baseUrl}?positionCode=${encodeURIComponent(positionCode)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<IPosition[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            positions: data || [],
            positionsLoading: isLoading,
            positionsError: error,
            positionsValidating: isValidating,
            positionsEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}