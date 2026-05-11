import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { TableHeadCellProps, TableHeadCustom, useTable } from "src/components/table";
import { IPosDivision } from "src/types/position-hierarchy";

export type Props = {
    posDivisions: IPosDivision[];
}
export const TABLE_HEAD_DIVISION: TableHeadCellProps[] = [
    { id: 'DivisionCode', label: 'Division Code', width: "20%" },
    { id: 'DivisionDesc', label: "Division Description", width: "80%" },
]

export function PosDivisionTable({ posDivisions }: Readonly<Props>) {

    const table = useTable({ defaultRowsPerPage: 5 })

    return <Table>
        <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headCells={TABLE_HEAD_DIVISION}
            rowCount={posDivisions.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
        />
        <TableBody>
            {posDivisions.slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
            ).map((division: IPosDivision, index) => (
                <TableRow key={index}>
                    <TableCell>{division.DivisionCode}</TableCell>
                    <TableCell>{division.DivisionDesc}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}