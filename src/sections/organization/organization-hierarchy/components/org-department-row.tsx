import { TableCell, TableRow } from "@mui/material";
import { IOrgDepartment } from "src/types/organization-hierarchy"

export type Props = {
    currentDepartment: IOrgDepartment;
}

export function OrgDepartmentRow({ currentDepartment }: Readonly<Props>) {
    return <TableRow>
        <TableCell>{currentDepartment.DepartmentCode}</TableCell>
        <TableCell>{currentDepartment.DepartmentDesc}</TableCell>
    </TableRow>
}