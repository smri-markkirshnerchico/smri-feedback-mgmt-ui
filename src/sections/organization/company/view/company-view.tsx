'use client'

import { Box, Card, Table, TableBody, TablePagination } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { MainContent } from "src/layouts/main";
import { CompanyTableToolbar } from "../company-table-toolbar";
import { Scrollbar } from "src/components/scrollbar";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, getComparator, useTable } from "src/components/table";
import { GetCompanies } from "src/api/admin/company";
import { CompanyTableRow } from "../company-table-row";
import { ICompany } from "src/types/company";
import { useEffect, useState } from "react";
import { useSetState } from "minimal-shared/hooks";
import { ICommonFilter } from "src/types/_common";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'CompanyCode', label: 'Code' },
    { id: 'CompanyDesc', label: 'Description' },
    { id: 'Alias', label: "Alias" },
    { id: '', label: 'Status' }
]

export function CompanyView() {

    const table = useTable({ defaultRowsPerPage: 10 });

    const { companies, companiesValidating, companiesLoading } = GetCompanies();
    const [tableData, setTableData] = useState<ICompany[]>(companies);

    useEffect(() => {
        if (companies && !companiesLoading) {
            setTableData(companies);
        }
    }, [companies, companiesLoading]);


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
                <CompanyTableToolbar
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
                                {companiesValidating ? (
                                    <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                                ) : (
                                    dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row: ICompany) => (
                                            <CompanyTableRow
                                                key={row.CompanyCode}
                                                row={row}
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
    inputData: ICompany[];
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
            list.CompanyCode?.toLowerCase().includes(loweredKeyword) ||
            list.CompanyDesc?.toLowerCase().includes(loweredKeyword) ||
            list.CompanyAlias?.toLowerCase().includes(loweredKeyword)
        );
    }

    return inputData;
}
