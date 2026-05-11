import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import { UseSetStateReturn } from "minimal-shared/hooks";
import { useCallback, useEffect } from "react";
import { getSessionApplications } from "src/api/admin/session";
import { Iconify } from "src/components/iconify";
import { IUserFilter } from "src/types/user";

export type Props = {
    onResetPage: () => void;
    filters: UseSetStateReturn<IUserFilter>;
    companies: Record<string, string>;
    branches: Record<string, string>;
    onSelectApp: (item: string) => void;
    selectedApp?: string;
}

export function UserTableToolbar({ onResetPage, filters, companies, branches, onSelectApp, selectedApp }: Readonly<Props>) {

    const { state: currentFilters, setState: updateFilters } = filters;

    const { sessionApps, sessionAppsValidating, sessionAppsLoading, sessionAppsEmpty } = getSessionApplications();

    useEffect(() => {
        if (!sessionAppsLoading && !sessionAppsEmpty) {
            onSelectApp(sessionApps[0]?.AppId);
        }
    }, [sessionAppsLoading, sessionApps]);

    const handleFilterSearch = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onResetPage();
            updateFilters({ Keyword: event.target.value });
        },
        [onResetPage, updateFilters]
    );


    const handleSelectApp = useCallback(
        (event: React.SyntheticEvent, value: string) => {
            onSelectApp(value);
        },
        [onSelectApp]
    );

    return (
        <Box sx={{
            p: 2,
            gap: 2,
            display: 'grid',
            gridTemplateColumns: "repeat(3, 1fr)"
        }}>
            <Box>
                <Autocomplete
                    fullWidth
                    autoHighlight
                    disableClearable
                    value={selectedApp}
                    onChange={handleSelectApp}
                    loading={sessionAppsValidating}
                    options={sessionApps.map((option) => option.AppId)}
                    isOptionEqualToValue={(option, value) => option === value}
                    getOptionLabel={(option) => sessionApps.find((m) => m.AppId === option)?.AppName || ''}
                    renderInput={(params) => <TextField {...params} label="Application" />}
                    renderOption={(props, option) => (
                        <li {...props} key={option}>
                            {sessionApps.find((m) => m.AppId === option)?.AppName}
                        </li>
                    )}
                />
            </Box>
            <Box>
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
            <Box>
                <Autocomplete
                    options={Object.entries(companies).map(([key, value]) => ({
                        value: key,
                        label: value,
                    }))}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => {
                        updateFilters({ Company: newValue ? newValue.value : "" });
                    }}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={
                        currentFilters.Company && companies[currentFilters.Company]
                            ? { label: companies[currentFilters.Company], value: currentFilters.Company }
                            : null
                    }
                    renderInput={(params) =>
                        <TextField {...params} label="Company"
                        />}
                />
            </Box>

            <Box>
                <Autocomplete
                    options={Object.entries(branches).map(([key, value]) => ({
                        value: key,
                        label: value,
                    }))}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => {
                        updateFilters({ Branch: newValue ? newValue.value : "" });
                    }}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={
                        currentFilters.Branch && branches[currentFilters.Branch]
                            ? { label: branches[currentFilters.Branch], value: currentFilters.Branch }
                            : null
                    }
                    renderInput={(params) =>
                        <TextField {...params} label="Branch"
                        />}
                />
            </Box>
        </Box>
    )
}