import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { IBranch } from 'src/types/branch';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.branch;

export function GetBranches(branchCode?: string) {

    const baseUrl = endpoint.list;
    const url = branchCode && branchCode.trim() !== '' ? `${baseUrl}?branchCode=${encodeURIComponent(branchCode)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<IBranch[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            branches: data || [],
            branchesLoading: isLoading,
            branchesError: error,
            branchesValidating: isValidating,
            branchesEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}