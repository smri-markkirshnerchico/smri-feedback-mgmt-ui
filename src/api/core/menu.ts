import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

export function getMenus() {
  const url = endpoints.core.admin.menu;

  const { data, isLoading, error, isValidating } = useSWR<NavSectionProps["data"]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      navData: data || [],
      navDataLoading: isLoading,
      navDataError: error,
      navDataValidating: isValidating,
      navDataEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}