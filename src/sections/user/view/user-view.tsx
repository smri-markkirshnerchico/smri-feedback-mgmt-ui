'use client'

import { Box, Button, Card, Table, TableBody, TablePagination } from "@mui/material";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, getComparator, useTable } from "src/components/table";
import { MainContent } from "src/layouts/main";
import { IUserDto, IUserFilter } from "src/types/user";
import { UserTableToolbar } from "../user-table-toolbar";
import { UserForm } from "../user-form";
import { Scrollbar } from "src/components/scrollbar";
import { GetUserList } from "src/api/admin/user";
import { UserTableRow } from "../user-table-row";
import { GetLOVByGroup } from "src/api/admin/lov";
import { getSessionBranches, getSessionCompanies } from "src/api/admin/session";
import { ICompany } from "src/types/company";
import { ISessionBranches, ISessionCompanies } from "src/types/session";


const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'FullName', label: 'Name' },
    { id: 'EmployeeNumber', label: 'Emp Number' },
    { id: 'SSSNumber', label: 'SSS Number' },
    { id: 'CompanyDesc', label: 'Company' },
    { id: 'BranchDesc', label: 'Branch' },
    { id: 'IsActive', label: 'Status', width: 100 },
    { id: '', width: 88 },
];

export function UserView() {

    const table = useTable({ defaultRowsPerPage: 10 });
    const DialogForm = useBoolean();
    const [currentUser, setCurrentUser] = useState<IUserDto | undefined>();

    const [appId, setAppId] = useState<string>('');

    const handleSelectApp = useCallback((item: string) => {
        setAppId(item);
    }, []);

    const { user, userLoading, userMutate } = GetUserList(appId);

    const [tableData, setTableData] = useState<IUserDto[]>(user);

    const handleOpenDialog = () => {
        setCurrentUser(undefined);
        DialogForm.onTrue();
    }
    useEffect(() => {
        if (user && !userLoading) {
            setTableData(user);
        }
    }, [user, userLoading])

    const handleEditUser = (currentUser: IUserDto) => {
        setCurrentUser(currentUser);
        DialogForm.onTrue();
    }

    const filters = useSetState<IUserFilter>({
        Keyword: '',
        Company: '',
        Branch: '',
        Responsibility: ''
    });

    const { state: currentFilters } = filters;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters
    });
    const renderDialogForm = () => {
        return <UserForm
            open={DialogForm.value}
            onClose={DialogForm.onFalse}
            current={currentUser}
            mutateUser={userMutate}
        />
    }

    const { sessionCompanies } = getSessionCompanies();
    const { sessionBranches } = getSessionBranches(currentFilters.Company);

    const recordCompanies = Object.fromEntries(sessionCompanies.map((x: ISessionCompanies) => [String(x.CompanyCode), String(x.CompanyDesc)]));
    const recordBranches = Object.fromEntries(sessionBranches.map((x: ISessionBranches) => [String(x.BranchCode), String(x.BranchDesc)]));

    const { lovGroup: profileGroup, lovGroupLoading: profileGroupLoading } = GetLOVByGroup('NameAvatar');

    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        if (profileGroup && !profileGroupLoading) {
            const imgUrl = profileGroup.Values.find((g) => g.LOVCode == 'AVATAR')?.LOVDescription;
            setImageUrl(imgUrl ?? '');
        }
    }, [profileGroup, profileGroupLoading]);


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
                <Box sx={{ position: 'relative' }}>
                    <UserTableToolbar
                        onResetPage={table.onResetPage}
                        filters={filters}
                        companies={recordCompanies}
                        branches={recordBranches}
                        onSelectApp={handleSelectApp}
                        selectedApp={appId}
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
                                {userLoading ? (
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
                                            <UserTableRow
                                                key={row.UserId}
                                                row={row}
                                                onEdit={() => handleEditUser(row)}
                                                imageUrl={imageUrl}
                                                mutateUrl={userMutate}

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
    inputData: IUserDto[];
    filters: IUserFilter;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const { Keyword, Company, Branch, Responsibility } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (Company) {
        inputData = inputData.filter((list) => list.CompanyCode === Company);
    }
    if (Branch) {
        inputData = inputData.filter((list) => list.BranchCode === Branch);
    }
    if (Responsibility) {
        inputData = inputData.filter((list) => list.Responsibility.some((r) => r === Responsibility));
    }

    if (Keyword) {
        const loweredKeyword = Keyword.toLowerCase();

        inputData = inputData.filter((list) =>
            list.FirstName?.toLowerCase().includes(loweredKeyword) ||
            list.MiddleName?.toLowerCase().includes(loweredKeyword) ||
            list.LastName?.toLowerCase().includes(loweredKeyword) ||
            list.SssNo?.toLowerCase().includes(loweredKeyword) ||
            list.EmailAddress?.toLowerCase().includes(loweredKeyword) ||
            list.EmpId?.toLowerCase().includes(loweredKeyword)
        );
    }

    return inputData;
}
