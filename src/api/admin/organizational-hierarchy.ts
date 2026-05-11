import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { IOrganizationalHierarchy } from 'src/types/organization-hierarchy';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.orgHierarchy;

export function GetOrgHierarchies(companyCode?: string) {

    const baseUrl = endpoint.list;
    const url = companyCode && companyCode.trim() !== '' ? `${baseUrl}?companyCode=${encodeURIComponent(companyCode)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<IOrganizationalHierarchy[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            orgHierarchies: data || [],
            orgHierarchiesLoading: isLoading,
            orgHierarchiesError: error,
            orgHierarchiesValidating: isValidating,
            orgHierarchiesEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}