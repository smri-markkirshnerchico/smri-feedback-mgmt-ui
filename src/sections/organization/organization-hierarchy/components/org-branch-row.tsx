import { Box, Collapse, IconButton, Paper, TableCell, TableRow } from "@mui/material";
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { IOrgBranch } from "src/types/organization-hierarchy";
import { OrgDivisionTable } from "./org-division-table";

export type Props = {
    branch: IOrgBranch
}

export function OrgBranchRow({ branch }: Readonly<Props>) {

    const collapseDivision = useBoolean();


    const renderBranch = () => {
        return <TableRow>
            <TableCell>
                {branch.BranchCode}
            </TableCell>
            <TableCell>
                {branch.BranchDesc}
            </TableCell>
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
                        <OrgDivisionTable orgDivisions={branch.Divisions} />
                    </Paper>
                </Collapse>
            </TableCell>
        </TableRow>
    }

    return <>
        {renderBranch()}
        {renderDivision()}
    </>
}