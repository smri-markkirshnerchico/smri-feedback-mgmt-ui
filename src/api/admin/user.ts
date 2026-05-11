import useSWR, { mutate } from 'swr'
import { endpoints } from '../endpoints'
import axios, { fetcher } from 'src/lib/axios';
import { useMemo } from 'react';
import { IUserDto, IUserFind, UserActiveInactive } from 'src/types/user';


const endpoint = endpoints.admin.user;

export function GetUserList(appId: string) {
    const url = `${endpoint.list}?appId=${encodeURIComponent(appId)}`;

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            user: data ?? [],
            userLoading: isLoading,
            userError: error,
            userValidating: isValidating,
            userMutate: mutate,
            userEmpty: !isLoading && !isValidating

        }), [data, error, isLoading, isValidating, mutate])

    return memoizedValue;
}

export function FindUser(employeeNumber: string) {
    const willFetch = employeeNumber !== '';
    const url = endpoint.find + "?EmployeeNumber=" + employeeNumber;

    const { data, isLoading, error, isValidating } = useSWR<IUserDto>(willFetch ? url : null, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            user: data,
            userLoading: isLoading,
            userError: error,
            userValidating: isValidating,
            userEmpty: !isLoading && !isValidating && !data,
        }),
        [data, error, isLoading, isValidating]
    );
    return memoizedValue;
}

export const CreateUser = async (user: IUserDto) => {
    const url = endpoint.main;

    await axios.post(url, user);

    mutate(url);
}

export const UpdateUser = async (user: IUserDto) => {
    const url = endpoint.main;

    await axios.put(url, user);

    mutate(url);
}

export const DeleteUser = async (UserId: string) => {
    const url = `${endpoint.delete}?UserId=${encodeURIComponent(UserId)}`;

    await axios.delete(url);

    mutate(url);
}

export function GetUserActiveInactive() {
    const url = endpoint.getUserActiveInactive

    const { data, isLoading, error, isValidating } = useSWR<UserActiveInactive>(url, fetcher, {
        revalidateOnFocus: false
    });

    const memoizedValue = useMemo(
        () => ({
            userCount: data,
            userCountLoading: isLoading,
            userCountError: error,
            userCountValidating: isValidating,
            userCountMutate: mutate,
            userCountEmpty: !isLoading && !isValidating

        }), [data, error, isLoading, isValidating])

    return memoizedValue;
}
