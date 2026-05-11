import { Table, TableBody } from "@mui/material";
import { TableHeadCellProps, TableHeadCustom, useTable } from "src/components/table";
import { IOrgDepartment } from "src/types/organization-hierarchy"
import { OrgDepartmentRow } from "./org-department-row";

export type Props = {
    departments: IOrgDepartment[];
}

export const TABLE_HEAD_DEPARTMENT: TableHeadCellProps[] = [
    { id: 'DepartmentCode', label: 'Department Code', width: "20%" },
    { id: 'DepartmentDesc', label: "Department Description", width: "80%" },
]


export function OrgDepartmentTable({ departments }: Readonly<Props>) {
    const table = useTable();
    return <Table>
        <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headCells={TABLE_HEAD_DEPARTMENT}
            rowCount={departments.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
        />

        <TableBody>
            {departments.slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
            ).map((department: IOrgDepartment, index) => (
                <OrgDepartmentRow
                    key={index}
                    currentDepartment={department}
                />
            ))}
        </TableBody>

    </Table>
}