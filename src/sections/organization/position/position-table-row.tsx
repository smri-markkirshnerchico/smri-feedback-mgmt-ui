import { TableCell, TableRow } from "@mui/material";
import { Label } from "src/components/label";
import { IPosition } from "src/types/position";

export type Props = {
    row: IPosition
}

export function PositionTableRow({ row }: Readonly<Props>) {
    return <TableRow>
        <TableCell>{row.PositionCode}</TableCell>
        <TableCell>{row.PositionLongDesc}</TableCell>
        <TableCell>
            <Label color={row.IsActive ? "success" : "error"}>
                {row.IsActive ? "Active" : "Inactive"}
            </Label>
        </TableCell>
    </TableRow>
}