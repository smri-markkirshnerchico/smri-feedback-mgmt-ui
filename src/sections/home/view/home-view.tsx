'use client';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MainContent } from 'src/layouts/main';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <MainContent>
      <CustomBreadcrumbs />
    </MainContent>
  );
}