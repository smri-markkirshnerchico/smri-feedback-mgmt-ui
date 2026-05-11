import { Box, Collapse, IconButton, Paper, TableCell, TableRow } from "@mui/material"
import { useBoolean } from "minimal-shared/hooks"
import { Iconify } from "src/components/iconify"
import { IPosBranch } from "src/types/position-hierarchy"
import { PosDivisionTable } from "./pos-division-table"

export type Props = {
    currentBranch: IPosBranch
}

export function PosBranchTableRow({ currentBranch }: Readonly<Props>) {

    const collapseDivision = useBoolean();

    const renderBranch = () => {
        return <TableRow>

            <TableCell>{currentBranch.BranchCode}</TableCell>
            <TableCell>{currentBranch.BranchDesc}</TableCell>
            <TableCell>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Box>
                        <IconButton
                            color={collapseDivision.value ? 'inherit' : 'default'}
                            onClick={collapseDivision.onToggle}
                            sx={{ ...(collapseDivision.value && { bgcolor: 'action.hover' }) }}
                        >
                            <Iconify icon="eva:arrow-ios-downward-fill" />
                        </IconButton>
                    </Box>
                </Box>
            </TableCell>
        </TableRow>
    }

    const renderDivision = () => {
        return <TableRow>
            <TableCell sx={{ p: 0, border: 'none' }} colSpan={3}>
                <Collapse
                    in={collapseDivision.value}
                    timeout="auto"
                    unmountOnExit
                    sx={{ bgcolor: 'background.neutral' }}
                >
                    <Paper sx={{ m: 1.5 }}>
                        <PosDivisionTable posDivisions={currentBranch.Divisions ?? []} />
                    </Paper>
                </Collapse>
            </TableCell>
        </TableRow>
    }

    return (
        <>
            {renderBranch()}
            {renderDivision()}
        </>
    )
}