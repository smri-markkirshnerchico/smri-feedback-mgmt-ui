import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TablePagination, TableRow, Typography } from "@mui/material";
import { IOrgBranch, IOrgDepartment, IOrgDivision, IOrganizationalHierarchy } from "src/types/organization-hierarchy";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import { TableHeadCellProps, TableHeadCustom, useTable } from "src/components/table";
import { useBoolean } from "minimal-shared/hooks";
import { OrgBranchRow } from "./org-branch-row";

export type Props = {
    open: boolean;
    onClose: () => void;
    current: IOrganizationalHierarchy;
}

export const TABLE_HEAD_BRANCH: TableHeadCellProps[] = [
    { id: 'BranchCode', label: 'Branch Code', width: "20%" },
    { id: 'BranchDesc', label: "Branch Description", width: "75%" },
    { id: '', label: 'Action', width: "5%" }
]

export function OrganizationalHierarchyDialog({ open, onClose, current }: Readonly<Props>) {

    const table = useTable();
    const openCollapse = useBoolean();

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" >
        <DialogTitle>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Typography variant="h6">
                    {current.CompanyDesc} Organization
                </Typography>
                <IconButton onClick={onClose}>
                    <Iconify icon="ic:baseline-close" />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent>
            <Table>
                <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headCells={TABLE_HEAD_BRANCH}
                    rowCount={current.Branches.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                />

                <TableBody>
                    {current.Branches.slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                    ).map((branch: IOrgBranch, index) => (
                        <OrgBranchRow
                            key={index}
                            branch={branch}
                        />
                    ))}
                    <TablePagination
                        page={table.page}
                        count={current.Branches.length}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </TableBody>

            </Table>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
}