import { TableCell, TableRow } from "@mui/material";
import { Label } from "src/components/label";
import { ICompanyGroup } from "src/types/company-group";

export type Props = {
    row: ICompanyGroup
}

export function CompanyGroupTableRow({ row }: Readonly<Props>) {
    return <TableRow>
        <TableCell>{row.GroupCode}</TableCell>
        <TableCell>{row.GroupDesc}</TableCell>
        <TableCell>
            <Label color={row.IsActive ? "success" : "error"}>
                {row.IsActive ? "Active" : "Inactive"}
            </Label>
        </TableCell>
    </TableRow>
}