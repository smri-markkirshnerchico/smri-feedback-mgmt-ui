import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { Avatar, Box, IconButton, MenuItem, MenuList, Stack, TableCell, TableRow } from "@mui/material";
import { useBoolean, usePopover } from "minimal-shared/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteUser } from "src/api/admin/user";
import { ConfirmDialog } from "src/components/custom-dialog";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { IBranch } from "src/types/branch";
import { ICompany } from "src/types/company";
import { IUserDto } from "src/types/user"

export type Props = {
    row: IUserDto;
    onEdit: () => void;
    imageUrl: string;
    mutateUrl: () => void;
}

export function UserTableRow({ row, onEdit, imageUrl, mutateUrl }: Readonly<Props>) {

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const menuActions = usePopover();
    const confirmDialog = useBoolean();

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Delete"
            content="Are you sure want to delete this user?"
            action={
                <LoadingButton variant="contained" color="error" loading={isDeleting} onClick={handleDelete}>
                    Delete
                </LoadingButton>
            }
        />
    );

    const handleDelete = async () => {
        try {
            await DeleteUser(row.UserId ?? "");
            toast.success("Successfully deleted user!");
            mutateUrl();
        } catch (error: any) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'An unknown error occurred';

            toast.error(message);
        }
    }

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <MenuItem
                    onClick={() => {
                        onEdit();
                        menuActions.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        confirmDialog.onTrue();
                        menuActions.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    return <TableRow hover tabIndex={-1}>
        <TableCell>
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar src={imageUrl + row.EmpId + ".jpg"} alt={row.FirstName} />
                <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                    <Box component="span" sx={{ color: 'inherit' }}>
                        {row.FirstName} {row.MiddleName} {row.LastName}
                    </Box>
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                        {row.EmailAddress}
                    </Box>
                </Stack>
            </Box>
        </TableCell>
        <TableCell>{row.EmpId}</TableCell>
        <TableCell>{row.SssNo}</TableCell>
        <TableCell>{row.CompanyDesc}</TableCell>
        <TableCell>{row.BranchDesc}</TableCell>
        <TableCell>
            <Stack spacing={1}>
                <Label
                    variant="soft"
                    color={(row.IsActive && 'success') || 'error'}
                >
                    {(row.IsActive && 'Active') || 'Inactive'}
                </Label>
                {row.IsResigned && (
                    <Label variant="soft" color="warning">
                        Resigned
                    </Label>
                )}
            </Stack>
        </TableCell>
        <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                    color={menuActions.open ? 'inherit' : 'default'}
                    onClick={menuActions.onOpen}
                >
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
            </Box>
        </TableCell>
        {menuActions.open && renderMenuActions()}
        {confirmDialog.value && renderConfirmDialog()}
    </TableRow>
}