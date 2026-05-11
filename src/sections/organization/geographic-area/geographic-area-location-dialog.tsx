import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TablePagination, TableRow, Typography } from "@mui/material";
import { useSetState } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { GetGeographicalHierarchies } from "src/api/admin/geographical-hierarchy";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TableSkeleton, emptyRows, getComparator, useTable } from "src/components/table";
import { ICommonFilter } from "src/types/_common";
import { IGeographicalHierarchy } from "src/types/geographical-hierarchy";
import { GeographicAreaLocationTableToolbar } from "./geographic-area-location-toolbar";
import { CustomDialogTitle } from "src/components/custom-dialog-title";

export type Props = {
    open: boolean;
    onClose: () => void;
}

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'BarangayDesc', label: "Barangay" },
    { id: "TownDesc", label: "Town" },
    { id: "ProvinceDesc", label: "Province" },
    { id: "RegionDesc", label: "Region" },
];

interface GeoHierarchy {
    BarangayDesc?: string;
    TownDesc?: string;
    ProvinceDesc?: string;
    RegionDesc?: string;
}

export function GeographicAreaLocationDialog({ open, onClose }: Readonly<Props>) {
    const table = useTable({ defaultRowsPerPage: 10, defaultOrderBy: "BarangayDesc" });
    const { geoHierarchies, geoHierarchiesLoading, geoHierarchiesValidating } = GetGeographicalHierarchies();

    const [tableData, setTableData] = useState<GeoHierarchy[]>([]);

    useEffect(() => {
        if (geoHierarchies && !geoHierarchiesLoading) {
            const flattenedData: GeoHierarchy[] = geoHierarchies.flatMap(region =>
                region.Provinces.flatMap(province =>
                    province.Towns.flatMap(town =>
                        town.Barangays.map(barangay => ({
                            RegionCode: region.RegionCode,
                            RegionDesc: region.RegionDesc,
                            RegionName: region.RegionName,
                            ProvinceCode: province.ProvinceCode,
                            ProvinceDesc: province.ProvinceDesc,
                            ProvinceName: province.ProvinceName,
                            TownCode: town.TownCode,
                            TownDesc: town.TownDesc,
                            TownName: town.TownName,
                            BarangayCode: barangay.BarangayCode,
                            BarangayDesc: barangay.BarangayDesc,
                            BarangayName: barangay.BarangayName
                        }))
                    )
                )
            );
            setTableData(flattenedData);
        }
    }, [geoHierarchies, geoHierarchiesLoading]);


    const filters = useSetState<ICommonFilter>({
        Keyword: ''
    });


    const { state: currentFilters } = filters;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters
    });
    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="body">

        <CustomDialogTitle
            title={"Geographic Location"}
            onClose={onClose}
        />

        <DialogContent>
            <Card sx={{
                boxShadow: 4,
                mb: 2,
                mt: 2
            }}>
                <GeographicAreaLocationTableToolbar
                    filters={filters}
                    onResetPage={table.onResetPage}

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
                                {geoHierarchiesValidating ? (
                                    <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                                ) : (
                                    dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.BarangayDesc}</TableCell>
                                                <TableCell>{row.TownDesc}</TableCell>
                                                <TableCell>{row.ProvinceDesc}</TableCell>
                                                <TableCell>{row.RegionDesc}</TableCell>
                                            </TableRow>
                                        )))}

                                <TableEmptyRows
                                    height={56}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                />

                                <TableNoData notFound={dataFiltered.length <= 0} />
                                <TablePagination
                                    page={table.page}
                                    count={dataFiltered.length}
                                    rowsPerPage={table.rowsPerPage}
                                    onPageChange={table.onChangePage}
                                    onRowsPerPageChange={table.onChangeRowsPerPage}
                                />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </Box>
            </Card>

        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={onClose}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
}


type ApplyFilterProps = {
    inputData: GeoHierarchy[];
    filters: ICommonFilter;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const { Keyword } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (Keyword) {
        const loweredKeyword = Keyword.toLowerCase();
        const keywords: string[] = loweredKeyword.split(/\s+/);

        const calculateMatchScore = (list: GeoHierarchy, keywords: string[]): number => {
            let score = 0;

            keywords.forEach((keyword: string) => {
                if (list.BarangayDesc?.toLowerCase().includes(keyword)) score++;
                if (list.TownDesc?.toLowerCase().includes(keyword)) score++;
                if (list.ProvinceDesc?.toLowerCase().includes(keyword)) score++;
                if (list.RegionDesc?.toLowerCase().includes(keyword)) score++;
            });

            return score;
        };

        inputData = inputData
            .map((list) => ({
                ...list,
                matchScore: calculateMatchScore(list, keywords)
            }))
            .filter((item) => item.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
    }


    return inputData;
}
