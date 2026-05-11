import type { IModuleFilter } from 'src/types/module';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { getSessionApplications } from 'src/api/admin/session';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<IModuleFilter>;
  selectedApp?: string;
  onSelectApp: (item: string) => void;
  onResetPage: () => void;
};

export function ModuleTableToolbar({ filters, selectedApp, onSelectApp, onResetPage }: Readonly<Props>) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const { sessionApps, sessionAppsValidating, sessionAppsLoading, sessionAppsEmpty } = getSessionApplications();

  useEffect(() => {
    if (!sessionAppsLoading && !sessionAppsEmpty) {
      onSelectApp(sessionApps[0]?.AppId);
    }
  }, [sessionAppsLoading, sessionApps]);

  const handleSelectApp = useCallback(
    (event: React.SyntheticEvent, value: string) => {
      onSelectApp(value);
    },
    [onSelectApp]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      onResetPage();
      updateFilters({ status: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ keyword: event.target.value });
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
        alignItems: { xs: 'flex-end', md: 'center' },
      }}
    >
      <Autocomplete
        fullWidth
        autoHighlight
        disableClearable
        sx={{ maxWidth: { md: 250 } }}
        value={selectedApp}
        onChange={handleSelectApp}
        loading={sessionAppsValidating}
        options={sessionApps.map((option) => option.AppId)}
        isOptionEqualToValue={(option, value) => option === value}
        getOptionLabel={(option) => sessionApps.find((m) => m.AppId === option)?.AppName || ''}
        renderInput={(params) => <TextField {...params} variant="filled" label="Application" />}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {sessionApps.find((m) => m.AppId === option)?.AppName}
          </li>
        )}
      />
      
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel variant="filled" htmlFor="filter-status-select">Status</InputLabel>
        <Select
          value={currentFilters.status}
          onChange={handleFilterStatus}
          input={<FilledInput />}
          inputProps={{ id: 'filter-status-select' }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {['Active', 'Inactive'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        variant="filled"
        label="Search Keyword..."
        value={currentFilters.keyword}
        onChange={handleFilterSearch}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Iconify icon="eva:search-fill" width={24} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ width: { xs: 1, sm: 460 } }}
      />
    </Box>
  );
}
