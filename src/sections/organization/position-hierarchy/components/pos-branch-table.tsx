import { Table, TableBody } from "@mui/material";
import { TableHeadCellProps, TableHeadCustom, useTable } from "src/components/table";
import { IPosBranch, IPosDivision } from "src/types/position-hierarchy"
import { PosBranchTableRow } from "./pos-branch-table-row";

export type Props = {
    posBranch: IPosBranch[]
}


export const TABLE_HEAD_BRANCH: TableHeadCellProps[] = [
    { id: 'BranchCode', label: 'Branch Code', width: "20%" },
    { id: 'BranchDesc', label: "Branch Description", width: "75%" },
    { id: '', label: 'Action', width: "5%" }
]

export function PosBranchTable({ posBranch }: Readonly<Props>) {

    const table = useTable({ defaultRowsPerPage: 5 })

    return <Table>
        <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headCells={TABLE_HEAD_BRANCH}
            rowCount={posBranch.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
        />
        <TableBody>
            {posBranch.slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
            ).map((branch: IPosBranch, index) => (
                <PosBranchTableRow
                    key={index}
                    currentBranch={branch}
                />
            ))}
        </TableBody>

    </Table>
}