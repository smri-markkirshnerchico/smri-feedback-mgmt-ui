import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import { UseSetStateReturn } from "minimal-shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { Iconify } from "src/components/iconify";
import { LOVFilter } from "src/types/lov";
import { ISessionApplication, ISessionModule } from "src/types/session";

export type Props = {
    onResetPage: () => void;
    filters: UseSetStateReturn<LOVFilter>;
    sessionModules: ISessionModule[];
}

export function LOVTableToolbar({ onResetPage, filters,
    sessionModules }: Readonly<Props>) {
    const { state: currentFilters, setState: updateFilters } = filters;

    const handleFilterModule = useCallback(
        (event: React.SyntheticEvent, value: ISessionModule | null) => {
            onResetPage();
            updateFilters({ ModuleId: value?.ModuleId });
        }, [onResetPage, updateFilters]
    );

    const handleFilterSearch = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onResetPage();
            updateFilters({ Keyword: event.target.value });
        },
        [onResetPage, updateFilters]
    );

    return (
        <Box
            sx={{
                p: 2,
                gap: 2,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
            }}>

            <Autocomplete
                fullWidth
                autoHighlight
                value={sessionModules.find((x) => x.ModuleId === currentFilters.ModuleId) || null}
                options={sessionModules}
                getOptionLabel={(option) => option.ModuleName}
                isOptionEqualToValue={(option, value) => option.ModuleId === value.ModuleId}
                onChange={(_, value) => handleFilterModule(_, value)}
                renderInput={(params) =>
                    <TextField {...params} label="Module" />
                }
            />

            <TextField
                fullWidth
                variant="outlined"
                label="Search Keyword..."
                value={currentFilters.Keyword}
                onChange={handleFilterSearch}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <Iconify icon="eva:search-fill" width={24} />
                            </InputAdornment>
                        )
                    }
                }}
            />

        </Box>
    )
}