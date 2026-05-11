import type { IModule } from 'src/types/module';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { fTextNullable } from 'src/utils/format-text';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.module;

let mutateURL: string | null;

export function getModules(appId: string) {
  const url = fTextNullable(appId) ? `${endpoint}?AppId=${appId}` : null;

  mutateURL = url;

  const { data, isLoading, error, isValidating } = useSWR<IModule[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      modules: data || [],
      modulesLoading: isLoading,
      modulesError: error,
      modulesValidating: isValidating,
      modulesEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createModule<T>(data: T) {
  const url = endpoint;

  await axios.post(url, data);

  mutate(mutateURL);
}

export async function updateModule<T>(data: T) {
  const url = endpoint;

  await axios.put(url, data);

  mutate(mutateURL);
}

export async function deleteModule(id: string) {
  const url = `${endpoint}?ModuleId=${id}`;

  await axios.delete(url);

  mutate(mutateURL);
}

export function GetModuleByModuleId(moduleId: string) {
  const url = `${endpoint}/GetModuleByModuleId?ModuleId=${encodeURIComponent(moduleId)}`;

  const { data, isLoading, error, isValidating } = useSWR<IModule>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      module: data,
      moduleLoading: isLoading,
      moduleError: error,
      moduleValidating: isValidating,
      moduleEmpty: !isLoading && !isValidating && data != null
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function GetAllModules() {
  const url = `${endpoint}/GetAllModules`;

  const { data, isLoading, error, isValidating } = useSWR<IModule[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      modules: data || [],
      modulesLoading: isLoading,
      modulesError: error,
      modulesValidating: isValidating,
      modulesEmpty: !isLoading && !isValidating && data != null
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;

}