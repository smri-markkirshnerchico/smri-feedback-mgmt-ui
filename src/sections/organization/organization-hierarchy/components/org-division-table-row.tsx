import { Box, Collapse, IconButton, Paper, TableCell, TableRow } from "@mui/material";
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { IOrgDepartment, IOrgDivision } from "src/types/organization-hierarchy"
import { OrgDepartmentTable } from "./org-department-table";
import { OrgDivisionTable } from "./org-division-table";

export type Props = {
    currentDivision: IOrgDivision;
}

export function OrgDivisionTableRow({ currentDivision }: Readonly<Props>) {

    const collapseDepartment = useBoolean();

    const renderFirstRow = () => {
        return <TableRow>
            <TableCell>
                {currentDivision.DivisionCode}
            </TableCell>
            <TableCell>
                {currentDivision.DivisionDesc}
            </TableCell>
            <TableCell>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Box>
                        <IconButton
                            color={collapseDepartment.value ? 'inherit' : 'default'}
                            onClick={collapseDepartment.onToggle}
                            sx={{ ...(collapseDepartment.value && { bgcolor: 'action.hover' }) }}
                        >
                            <Iconify icon="eva:arrow-ios-downward-fill" />
                        </IconButton>
                    </Box>
                </Box>
            </TableCell>
        </TableRow>
    }

    const renderDepartment = () => {
        return <TableRow>

            <TableCell sx={{ p: 0, border: 'none' }} colSpan={3}>
                <Collapse
                    in={collapseDepartment.value}
                    timeout="auto"
                    unmountOnExit
                    sx={{ bgcolor: 'background.neutral' }}
                >
                    <Paper sx={{ m: 1.5 }}>
                        <OrgDepartmentTable departments={currentDivision.Departments} />
                    </Paper>
                </Collapse>
            </TableCell>
        </TableRow>
    }

    return (
        <>
            {renderFirstRow()}
            {collapseDepartment.value && renderDepartment()}
        </>
    )
}