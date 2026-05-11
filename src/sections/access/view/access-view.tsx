'use client';

import { IRole } from 'src/types/role';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MainContent } from 'src/layouts/main';

import { AccessLayout } from '../components/access-layout';
import { AccessHeader } from '../components/access-header';

import { Role } from '../role';
import { RoleDetails } from '../role-details';

import { getSessionAccess } from 'src/api/admin/session';

// ----------------------------------------------------------------------

export function AccessView() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const { sessionAccess } = getSessionAccess();

  const openNav = useBoolean();

  const [selectedRole, setSelectedRole] = useState<IRole>();

  const handleSelectRole = useCallback((item?: IRole) => {
    if (!mdUp) {
      openNav.onFalse();
    }
    setSelectedRole(item);
  }, [mdUp, selectedRole]);

  return (
    <MainContent>
      <CustomBreadcrumbs />

      <AccessLayout 
        slots={{
          header: (
            <AccessHeader 
              sx={{ display: { md: 'none' } }}
              onOpenNav={openNav.onTrue}
            />
          ),
          list: (
            <Role
              isDevSet={sessionAccess?.IsDevSet ?? false}
              isDevOps={sessionAccess?.IsDevOps ?? false}
              selectedRole={selectedRole}
              onSelectRole={handleSelectRole}
              openNav={openNav.value}
              onCloseNav={openNav.onFalse}
            />
          ),
          details: (
            <RoleDetails selectedRole={selectedRole} isDevSet={sessionAccess?.IsDevSet ?? false} />
          )
        }}
      /> 
    </MainContent>
  );
}