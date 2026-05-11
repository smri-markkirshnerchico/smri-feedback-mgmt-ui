import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import { UseSetStateReturn } from "minimal-shared/hooks";
import { useCallback } from "react";
import { Iconify } from "src/components/iconify";
import { IBranch } from "src/types/branch";
import { ICompany } from "src/types/company";
import { IStoreLocationFilter } from "src/types/store-location";

export type Props = {
    onResetPage: () => void;
    filters: UseSetStateReturn<IStoreLocationFilter>;
    companies: Record<string, string>;
    branches: Record<string, string>;
}

export function GeographicAreaTableToolbar({ onResetPage, filters,
    companies, branches }: Readonly<Props>) {

    const { state: currentFilters, setState: updateFilters } = filters;

    const handleFilterSearch = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onResetPage();
            updateFilters({ Keyword: event.target.value });
        },
        [onResetPage, updateFilters]
    );

    return (
        <Box sx={{
            p: 2,
            gap: 2,
            display: 'grid',
            gridTemplateColumns: "repeat(3, 1fr)"
        }}>
            <Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Store Location..."
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

            <Box>
                <Autocomplete
                    options={Object.entries(companies).map(([key, value]) => ({
                        value: key,
                        label: value,
                    })).sort((a, b) => a.label.localeCompare(b.label))}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => {
                        updateFilters({ CompanyCode: newValue ? newValue.value : "" });
                    }}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={
                        currentFilters.CompanyCode && companies[currentFilters.CompanyCode]
                            ? { label: companies[currentFilters.CompanyCode], value: currentFilters.CompanyCode }
                            : null
                    }
                    renderInput={(params) =>
                        <TextField {...params} label="Select Company"
                        />}
                />
            </Box>

            <Box>
                <Autocomplete
                    options={Object.entries(branches).map(([key, value]) => ({
                        value: key,
                        label: value,
                    })).sort((a, b) => a.label.localeCompare(b.label))}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => {
                        updateFilters({ BranchCode: newValue ? newValue.value : "" });
                    }}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={
                        currentFilters.BranchCode && branches[currentFilters.BranchCode]
                            ? { label: branches[currentFilters.BranchCode], value: currentFilters.BranchCode }
                            : null
                    }
                    renderInput={(params) =>
                        <TextField {...params} label="Select Branch"
                        />}
                />
            </Box>

        </Box>
    )
}