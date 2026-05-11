import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { ICompanyGroup } from 'src/types/company-group';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.companyGroup;

export function GetCompanyGroups(CoGrpId?: number) {

    const baseUrl = endpoint.list;
    const url = CoGrpId && CoGrpId !== 0 ? `${baseUrl}?CoGrpId=${encodeURIComponent(CoGrpId)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<ICompanyGroup[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            companyGroups: data || [],
            companyGroupsLoading: isLoading,
            companyGroupsError: error,
            companyGroupsValidating: isValidating,
            companyGroupsEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}