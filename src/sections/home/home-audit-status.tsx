import type { CardProps } from '@mui/material/Card';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
    title?: string;
    subheader?: string;
};

export type ApplicationProgress = {
    application: string;
    value: number;
    quantity: number;
};

export function HomeAuditStatus({ title, subheader, sx, ...other }: Props) {


    const data: ApplicationProgress[] = [
        {
            application: 'Supply Chain',
            value: 60,
            quantity: 1020,
        },
        {
            application: 'DataHub',
            value: 35,
            quantity: 300,
        },
        {
            application: 'Capacity Planning',
            value: 25,
            quantity: 120,
        },
    ];

    return (
        <Card sx={sx} {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Box
                component="ul"
                sx={{
                    p: 3,
                    gap: 3,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {data.map((item, index) => (
                    <li key={item.application}>
                        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ typography: 'overline', flexGrow: 1 }}>
                                {item.application}
                            </Box>

                            <Box sx={{ typography: 'subtitle1' }}>
                                {fShortenNumber(item.quantity)}
                            </Box>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={item.value}
                            sx={[
                                (theme) => {
                                    const gradients = [
                                        `linear-gradient(135deg, ${theme.vars.palette.warning.light} 0%, ${theme.vars.palette.warning.main} 100%)`,
                                        `linear-gradient(135deg, ${theme.vars.palette.error.light} 0%, ${theme.vars.palette.error.main} 100%)`,
                                        `linear-gradient(135deg, ${theme.vars.palette.success.light} 0%, ${theme.vars.palette.success.main} 100%)`,
                                        `linear-gradient(135deg, ${theme.vars.palette.info.light} 0%, ${theme.vars.palette.info.main} 100%)`,
                                    ];

                                    return {
                                        height: 8,
                                        bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
                                        [`& .${linearProgressClasses.bar}`]: {
                                            background: gradients[index] ?? gradients[2],
                                        },
                                    };
                                },
                            ]}
                        />
                    </li>
                ))}

            </Box>
        </Card>
    );
}
