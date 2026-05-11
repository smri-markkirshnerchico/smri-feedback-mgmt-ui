import type { NavSectionProps } from 'src/components/nav-section';
import type { SwitcherPopoverProps } from 'src/layouts/components/switcher-popover';

import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

export function getMinimalsModules() {
  const url = endpoints.admin.minimals.module;

  const { data, isLoading, error, isValidating } = useSWR<SwitcherPopoverProps["data"]>(url, fetcher, { revalidateOnFocus: false });

  const memoizedValue = useMemo(
    () => ({
      switchData: data || [],
      switchDataLoading: isLoading,
      switchDataError: error,
      switchDataValidating: isValidating,
      switchDataEmpty: !isLoading && !isValidating && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getMinimalsMenu() {
  const url = endpoints.admin.minimals.menu;

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