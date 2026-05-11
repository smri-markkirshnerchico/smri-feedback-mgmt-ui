import { Box, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { GetCalendarEventsByStoreLocId } from "src/api/admin/sm-events";

export type Props = {
    stLocId: number;
}

export function StoreLocationAllEvents({ stLocId }: Readonly<Props>) {
    const { calendarEvents: rawEvents } = GetCalendarEventsByStoreLocId(stLocId);

    return (
        <TableRow>
            <TableCell colSpan={6}>
                {rawEvents.length > 0 &&
                    rawEvents.map((row) => (
                        <Box
                            key={row.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                py: 1
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ flex: 1 }}
                            >
                                {row.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ flex: 1 }}
                            >
                                Start Date: {dayjs(row.start).format("MMMM DD, YYYY")}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ flex: 1 }}
                            >
                                End Date: {dayjs(row.end).format("MMMM DD, YYYY")}
                            </Typography>
                        </Box>
                    ))}
            </TableCell>
        </TableRow>
    );
}