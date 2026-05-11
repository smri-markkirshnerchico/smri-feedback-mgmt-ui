import { Box, Card, CardContent, ListItem, ListItemText, Stack, Tab, Table, TableBody, TableCell, TableRow, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { CustomCardTitle } from "src/components/custom-card-title";
import { Label } from "src/components/label";
import { Scrollbar } from "src/components/scrollbar";
import { TableHeadCellProps, TableHeadCustom } from "src/components/table";
import { ListOfValueDto } from "src/types/lov";

export type Props = {
    open: boolean;
    current: ListOfValueDto;
}

const TABLE_HEAD_VALUES: TableHeadCellProps[] = [
    { id: 'LOVCode', label: 'LOV Code' },
    { id: 'Description', label: 'Description' },
    { id: 'Remarks', label: 'Remarks' },
    { id: 'ReturnValue', label: 'Return Value' },
    { id: "ModuleName", label: "Module(s)" },
    { id: 'DisplaySequence', label: 'Display Sequence', align: "center" },
];

export function LOValuesTableRowDetails({ open, current }: Readonly<Props>) {

    return (
        <Scrollbar sx={{ maxHeight: 500 }}>
            <Box sx={{ gap: 3, p: 2, display: "grid" }}>
                <Card sx={{ boxShadow: 4, p: 2 }}>
                    <Box sx={{ mt: 2 }}>
                        <Table>
                            <TableHeadCustom headCells={TABLE_HEAD_VALUES} />
                            <TableBody>
                                {current?.Values && current.Values.length > 0 ? (
                                    current.Values.map((v, index) => (
                                        <TableRow key={v.LOVCode}>
                                            <TableCell>{v.LOVCode}</TableCell>
                                            <TableCell>{v.LOVDescription}</TableCell>
                                            <TableCell>{v.Remarks}</TableCell>
                                            <TableCell>{v.ReturnValue}</TableCell>
                                            <TableCell>
                                                {v.Modules?.map(m => m.ModuleName).join(', ')}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{v.DisplaySequence}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No values available</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Box>

                </Card>
            </Box>
        </Scrollbar>
    );
}