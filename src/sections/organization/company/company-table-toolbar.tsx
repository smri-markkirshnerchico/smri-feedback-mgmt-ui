import { Box, InputAdornment, TextField } from "@mui/material";
import { UseSetStateReturn } from "minimal-shared/hooks";
import { useCallback } from "react";
import { Iconify } from "src/components/iconify";
import { ICommonFilter } from "src/types/_common";


export type Props = {
    onResetPage: () => void;
    filters: UseSetStateReturn<ICommonFilter>;
}

export function CompanyTableToolbar({ onResetPage, filters }: Readonly<Props>) {

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
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
        }}>
            <TextField
                sx={{
                    width: 500
                }}
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