"use client"

import { Box, Button, Card, Table, TableBody, TablePagination } from "@mui/material";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { GetStoreLocations } from "src/api/admin/store-location";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Scrollbar } from "src/components/scrollbar";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, getComparator, useTable } from "src/components/table";
import { MainContent } from "src/layouts/main";
import { IStoreLocation, IStoreLocationFilter } from "src/types/store-location";
import { GeographicAreaLocationDialog } from "../geographic-area-location-dialog";
import { Iconify } from "src/components/iconify";
import { GeographicAreaTableToolbar } from "../geographic-area-table-toolbar";
import { GeographicAreaTableRow } from "../geographic-area-table-row";
import { StoreLocationEvents } from "../store-location-events";
import { GetLOVByGroup } from "src/api/admin/lov";
import { LOValuesDto } from "src/types/lov";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'CompanyDesc', label: 'Company', width: 150 },
    { id: 'BranchDesc', label: 'Branch', width: 150 },
    { id: 'Address', label: 'Address', width: 300 },
    { id: 'Sato', label: 'SATO' },
    { id: "StoreOpening", label: "Store Opening" },
    { id: '', label: 'Action', width: 80, align: 'center' }
]


export function GeographicAreaView() {

    const table = useTable({ defaultRowsPerPage: 10, defaultOrderBy: "CompanyDesc" });
    const { storeLocations, storeLocationsLoading, storeLocationsValidating, storeLocationsMutate } = GetStoreLocations();

    const [tableData, setTableData] = useState<IStoreLocation[]>(storeLocations);
    const [companies, setCompanies] = useState<Record<string, string>>({});
    const [branches, setBranches] = useState<Record<string, string>>({});

    useEffect(() => {
        if (storeLocations && !storeLocationsLoading) {
            setTableData(storeLocations);
            const companyMap: Record<string, string> = {};
            const branchMap: Record<string, string> = {};

            storeLocations.forEach(item => {
                companyMap[item.CompanyCode] = item.CompanyDesc;
                branchMap[item.BranchCode] = item.BranchDesc;
            });

            setCompanies(companyMap);
            setBranches(branchMap);
        }
    }, [storeLocations, storeLocationsLoading]);


    const filters = useSetState<IStoreLocationFilter>({
        Keyword: '',
        CompanyCode: '',
        BranchCode: ''
    });


    const { state: currentFilters } = filters;

    const applySort = (
        data: IStoreLocation[],
        order: "asc" | "desc"
    ): IStoreLocation[] => {

        const dir = order === "asc" ? 1 : -1;

        return [...data].sort((a, b) => {
            return (
                (a.CompanyDesc ?? "").localeCompare(b.CompanyDesc ?? "") * dir ||
                (a.BranchDesc ?? "").localeCompare(b.BranchDesc ?? "") * dir
            );
        });
    };

    const dataSorted = applySort(tableData, table.order);

    const dataFiltered = applyFilter({
        inputData: dataSorted,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters
    });

    const DialogSearchLocation = useBoolean();

    const renderGeographicLocationDialog = () => {
        return <GeographicAreaLocationDialog
            open={DialogSearchLocation.value}
            onClose={DialogSearchLocation.onFalse}
        />
    }

    const DialogViewEvents = useBoolean();
    const [selectedStore, setSelectedStore] = useState<IStoreLocation | undefined>(undefined);

    const handleViewEvent = (data: IStoreLocation) => {
        setSelectedStore(data);
        DialogViewEvents.onTrue();
    }

    const renderStoreLocationEvents = () => {
        return <StoreLocationEvents
            open={DialogViewEvents.value}
            onClose={DialogViewEvents.onFalse}
            currentStoreLocation={selectedStore}
        />
    }


    const { lovGroup, lovGroupLoading } = GetLOVByGroup('SMEvents');

    const [lovValues, setLovValues] = useState<LOValuesDto[]>([]);

    useEffect(() => {
        if (lovGroup && !lovGroupLoading) {
            setLovValues(lovGroup.Values);
        }

    }, [lovGroupLoading, lovGroup]);

    const recordListOfValues = Object.fromEntries(lovValues.map((x: LOValuesDto) => [String(x.LOVCode), String(x.LOVDescription)]));


    return <MainContent>
        {DialogSearchLocation.value && renderGeographicLocationDialog()}
        {DialogViewEvents.value && renderStoreLocationEvents()}

        <CustomBreadcrumbs
            action={
                <Button
                    variant="contained"
                    color="primary"
                    onClick={DialogSearchLocation.onTrue}
                    startIcon={
                        <Iconify icon="icomoon-free:location" />
                    }
                >
                    Search Geographic Location
                </Button>
            }
        />
        <Card>
            <GeographicAreaTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                companies={companies}
                branches={branches}
            />

            <Box sx={{ position: 'relative' }}>
                <Scrollbar>
                    <Table sx={{ minWidth: 960 }}>
                        <TableHeadCustom
                            order={table.order}
                            orderBy={table.orderBy}
                            headCells={TABLE_HEAD}
                            rowCount={dataFiltered.length}
                            numSelected={table.selected.length}
                            onSort={table.onSort}
                        />

                        <TableBody>
                            {storeLocationsValidating ? (
                                <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                            ) : (
                                dataFiltered
                                    .slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    )
                                    .map((row: IStoreLocation) => (
                                        <GeographicAreaTableRow
                                            key={row.StLocId}
                                            currentStoreLocation={row}
                                            onViewEvents={() => handleViewEvent(row)}
                                            mutateEvent={storeLocationsMutate}
                                            // lovGroups={recordListOfValues}
                                            lovValues={lovValues}
                                        />
                                    )))}

                            <TableEmptyRows
                                height={56}
                                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                            />

                            <TableNoData notFound={dataFiltered.length <= 0} />
                        </TableBody>
                        <TablePagination
                            page={table.page}
                            count={dataFiltered.length}
                            rowsPerPage={table.rowsPerPage}
                            onPageChange={table.onChangePage}
                            onRowsPerPageChange={table.onChangeRowsPerPage}
                        />
                    </Table>
                </Scrollbar>
            </Box>
        </Card>
    </MainContent>
}


type ApplyFilterProps = {
    inputData: IStoreLocation[];
    filters: IStoreLocationFilter;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const { Keyword, CompanyCode, BranchCode } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (Keyword) {
        const loweredKeyword = Keyword.toLowerCase();

        inputData = inputData.filter((list) =>
            list.BarangayDesc.toLowerCase().includes(loweredKeyword) ||
            list.BranchDesc.toLowerCase().includes(loweredKeyword) ||
            list.CompanyDesc.toLowerCase().includes(loweredKeyword) ||
            list.Address.toLowerCase().includes(loweredKeyword) ||
            list.ProvinceDesc.toLowerCase().includes(loweredKeyword) ||
            list.RegionDesc.toLowerCase().includes(loweredKeyword) ||
            list.TownDesc.toLowerCase().includes(loweredKeyword)
        );
    }

    if (CompanyCode) {
        inputData = inputData.filter((company) => company.CompanyCode == CompanyCode);
    }

    if (BranchCode) {
        inputData = inputData.filter((branch) => branch.BranchCode == BranchCode);
    }

    return inputData;
}
