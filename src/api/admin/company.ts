import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { ICompany } from 'src/types/company';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.company;

export function GetCompanies(companyCode?: string) {

    const baseUrl = endpoint.list;
    const url = companyCode && companyCode.trim() !== '' ? `${baseUrl}?companyCode=${encodeURIComponent(companyCode)}` : baseUrl;

    const { data, isLoading, error, isValidating } = useSWR<ICompany[]>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            companies: data || [],
            companiesLoading: isLoading,
            companiesError: error,
            companiesValidating: isValidating,
            companiesEmpty: !isLoading && !isValidating && !data?.length
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}