'use client';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import Grid from '@mui/material/Grid2';

import { MainContent } from 'src/layouts/main';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import { HomeTotalTransaction } from '../home-total-transaction';
import { HomeAuditStatus } from '../home-audit-status';
import { HomeUserWidget } from '../home-user-widget';
import { svgColorClasses } from 'src/components/svg-color';
import { HomeUsersPerCompany } from '../home-users-per-company';
import { HomeCalendarView } from '../home-calendar-view';
import { GetUserActiveInactive } from 'src/api/admin/user';
import { useEffect, useMemo } from 'react';

// ----------------------------------------------------------------------

export function HomeView() {

  const theme = useTheme();

  const { userCount } = GetUserActiveInactive();
  const { activePercent, inactivePercent } = useMemo(() => {
    const active = userCount?.Active ?? 0;
    const inactive = userCount?.Inactive ?? 0;
    const total = active + inactive;

    if (total === 0) {
      return { activePercent: 0, inactivePercent: 0 };
    }

    return {
      activePercent: Math.round((active / total) * 100),
      inactivePercent: Math.round((inactive / total) * 100),
    };
  }, [userCount]);


  return (
    <MainContent sx={{
      p: 4
    }}>
      <CustomBreadcrumbs customTitle='Dashboard' />
      <Box sx={{
        p: 0,
        display: "grid",
        gap: 2,
        alignItems: "stretch",
        gridTemplateColumns: { xs: "repeat(1, 1fr)", md: 'repeat(8, 1fr)' }
      }}>

        <HomeAuditStatus
          title="Audit Per Application"
          sx={{
            boxShadow: 'none',
            gridColumn: { md: "span 3", xs: "span 1" },
            width: "100%"
          }}
        />

        <Box sx={{
          gridColumn: { md: "span 2", xs: "span 1" },
          width: "100%"
        }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <HomeUserWidget
              title="Active Users"
              total={userCount?.Active ?? 0}
              icon="solar:user-rounded-bold"
              chart={{
                series: activePercent,
                colors: [theme.vars.palette.success.light, theme.vars.palette.success.main],
              }}
              sx={{ bgcolor: 'success.dark', [`& .${svgColorClasses.root}`]: { color: 'success.light' } }}
            />

            <HomeUserWidget
              title="Inactive Users"
              total={userCount?.Inactive ?? 0}
              icon="solar:user-rounded-bold"
              chart={{
                series: inactivePercent,
                colors: [theme.vars.palette.error.light, theme.vars.palette.error.main],
              }}
              sx={{ bgcolor: 'error.dark', [`& .${svgColorClasses.root}`]: { color: 'error.light' } }}
            />

          </Box>
        </Box>

        <Box sx={{
          gridColumn: { md: "span 4", xs: "span 1" },
          height: "100%",
          display: "flex",
          width: "100%"
        }}>
          <HomeUsersPerCompany />
        </Box>


        <Box sx={{
          gridColumn: { md: "span 4", xs: "span 1" },
          height: "100%",
          display: "flex",
          width: "100%"
        }}
        >
          <HomeCalendarView />
        </Box>

      </Box>
    </MainContent>
  );
}