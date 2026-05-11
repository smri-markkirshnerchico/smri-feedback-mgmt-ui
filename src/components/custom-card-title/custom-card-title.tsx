import { Box, Divider, Typography, useTheme } from "@mui/material";

export type Props = {
    title: string;
}

export function CustomCardTitle({ title }: Readonly<Props>) {
    const theme = useTheme();
    return <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
        <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
            {title}
        </Typography>
        <Divider
            sx={{
                ml: 2,
                flexGrow: 1,
                borderTop: `1px solid ${theme.palette.primary.main}`,
            }}
        />
    </Box>
}