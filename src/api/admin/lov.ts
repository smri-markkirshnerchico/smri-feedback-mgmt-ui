import useSWR, { mutate } from 'swr'
import { endpoints } from '../endpoints'
import axios, { fetcher } from 'src/lib/axios';
import { useMemo } from 'react';
import { ListOfValueDto } from 'src/types/lov';
import { CONFIG } from 'src/global-config';

const endpoint = endpoints.admin.lov;

export function GetLOVList() {
    const url = endpoint.list;

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            lov: data?.Items ?? [],
            lovTotal: data?.Total ?? 0,
            lovLoading: isLoading,
            lovError: error,
            lovValidating: isValidating,
            lovMutate: mutate,
            lovEmpty: !isLoading && !isValidating

        }), [data, error, isLoading, isValidating, mutate])

    return memoizedValue;
}

export const CreateUpdateLOV = async (lov: ListOfValueDto) => {
    const url = endpoint.createUpdate;

    await axios.post(url, lov);

    mutate(url);

}

export function GetLOVByGroupAppCodeAndModuleCode(group: string) {

    const url =
        endpoint.getLOVByGroupAppCodeAndModuleCode +
        '?group=' + encodeURIComponent(group) +
        '&appCode=' + encodeURIComponent(CONFIG.appCode) +
        '&moduleCode=' + encodeURIComponent(CONFIG.moduleCode);

    const { data, isLoading, error, isValidating, mutate } = useSWR<ListOfValueDto>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            lovGroup: data,
            lovGroupLoading: isLoading,
            lovGroupError: error,
            lovGroupValidating: isValidating,
            lovGroupMutate: mutate,
            lovGroupEmpty: !isLoading && !isValidating

        }), [data, error, isLoading, isValidating, mutate])

    return memoizedValue;

}


export function GetLOVByGroup(group: string) {

    const url =
        endpoint.getLOVByGroup +
        '?group=' + encodeURIComponent(group);

    const { data, isLoading, error, isValidating, mutate } = useSWR<ListOfValueDto>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            lovGroup: data,
            lovGroupLoading: isLoading,
            lovGroupError: error,
            lovGroupValidating: isValidating,
            lovGroupMutate: mutate,
            lovGroupEmpty: !isLoading && !isValidating

        }), [data, error, isLoading, isValidating, mutate])

    return memoizedValue;

}