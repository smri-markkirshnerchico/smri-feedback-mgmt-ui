import { IconButton, Switch, TableCell, TableRow, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { Iconify } from "src/components/iconify";
import { IHoliday } from "src/types/holiday";

export type Props = {
    row: IHoliday;
    onEdit: () => void;
}

export function HolidaySetupRow({ row, onEdit }: Readonly<Props>) {

    const dateToday = new Date();
    const currentYear = dateToday.getFullYear();
    const validDate = row.HolidayDates?.find(x => {
        const d = new Date(x);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear;
    });

    const displayDate = validDate
        ? dayjs(validDate).format("MMMM DD, YYYY")
        : row.Month && row.Day
            ? dayjs(new Date(currentYear, row.Month - 1, row.Day))
                .format("MMMM DD, YYYY")
            : "-";
    return <TableRow>
        <TableCell>{row.HolidayName}</TableCell>
        <TableCell>{row.HolidayType}</TableCell>
        <TableCell>{displayDate}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
            <Switch checked={row.IsFixed} disabled />
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
            <Switch checked={row.IsNational} disabled />
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
            <Tooltip title="Edit Holiday">
                <IconButton onClick={onEdit}>
                    <Iconify icon="solar:pen-bold" />
                </IconButton>
            </Tooltip>
        </TableCell>
    </TableRow>
}