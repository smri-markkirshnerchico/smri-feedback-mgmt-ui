'use client'

import { Box, Button, Card, Dialog, DialogActions, DialogContent, Table, TableBody, TablePagination, TextField } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, useTable } from "src/components/table";
import { MainContent } from "src/layouts/main";
import { HolidaySetupToolbar } from "../holiday-setup-toolbar";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { ICommonFilter } from "src/types/_common";
import { IHoliday } from "src/types/holiday";
import { Scrollbar } from "src/components/scrollbar";
import { HolidaySetupRow } from "../holiday-setup-row";
import { useEffect, useState } from "react";
import { HolidaySetupForm } from "../holiday-setup-form";
import { GetHolidays } from "src/api/admin/holiday";
import { IGeoHierarchyToTown } from "src/types/geographical-hierarchy";
import { GetGeographicalHierarchies } from "src/api/admin/geographical-hierarchy";
import { HolidaySetupRecurringForm } from "../holiday-setup-recurring-form";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'HolidayName', label: 'Holiday Name', width: 150 },
    { id: 'HolidayType', label: 'Type', width: 150 },
    { id: 'Date', label: 'Date', width: 100 },
    { id: 'IsFixed', label: "Fixed", align: "center" },
    { id: 'IsNational', label: "National", align: "center" },
    { id: '', label: 'Action', align: "center" }
]

export function HolidaySetupView() {

    const table = useTable({ defaultRowsPerPage: 10 })

    const { holidays, holidaysLoading, holidaysValidating, holidaysMutate } = GetHolidays();

    const dateToday = new Date();

    const [tableData, setTableData] = useState<IHoliday[]>(holidays);

    const { geoHierarchies, geoHierarchiesLoading } = GetGeographicalHierarchies();

    const [townData, setTownData] = useState<IGeoHierarchyToTown[]>([]);

    useEffect(() => {
        if (geoHierarchies && !geoHierarchiesLoading) {
            const flattenedData: IGeoHierarchyToTown[] = geoHierarchies.flatMap(region =>
                region.Provinces.flatMap(province =>
                    province.Towns.map(town => ({
                        RegionName: region.RegionName,
                        ProvinceName: province.ProvinceName,
                        TownCode: town.TownCode,
                        TownDesc: town.TownDesc,
                        TownName: town.TownName,
                    }))
                )
            );

            setTownData(flattenedData);
        }
    }, [geoHierarchies, geoHierarchiesLoading]);


    useEffect(() => {
        if (holidays && !holidaysLoading) {

            const filteredHolidays = holidays.filter((h: IHoliday) =>
                (h.IsFixed &&
                    h.IsRecurring) ||
                h.HolidayDates?.some(d => new Date(d).getFullYear() === dateToday.getFullYear())
            );

            setTableData(filteredHolidays);
        }
    }, [holidays, holidaysLoading]);

    const filters = useSetState<ICommonFilter>({
        Keyword: ''
    });

    const { state: currentFilters } = filters;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters
    });

    const [currentHoliday, setCurrentHoliday] = useState<IHoliday | undefined>(undefined);
    const DialogCreateUpdateHoliday = useBoolean();
    const handleCreateNewHoliday = () => {

        setCurrentHoliday(undefined);
        DialogCreateUpdateHoliday.onTrue();
    }

    const handleEditHoliday = (data: IHoliday) => {
        setCurrentHoliday(data);
        DialogCreateUpdateHoliday.onTrue();
    }

    const renderHolidayForm = () => {
        return <HolidaySetupForm
            open={DialogCreateUpdateHoliday.value}
            onClose={DialogCreateUpdateHoliday.onFalse}
            currentHoliday={currentHoliday}
            mutateData={holidaysMutate}
            towns={townData}
        />
    }

    const DialogRecurringForm = useBoolean();

    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const renderSetupRecurringForm = () => {
        if (selectedYear) {
            return <HolidaySetupRecurringForm
                open={DialogRecurringForm.value}
                onClose={DialogRecurringForm.onFalse}
                year={selectedYear}
                holidays={holidays}
                mutate={holidaysMutate}
            />
        }
    }

    return <MainContent maxWidth="xl">
        {DialogRecurringForm.value && renderSetupRecurringForm()}
        {DialogCreateUpdateHoliday.value && renderHolidayForm()}
        <CustomBreadcrumbs
            customTitle="Holiday Setup"
            action={
                <Box sx={{ gap: 1, display: "flex" }}>
                    <Button variant="outlined" color="primary" onClick={handleCreateNewHoliday}>
                        Add New
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => {
                        setSelectedYear(dateToday.getFullYear() + 1);
                        DialogRecurringForm.onTrue();
                    }}>
                        Setup Holiday For Next Year
                    </Button>
                </Box>
            }
        />
        <Card>
            <HolidaySetupToolbar
                filters={filters}
                onResetPage={table.onResetPage}
            />

            <Box sx={{ position: 'relative' }}>
                <Scrollbar>
                    <Table sx={{ minWidth: 960 }}>
                        <TableHeadCustom
                            order={table.order}
                            orderBy={table.orderBy}
                            headCells={TABLE_HEAD}
                            rowCount={dataFiltered.length}
                            numSelected={table.selected.length}
                            onSort={table.onSort}
                        />

                        <TableBody>
                            {holidaysValidating ? (
                                <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                            ) : (
                                dataFiltered
                                    .slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    )
                                    .map((row: IHoliday) => (
                                        <HolidaySetupRow
                                            key={row.HolidayId}
                                            row={row}
                                            onEdit={() => handleEditHoliday(row)}
                                        />
                                    )))}

                            <TableEmptyRows
                                height={56}
                                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                            />

                            <TableNoData notFound={dataFiltered.length <= 0} />
                        </TableBody>
                        <TablePagination
                            page={table.page}
                            count={dataFiltered.length}
                            rowsPerPage={table.rowsPerPage}
                            onPageChange={table.onChangePage}
                            onRowsPerPageChange={table.onChangeRowsPerPage}
                        />
                    </Table>
                </Scrollbar>
            </Box>

        </Card>
    </MainContent>
}

