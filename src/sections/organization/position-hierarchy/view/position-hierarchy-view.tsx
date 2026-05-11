'use client'

import { Box, Card, Table, TableBody, TablePagination } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { MainContent } from "src/layouts/main";
import { Scrollbar } from "src/components/scrollbar";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, getComparator, useTable } from "src/components/table";
import { useEffect, useState } from "react";
import { useSetState } from "minimal-shared/hooks";
import { ICommonFilter } from "src/types/_common";
import { IOrganizationalHierarchy } from "src/types/organization-hierarchy";
import { GetPositionHierarchies } from "src/api/admin/position-hierarchy";
import { IPositionHierarchy } from "src/types/position-hierarchy";
import { PositionHierarchyTableRow } from "../position-hierarchy-table-row";
import { PositionHierarchyTableToolbar } from "../position-hierarchy-table-toolbar";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'PositionCode', label: 'Position Code', width: "20%" },
    { id: 'PositionLongDesc', label: 'Position Description', width: "75%" },
    { id: '', label: 'Action', width: "5%" },
]

export function PositionHierarchyView() {

    const table = useTable({ defaultRowsPerPage: 10 });

    const { positionHierarchies, positionHierarchiesLoading, positionHierarchiesValidating } = GetPositionHierarchies();
    const [tableData, setTableData] = useState<IPositionHierarchy[]>(positionHierarchies);

    useEffect(() => {
        if (positionHierarchies && !positionHierarchiesLoading) {
            setTableData(positionHierarchies);
        }
    }, [positionHierarchies, positionHierarchiesLoading]);


    const filters = useSetState<ICommonFilter>({
        Keyword: ''
    });


    const { state: currentFilters } = filters;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters
    });

    return (
        <MainContent>
            <CustomBreadcrumbs />

            <Card>

                <PositionHierarchyTableToolbar
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
                                {positionHierarchiesValidating ? (
                                    <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                                ) : (
                                    dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row: IPositionHierarchy, index) => (
                                            <PositionHierarchyTableRow
                                                currentRow={row}
                                                key={row.PositionCode}
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
    )
}


type ApplyFilterProps = {
    inputData: IPositionHierarchy[];
    filters: ICommonFilter;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const { Keyword } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (Keyword) {
        const loweredKeyword = Keyword.toLowerCase();

        inputData = inputData.filter((list) =>
            list.PositionCode?.toLowerCase().includes(loweredKeyword) ||
            list.PositionLongDesc?.toLowerCase().includes(loweredKeyword)
        );
    }

    return inputData;
}
