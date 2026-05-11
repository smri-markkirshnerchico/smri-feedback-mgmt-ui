import { Table, TableBody, TableRow } from "@mui/material";
import { TableHeadCellProps, TableHeadCustom, useTable } from "src/components/table";
import { IOrgDivision } from "src/types/organization-hierarchy"
import { OrgDivisionTableRow } from "./org-division-table-row";

export type Props = {
    orgDivisions: IOrgDivision[];
}
export const TABLE_HEAD_DIVISION: TableHeadCellProps[] = [
    { id: 'DivisionCode', label: 'Division Code', width: "20%" },
    { id: 'DivisionDesc', label: "Division Description", width: "75%" },
    { id: '', label: 'Action', width: "5%" }
]

export function OrgDivisionTable({ orgDivisions }: Readonly<Props>) {

    const table = useTable({ defaultRowsPerPage: 5 })

    return <Table>
        <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headCells={TABLE_HEAD_DIVISION}
            rowCount={orgDivisions.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
        />
        <TableBody>
            {orgDivisions.slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
            ).map((division: IOrgDivision, index) => (
                <OrgDivisionTableRow
                    key={index}
                    currentDivision={division}
                />
            ))}
        </TableBody>
    </Table>
}