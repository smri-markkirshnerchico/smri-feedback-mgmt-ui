import { Box, IconButton, TableCell, TableRow, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { IStoreLocation } from "src/types/store-location"
import { StoreLocationAllEvents } from "./store-location-all-events";
import { StoreLocationEventDialog } from "./store-location-event-dialog";
import { LOValuesDto } from "src/types/lov";

export type Props = {
    currentStoreLocation: IStoreLocation;
    onViewEvents: () => void;
    mutateEvent: () => void;
    // lovGroups: Record<string, string>;
    lovValues: LOValuesDto[];
}

export function GeographicAreaTableRow({ currentStoreLocation, onViewEvents, mutateEvent, lovValues }: Readonly<Props>) {

    const RowEventsBool = useBoolean();
    const renderStoreLocationAllEvents = () => {
        return <StoreLocationAllEvents
            stLocId={currentStoreLocation.StLocId}
        />
    }

    const DialogAdd = useBoolean();

    const renderDialogAdd = () => {
        return <StoreLocationEventDialog
            open={DialogAdd.value}
            onClose={DialogAdd.onFalse}
            currentStoreLocation={currentStoreLocation}
            mutateEvents={mutateEvent}
            // lovGroups={lovGroups}
            lovValues={lovValues}
            mode="create"
        />
    }

    return <>
        <TableRow>
            <TableCell>{currentStoreLocation.CompanyDesc}</TableCell>
            <TableCell>{currentStoreLocation.BranchDesc}</TableCell>
            <TableCell>
                {`${currentStoreLocation.Address}, ${currentStoreLocation.BarangayDesc}, 
            ${currentStoreLocation.TownDesc}, ${currentStoreLocation.ProvinceDesc}, ${currentStoreLocation.RegionDesc}`}
            </TableCell>
            <TableCell>{currentStoreLocation.Sato}</TableCell>
            <TableCell >
                {dayjs(currentStoreLocation.StoreOpening).format("MMMM DD, YYYY")}
            </TableCell>
            <TableCell>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", alignContent: "center" }}>

                    <Tooltip title="Add Event">
                        <IconButton onClick={DialogAdd.onTrue}>
                            <Iconify icon="ic:twotone-add" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View Previous Event">
                        <IconButton onClick={RowEventsBool.value ? RowEventsBool.onFalse : RowEventsBool.onTrue}>
                            <Iconify icon={RowEventsBool.value ? "lsicon:up-filled" : "lsicon:down-filled"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Calendar View">
                        <IconButton onClick={onViewEvents}>
                            <Iconify icon="solar:calendar-broken" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCell>
        </TableRow>

        {RowEventsBool.value && renderStoreLocationAllEvents()}
        {DialogAdd.value && renderDialogAdd()}
    </>

}