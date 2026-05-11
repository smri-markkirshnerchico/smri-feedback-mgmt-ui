import type { IMenu } from 'src/types/menu';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { fTextNullable } from 'src/utils/format-text';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.menu;

let mutateURL: string | null;

export function getMenus(moduleId: string) {
  const url = fTextNullable(moduleId) ? `${endpoint}?ModuleId=${moduleId}` : null;

  mutateURL = url;

  const { data, isLoading, error, isValidating } = useSWR<IMenu[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      menus: data || [],
      menusLoading: isLoading,
      menusError: error,
      menusValidating: isValidating,
      menusEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createMenu<T>(data: T) {
  const url = endpoint;

  await axios.post(url, data);
  
  mutate(mutateURL);
}

export async function updateMenu<T>(data: T) {
  const url = endpoint;

  await axios.put(url, data);
  
  mutate(mutateURL);
}

export async function deleteMenu(id: string) {
  const url = `${endpoint}?MenuId=${id}`;
  
  await axios.delete(url);

  mutate(mutateURL);
}