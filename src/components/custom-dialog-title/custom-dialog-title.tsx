import { Box, DialogTitle, IconButton } from "@mui/material";
import { Iconify } from "../iconify";

export type Props = {
    onClose: () => void;
    title: string;
}

export function CustomDialogTitle({ onClose, title }: Readonly<Props>) {
    return (
        <DialogTitle>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center"
            }}>
                {title}
                <IconButton onClick={onClose}>
                    <Iconify icon="material-symbols-light:close" />
                </IconButton>
            </Box>
        </DialogTitle>
    )
}