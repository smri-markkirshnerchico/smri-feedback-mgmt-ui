import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { fetcher } from 'src/lib/axios';
import { endpoints } from '../endpoints';
import { IPositionLevel } from 'src/types/position-level';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.positionLevel;

export function GetPositionLevel(PositionLevelId?: number) {

    const baseUrl = endpoint.list;
    const url = PositionLevelId && PositionLevelId !== 0 ? `${baseUrl}?positionCode=${encodeURIComponent(PositionLevelId)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<IPositionLevel[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            positionLevels: data || [],
            positionLevelsLoading: isLoading,
            positionLevelsError: error,
            positionLevelsValidating: isValidating,
            positionLevelsEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}