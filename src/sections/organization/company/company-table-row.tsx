import { TableCell, TableRow } from "@mui/material";
import { Label } from "src/components/label";
import { ICompany } from "src/types/company";

export type Props = {
    row: ICompany
}

export function CompanyTableRow({ row }: Readonly<Props>) {
    return <TableRow>
        <TableCell>{row.CompanyCode}</TableCell>
        <TableCell>{row.CompanyDesc}</TableCell>
        <TableCell>{row.CompanyAlias}</TableCell>
        <TableCell>
            <Label color={row.IsActive ? "success" : "error"}>
                {row.IsActive ? "Active" : "Inactive"}
            </Label>
        </TableCell>
    </TableRow>
}