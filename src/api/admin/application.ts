import type { IApplication } from 'src/types/application';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

const endpoint = endpoints.admin.app;

export function getApplications() {
  const url = endpoint;

  const { data, isLoading, error, isValidating } = useSWR<IApplication[]>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      apps: data || [],
      appsLoading: isLoading,
      appsError: error,
      appsValidating: isValidating,
      appsEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createApplication<T>(data: T) {
  const url = endpoint;

  await axios.post(url, data);
  
  mutate(url);
}

export async function updateApplication<T>(data: T) {
  const url = endpoint;

  await axios.put(url, data);
  
  mutate(endpoint);
}

export async function deleteApplication(id: string) {
  const url = `${endpoint}?AppId=${id}`;
  
  await axios.delete(url);

  mutate(endpoint);
}