import { Card, CardHeader, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@mui/material";
import dayjs from "dayjs";
import { uuidv4 } from "minimal-shared/utils";
import { useMemo } from "react";
import { GetHolidays } from "src/api/admin/holiday";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, useTable } from "src/components/table";
import { IHoliday } from "src/types/holiday";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: "", label: "Event Name" },
    { id: "Date", label: "Event Date" }
]

type NormalizedHoliday = IHoliday & {
    displayDates: string[];
};

export function HomeCalendarView() {

    const table = useTable({ defaultRowsPerPage: 5 });

    const { holidays, holidaysValidating } = GetHolidays();

    const currentYear = new Date().getFullYear();

    const holidaysThisYear = useMemo<NormalizedHoliday[]>(() => {
        if (!holidays) return [];

        return holidays
            .map((h: IHoliday) => {
                if (h.HolidayDates?.length) {
                    const dates = h.HolidayDates
                        .filter(d => new Date(d).getFullYear() === currentYear)
                        .map(d => dayjs(d).format("MMM DD, YYYY"));

                    return dates.length ? { ...h, displayDates: dates } : null;
                }

                if (h.IsFixed && h.Month && h.Day) {
                    const d = new Date(currentYear, h.Month - 1, h.Day)
                        .toISOString()
                        .split("T")[0];

                    const holidayDate = dayjs(d).format("MMM DD, YYYY");
                    return { ...h, displayDates: [holidayDate] };
                }

                return null;
            })
            .filter(Boolean) as NormalizedHoliday[];
    }, [holidays, currentYear]);

    return (
        <Card sx={{ flex: 1 }}>
            <CardHeader title={"Holiday and Events"} sx={{ mb: 2 }} />
            <TableContainer>
                <Table>
                    <TableHeadCustom
                        order={table.order}
                        orderBy={table.orderBy}
                        headCells={TABLE_HEAD}
                        rowCount={holidaysThisYear.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                    />

                    <TableBody>
                        {holidaysValidating ? (
                            <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                        ) : (
                            holidaysThisYear
                                .slice(
                                    table.page * table.rowsPerPage,
                                    table.page * table.rowsPerPage + table.rowsPerPage
                                )
                                .map((row: NormalizedHoliday) => (
                                    <TableRow key={row.HolidayId ?? uuidv4()}>
                                        <TableCell>
                                            {row.HolidayName}
                                        </TableCell>
                                        <TableCell>

                                            {row.displayDates.join(", ")}
                                        </TableCell>
                                    </TableRow>
                                )))}

                        <TableEmptyRows
                            height={56}
                            emptyRows={emptyRows(table.page, table.rowsPerPage, holidaysThisYear.length)}
                        />

                        <TableNoData notFound={holidaysThisYear.length <= 0} />
                    </TableBody>
                    <TablePagination
                        page={table.page}
                        count={holidaysThisYear.length}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </Table>
            </TableContainer>
        </Card>
    )
}