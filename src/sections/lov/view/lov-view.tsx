'use client';

import { Box, Button, Card, Table, TableBody, TablePagination } from "@mui/material";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { MainContent } from "src/layouts/main";
import { LOVTableForm } from "../lov-table-form";
import { Iconify } from "src/components/iconify";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, getComparator, useTable } from "src/components/table";
import { useEffect, useState } from "react";
import { LOVFilter, ListOfValueDto } from "src/types/lov";
import { Scrollbar } from "src/components/scrollbar";
import { LOVTableRow } from "../lov-table-row";
import { GetLOVList } from "src/api/admin/lov";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { getSessionApplications, getSessionModules } from "src/api/admin/session";
import { LOVTableToolbar } from "../lov-table-toolbar";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'LOVGroup', label: 'Group' },
    { id: 'IsActive', label: 'Status' },
    { id: '', label: 'Action', width: "10%", align: "center" },
];

export function LovView() {

    const table = useTable({ defaultRowsPerPage: 10 });

    const { lov, lovLoading, lovValidating, lovMutate } = GetLOVList();

    const [tableData, setTableData] = useState<ListOfValueDto[]>(lov);

    const { sessionModules, sessionModulesLoading } = getSessionModules();

    useEffect(() => {
        if (lov && !lovLoading) {
            setTableData(lov);
        }
    }, [lov, lovLoading])

    const filters = useSetState<LOVFilter>({
        ModuleId: '',
        Keyword: ''
    });

    const { state: currentFilters } = filters;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters
    });


    const DialogForm = useBoolean();
    const [current, setCurrent] = useState<ListOfValueDto>();

    const renderDialogForm = () => {
        return <LOVTableForm
            open={DialogForm.value}
            onClose={DialogForm.onFalse}
            current={current}
            mutateLOV={lovMutate}
            sessionModules={sessionModules}
            sessionModulesLoading={sessionModulesLoading}
        />
    }

    const handleOpenDialog = () => {
        setCurrent(undefined);
        DialogForm.onTrue();
    }

    const handleDitDialog = (row: ListOfValueDto) => {
        setCurrent(row);
        DialogForm.onTrue();
    }

    return (
        <MainContent maxWidth="xl">
            {DialogForm.value && renderDialogForm()}
            <CustomBreadcrumbs
                action={
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDialog}
                        startIcon={
                            <Iconify icon="ic:baseline-add" />
                        }
                    >
                        Add New
                    </Button>
                }
            />
            <Card sx={{
                mt: 3
            }}>
                <Box sx={{
                    position: 'relative'
                }}>
                    <LOVTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
                        sessionModules={sessionModules}
                    />
                    <Scrollbar>
                        <Table sx={{ minWidth: 960 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headCells={TABLE_HEAD}
                                rowCount={dataFiltered.length}
                                onSort={table.onSort}
                            />
                            <TableBody>
                                {lovValidating ? (
                                    <TableSkeleton
                                        rowCount={table.rowsPerPage}
                                        cellCount={TABLE_HEAD.length}
                                    />
                                ) : (
                                    dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <LOVTableRow
                                                key={row.LOVID}
                                                row={row}
                                                onEdit={() => handleDitDialog(row)}
                                            />
                                        ))
                                )}

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
    inputData: ListOfValueDto[];
    filters: LOVFilter;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const {
        // AppId,
        ModuleId, Keyword } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    // if (AppId) {
    //     inputData = inputData.filter((list) => list.Access.some((a) => a.AppId === AppId));
    // }

    if (ModuleId) {
        inputData = inputData.filter((list) =>
            list.Values.some((a) =>
                a.Modules.some((m) => m.ModuleId === ModuleId)
            )
        );
    }

    if (Keyword) {
        const loweredKeyword = Keyword.toLowerCase();

        inputData = inputData.filter((list) =>
            list.LOVGroup?.toLowerCase().includes(loweredKeyword) ||
            list.Values.some(x => x.LOVCode.toLowerCase().includes(loweredKeyword)) ||
            list.Values.some(x => x.LOVDescription.toLowerCase().includes(loweredKeyword))
            // list.Access.some(x => x.AppName.toLowerCase().includes(loweredKeyword)) ||
            // list.Access.some(x => x.Modules.some((y) => y.ModuleName.toLowerCase().includes(loweredKeyword)))
        );
    }

    return inputData;
}
