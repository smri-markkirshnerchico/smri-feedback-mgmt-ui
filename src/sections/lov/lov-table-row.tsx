import { Badge, Box, Collapse, IconButton, Paper, TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { ListOfValueDto } from "src/types/lov"
import { LOValuesTableRowDetails } from "./components/lov-values-table-row-details";

export type Props = {
    row: ListOfValueDto;
    onEdit: () => void;
}

export function LOVTableRow({ row, onEdit }: Readonly<Props>) {
    const collapseRow = useBoolean();

    const renderSecondaryRow = () => (
        <TableRow>
            <TableCell sx={{ p: 0, border: 'none' }} colSpan={3}>
                <Collapse
                    in={collapseRow.value}
                    timeout="auto"
                    unmountOnExit
                    sx={{ bgcolor: 'background.neutral' }}
                >
                    <Paper sx={{ m: 1.5 }}>
                        <LOValuesTableRowDetails open={collapseRow.value} current={row} />
                    </Paper>
                </Collapse>
            </TableCell>
        </TableRow>
    );

    const renderPrimaryRow = () => {
        return (
            <TableRow>
                <TableCell>
                    {row.LOVGroup}
                </TableCell>
                <TableCell>
                    <Label
                        variant="soft"
                        color={(row.IsActive && 'success') || 'error'}
                    >
                        {(row.IsActive && 'Active') || 'Inactive'}
                    </Label>
                </TableCell>


                <TableCell sx={{ placeItems: "center" }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box>
                            <IconButton onClick={onEdit}>
                                <Iconify icon="solar:pen-bold" />
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton
                                color={collapseRow.value ? 'inherit' : 'default'}
                                onClick={collapseRow.onToggle}
                                sx={{ ...(collapseRow.value && { bgcolor: 'action.hover' }) }}
                            >
                                <Iconify icon="eva:arrow-ios-downward-fill" />
                            </IconButton>
                        </Box>
                    </Box>
                </TableCell>

            </TableRow>
        )
    }

    return (
        <>
            {renderPrimaryRow()}
            {renderSecondaryRow()}
        </>
    )
}