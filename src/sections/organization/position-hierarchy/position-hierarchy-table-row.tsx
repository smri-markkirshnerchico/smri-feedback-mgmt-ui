import { Box, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { IPositionHierarchy } from "src/types/position-hierarchy";
import { PositionHierarchyMap } from "./components/position-hierarchy-map";

export type Props = {
    currentRow: IPositionHierarchy;
}

export function PositionHierarchyTableRow({ currentRow }: Readonly<Props>) {

    const openDialog = useBoolean();

    const renderPrimaryRow = () => {
        return <TableRow>
            <TableCell>{currentRow.PositionCode}</TableCell>
            <TableCell>{currentRow.PositionLongDesc}</TableCell>
            <TableCell>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Box>
                        <IconButton
                            color={openDialog.value ? 'inherit' : 'default'}
                            onClick={openDialog.onToggle}
                            sx={{ ...(openDialog.value && { bgcolor: 'action.hover' }) }}
                        >
                            <Iconify icon="solar:eye-linear" />
                        </IconButton>
                    </Box>
                </Box>
            </TableCell>
        </TableRow>
    }

    const renderHierarchyData = () => {
        return <PositionHierarchyMap
            open={openDialog.value}
            onClose={openDialog.onFalse}
            current={currentRow}
        />
    }

    return (
        <>
            {renderPrimaryRow()}
            {openDialog.value && renderHierarchyData()}
        </>
    )
}