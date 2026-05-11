import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TablePagination, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { TableHeadCellProps, TableHeadCustom, useTable } from "src/components/table";
import { IPosCompany, IPositionHierarchy } from "src/types/position-hierarchy";
import { PosCompanyRow } from "./pos-company-row";

export type Props = {
    open: boolean;
    onClose: () => void;
    current: IPositionHierarchy;
}

const TABLE_HEAD_COMPANY: TableHeadCellProps[] = [
    { id: "CompanyCode", label: "Company Code", width: "20%" },
    { id: "CompanyDesc", label: "Company Description", width: "75%" },
    { id: '', label: "Action", width: "5%" }
];

export function PositionHierarchyMap({ open, onClose, current }: Readonly<Props>) {

    const table = useTable();
    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Typography variant="h6">
                    {current.PositionLongDesc}
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
                    headCells={TABLE_HEAD_COMPANY}
                    rowCount={current.Companies.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                />

                <TableBody>
                    {current.Companies.slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                    ).map((company: IPosCompany, index) => (
                        <PosCompanyRow
                            key={company.CompanyCode}
                            company={company}
                        />
                    ))}
                    <TablePagination
                        page={table.page}
                        count={current.Companies.length}
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