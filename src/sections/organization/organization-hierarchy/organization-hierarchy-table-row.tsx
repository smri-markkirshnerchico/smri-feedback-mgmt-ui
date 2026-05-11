import { Box, Collapse, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { IOrganizationalHierarchy } from "src/types/organization-hierarchy";
import { OrganizationalHierarchyDialog } from "./components/organization-hierarchy-map";

export type Props = {
    row: IOrganizationalHierarchy
}

export function OrgHierarchyTableRow({ row }: Readonly<Props>) {

    const openDialog = useBoolean();

    const renderPrimaryRow = () => {
        return <TableRow>
            <TableCell>{row.CompanyCode}</TableCell>
            <TableCell>{row.CompanyDesc}</TableCell>
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

    const renderOrgData = () => {
        return <OrganizationalHierarchyDialog
            open={openDialog.value}
            onClose={openDialog.onFalse}
            current={row}
        />
    }


    return (
        <>
            {renderPrimaryRow()}
            {openDialog.value && renderOrgData()}
        </>
    )
}