function getComparator(order: 'asc' | 'desc', orderBy: string) {
    const year = new Date().getFullYear();

    return (a: IHoliday, b: IHoliday) => {
        let valueA: any;
        let valueB: any;

        switch (orderBy) {
            case 'HolidayName':
            case 'HolidayType':
                valueA = a[orderBy]?.toLowerCase() ?? '';
                valueB = b[orderBy]?.toLowerCase() ?? '';
                break;
            case 'Date':
                valueA = getEffectiveDate(a, year).getTime();
                valueB = getEffectiveDate(b, year).getTime();
                break;
            case 'IsFixed':
            case 'IsNational':
                valueA = a[orderBy] ? 1 : 0;
                valueB = b[orderBy] ? 1 : 0;
                break;
            default:
                valueA = a[orderBy as keyof IHoliday];
                valueB = b[orderBy as keyof IHoliday];
        }

        if (valueA < valueB) return order === 'asc' ? -1 : 1;
        if (valueA > valueB) return order === 'asc' ? 1 : -1;
        return 0;
    };
}
const holidayDateComparator = (year: number) =>
    (a: IHoliday, b: IHoliday) => {
        const dateA = getEffectiveDate(a, year).getTime();
        const dateB = getEffectiveDate(b, year).getTime();

        return dateA - dateB;
    };

type ApplyFilterProps = {
    inputData: IHoliday[];
    filters: ICommonFilter;
    comparator: (a: IHoliday, b: IHoliday) => number;
};

const getEffectiveDate = (holiday: IHoliday, year: number): Date => {
    if (holiday.HolidayDates?.length) {
        const datesInYear = holiday.HolidayDates
            .map(d => new Date(d))
            .filter(d => d.getFullYear() === year)
            .sort((a, b) => a.getTime() - b.getTime());
        if (datesInYear.length > 0) return datesInYear[0];
    }
    if (holiday.Month && holiday.Day) {
        return new Date(year, holiday.Month - 1, holiday.Day);
    }
    // fallback to end of year
    return new Date(year, 11, 31, 23, 59, 59);
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const { Keyword } = filters;

    // Stabilize index for stable sort
    const stabilized = inputData.map((el, index) => [el, index] as const);

    stabilized.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    let result = stabilized.map(el => el[0]);

    if (Keyword) {
        const loweredKeyword = Keyword.toLowerCase();
        result = result.filter(
            h =>
                h.HolidayName?.toLowerCase().includes(loweredKeyword) ||
                h.HolidayType?.toLowerCase().includes(loweredKeyword)
        );
    }

    return result;
}