import type { SwitcherPopoverProps } from 'src/layouts/components/switcher-popover';

import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';

// ----------------------------------------------------------------------

export function getModules() {
  const url = endpoints.core.admin.module;

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