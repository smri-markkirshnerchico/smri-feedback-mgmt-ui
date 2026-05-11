import { Box, Collapse, IconButton, Paper, TableCell, TableRow } from "@mui/material"
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { IPosCompany } from "src/types/position-hierarchy"
import { PosBranchTable } from "./pos-branch-table";

export type Props = {
    company: IPosCompany;
}

export function PosCompanyRow({ company }: Readonly<Props>) {

    const collapseBranch = useBoolean();

    const renderCompany = () => {
        return <TableRow>
            <TableCell>{company.CompanyCode}</TableCell>
            <TableCell>{company.CompanyDesc}</TableCell>
            <TableCell>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Box>
                        <IconButton
                            color={collapseBranch.value ? 'inherit' : 'default'}
                            onClick={collapseBranch.onToggle}
                            sx={{ ...(collapseBranch.value && { bgcolor: 'action.hover' }) }}
                        >
                            <Iconify icon="eva:arrow-ios-downward-fill" />
                        </IconButton>
                    </Box>
                </Box>
            </TableCell>
        </TableRow>
    }

    const renderBranch = () => {
        return <TableRow>
            <TableCell sx={{ p: 0, border: 'none' }} colSpan={3}>
                <Collapse
                    in={collapseBranch.value}
                    timeout="auto"
                    unmountOnExit
                    sx={{ bgcolor: 'background.neutral' }}
                >
                    <Paper sx={{ m: 1.5 }}>
                        <PosBranchTable posBranch={company.Branches} />
                    </Paper>
                </Collapse>
            </TableCell>
        </TableRow>
    }

    return (
        <>
            {renderCompany()}
            {renderBranch()}
        </>

    )
}