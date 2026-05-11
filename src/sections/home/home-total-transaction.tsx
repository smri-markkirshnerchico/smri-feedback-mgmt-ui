import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import { fPercent, fNumber } from 'src/utils/format-number';
import { CONFIG } from 'src/global-config';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Chart, useChart } from 'src/components/chart';
import { TransactionChartData } from 'src/types/audit';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

type Props = CardProps & {
    title: string;
    auditChartData: TransactionChartData;
};

export function HomeTotalTransaction({ title, auditChartData, sx, ...other }: Props) {
    const theme = useTheme();

    if (!auditChartData) return null;

    const lastMonthData = auditChartData.series[0].data[auditChartData.series[0].data.length - 2];
    const currentMonthData = auditChartData.series[0].data[auditChartData.series[0].data.length - 1];

    const percent = useMemo(() => {
        if (lastMonthData === 0) return 0;
        return ((currentMonthData - lastMonthData) / lastMonthData) * 100;
    }, [currentMonthData, lastMonthData]);

    const updatedAuditChartData = {
        ...auditChartData,
        percent,
    };

    const chartColors = [hexAlpha(theme.palette.primary.lighter, 0.64)];

    const chartOptions: ChartOptions = useChart({
        chart: { sparkline: { enabled: true } },
        colors: chartColors,
        stroke: { width: 3 },
        grid: { padding: { top: 6, left: 6, right: 6, bottom: 6 } },
        xaxis: { categories: updatedAuditChartData.categories },
        tooltip: {
            y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
        },
        markers: { strokeColors: theme.vars.palette.primary.darker },
    });

    const renderTrending = () => (
        <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}>
                <Iconify
                    icon={updatedAuditChartData.percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
                />
                <Box component="span">
                    {updatedAuditChartData.percent > 0 && '+'}
                    {fPercent(updatedAuditChartData.percent)}
                </Box>
            </Box>
            <Box component="span" sx={{ opacity: 0.64, typography: 'body2' }}>
                last month
            </Box>
        </Box>
    );

    return (
        <Card
            sx={[
                {
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 'none',
                    color: 'primary.lighter',
                    bgcolor: 'primary.darker',
                    position: 'relative',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
                    <Box sx={{ typography: 'h3' }}>{fNumber(updatedAuditChartData.total)}</Box>
                </div>
                {renderTrending()}
            </Box>

            <Chart
                type="line"
                series={updatedAuditChartData.series}
                options={chartOptions}
                sx={{ height: 120 }}
            />

            <SvgColor
                src={`${CONFIG.assetsDir}/assets/background/shape-square.svg`}
                sx={{
                    top: 0,
                    left: 0,
                    width: 280,
                    height: 280,
                    opacity: 0.08,
                    zIndex: -1,
                    position: 'absolute',
                    color: 'primary.lighter',
                    transform: 'rotate(90deg)',
                }}
            />
        </Card>
    );
}