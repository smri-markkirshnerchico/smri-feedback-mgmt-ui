'use client'

import { Box, Card, Table, TableBody, TablePagination } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { MainContent } from "src/layouts/main";
import { Scrollbar } from "src/components/scrollbar";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, getComparator, useTable } from "src/components/table";
import { useEffect, useState } from "react";
import { useSetState } from "minimal-shared/hooks";
import { ICommonFilter } from "src/types/_common";
import { GetOrgHierarchies } from "src/api/admin/organizational-hierarchy";
import { IOrganizationalHierarchy } from "src/types/organization-hierarchy";
import { OrgHierarchyTableToolbar } from "../organization-hierarchy-table-toolbar";
import { OrgHierarchyTableRow } from "../organization-hierarchy-table-row";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'CompanyCode', label: 'Company Code', width: "20%" },
    { id: 'CompanyDesc', label: 'Company Description', width: "75%" },
    { id: '', label: 'Action', width: "5%" },
]

export function OrganizationHierarchyView() {

    const table = useTable({ defaultRowsPerPage: 10 });

    const { orgHierarchies, orgHierarchiesLoading, orgHierarchiesValidating } = GetOrgHierarchies();
    const [tableData, setTableData] = useState<IOrganizationalHierarchy[]>(orgHierarchies);

    useEffect(() => {
        if (orgHierarchies && !orgHierarchiesLoading) {
            setTableData(orgHierarchies);
        }
    }, [orgHierarchies, orgHierarchiesLoading]);


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
                <OrgHierarchyTableToolbar
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
                                {orgHierarchiesValidating ? (
                                    <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                                ) : (
                                    dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row: IOrganizationalHierarchy, index) => (
                                            <OrgHierarchyTableRow
                                                key={index}
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
    inputData: IOrganizationalHierarchy[];
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
            list.CompanyDesc?.toLowerCase().includes(loweredKeyword)
        );
    }

    return inputData;
}
