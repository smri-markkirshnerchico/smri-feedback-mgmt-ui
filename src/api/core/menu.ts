import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';
import useSWR from 'swr';

import { CONFIG } from 'src/global-config';
import { fetcher } from 'src/lib/axios';

import { endpoints } from '../endpoints';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const DEV_NAV_DATA: Record<'employee' | 'manager' | 'admin', NavSectionProps["data"]> = {
  manager: [
    {
      subheader: 'manager',
      items: [
        { title: 'Dashboard', path: paths.main.manager.dashboard },
        { title: 'My Feedback', path: paths.main.manager.myFeedback },
        { title: 'Needs My Review', path: paths.main.manager.needsMyReview },
        { title: 'My Teams Review', path: paths.main.manager.myTeamsReview },
      ],
    },
  ],
  employee: [
    {
      subheader: 'employee',
      items: [
        { title: 'Dashboard', path: paths.main.employee.dashboard },
        { title: 'My Feedback', path: paths.main.employee.myFeedback },
        { title: 'Needs My Review', path: paths.main.employee.needsMyReview },
      ],
    },
  ],
  admin: [
    {
      subheader: 'admin',
      items: [
        { title: 'Dashboard', path: paths.main.admin.dashboard },
      ],
    },
  ],
};

export function getMenus() {
  if (CONFIG.auth.skip) {
    return {
      navData: DEV_NAV_DATA[CONFIG.devRole],
      navDataLoading: false,
      navDataError: undefined,
      navDataValidating: false,
      navDataEmpty: false,
    };
  }

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