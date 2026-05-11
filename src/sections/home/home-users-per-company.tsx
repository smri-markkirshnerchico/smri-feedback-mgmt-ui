'use client';

import { useMemo } from 'react';
import { Box, Typography, Skeleton, Card, CardHeader } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';

type UsersPerCompanyItem = {
    companyName: string;
    userCount: number;
};

export function HomeUsersPerCompany() {
    const theme = useTheme();
    const loading = false;

    const data: UsersPerCompanyItem[] = [
        { companyName: 'SM Retail', userCount: 42 },
        { companyName: 'SM Supermarket', userCount: 31 },
        { companyName: 'SM Logistics', userCount: 18 },
        { companyName: 'SM IT Services', userCount: 27 },
    ];

    // 🔹 Memoized to avoid unnecessary re-renders
    const { series, labels, total } = useMemo(() => {
        const series = data.map((x) => x.userCount);
        const labels = data.map((x) => x.companyName);
        const total = series.reduce((a, b) => a + b, 0);

        return { series, labels, total };
    }, [data]);

    if (loading) {
        return (
            <Skeleton
                variant="rectangular"
                sx={{ height: 260, borderRadius: 2 }}
            />
        );
    }

    if (data.length === 0) {
        return (
            <Box
                sx={{
                    height: 260,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    // bgcolor: 'background.paper',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    No user data available
                </Typography>
            </Box>
        );
    }

    return (
        <Card
            sx={{
                p: 1,
                flex: 1
            }}
        >
            <CardHeader title={"Users Per Company"} />

            <Chart
                type="polarArea"
                series={series}
                options={{
                    chart: {
                        background: "transparent"
                    },
                    labels,
                    theme: {
                        mode: theme.palette.mode
                    },
                    legend: {
                        position: 'bottom',
                        fontSize: '12px',
                    },
                    stroke: { width: 0 },
                    dataLabels: { enabled: true },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '50%',
                                labels: {
                                    show: true,
                                    total: {
                                        show: true,
                                        label: 'Users',
                                        formatter: () => total.toString(),
                                    },
                                },
                            },
                        },
                    },
                    colors: [
                        theme.vars.palette.info.main,
                        theme.vars.palette.success.main,
                        theme.vars.palette.warning.main,
                        theme.vars.palette.error.main,
                    ],
                }}
                sx={{ height: 250 }}
            />
        </Card>
    );
}
