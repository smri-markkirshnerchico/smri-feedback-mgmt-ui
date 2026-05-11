import type { IRole } from 'src/types/role';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { SearchNotFound } from 'src/components/search-not-found';

import { AccessSkeleton } from './components/access-skeleton';

import { RoleForm } from './role-form';

import { getSessionApplications } from 'src/api/admin/session';
import { getRoles } from 'src/api/admin/role';

// ----------------------------------------------------------------------

type Props = {
  isDevSet: boolean;
  isDevOps: boolean;
  selectedRole?: IRole;
  onSelectRole: (item?: IRole) => void;
  openNav: boolean;
  onCloseNav: () => void;
};

export function Role({ isDevSet, isDevOps, selectedRole, onSelectRole, openNav, onCloseNav }: Readonly<Props>) { 
  const { sessionApps, sessionAppsValidating, sessionAppsLoading, sessionAppsEmpty } = getSessionApplications();

  const [appId, setAppId] = useState<string>('');

  const handleSelectApp = useCallback(
    (event: React.SyntheticEvent, value: string) => {
      setAppId(value);
    },
    [setAppId]
  );

  useEffect(() => {
    if (!sessionAppsLoading && !sessionAppsEmpty) {
      setAppId(sessionApps[0]?.AppId);
    }
  }, [sessionAppsLoading, sessionApps]);

  const { roles, rolesValidating, rolesLoading, rolesEmpty } = getRoles(appId);

  useEffect(() => {
    if (roles.length) {
      onSelectRole(roles.find(m => m.RoleId === selectedRole?.RoleId) || roles[0]);
    }
    else {
      onSelectRole(undefined);
    }
  }, [roles, rolesLoading]);

  const [search, setSearch] = useState<string>('');
  const [current, setCurrent] = useState<IRole|undefined>();

  const formDialog = useBoolean();

  const filteredList = useMemo(() => {
    if (!search) return roles;
    return roles.filter(m => m.RoleName.toLowerCase().includes(search.toLowerCase()));
  }, [search, roles]);

  const handleOpenForm = useCallback((item?: IRole) => {
    setCurrent(item);
    formDialog.onTrue();
  }, []);

  const notFound = !filteredList.length && !!search;

  const renderToolbar = () => (
    <Stack sx={{ m: 2 }} spacing={1}>
      <Autocomplete
        fullWidth
        autoHighlight
        disableClearable
        value={appId}
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
        sx={{
          mb: 1
        }}
      />
      <Box
        sx={{
          gap: 2,
          width: 1,
          display: 'flex',
          flexDirection: { xs: 'row' },
          alignItems: { xs: 'center' },
          justifyContent: { md: 'space-between' },
          pl: 0.5
        }}
      >
        <Typography variant="h6">
          Roles
        </Typography>

        {(isDevSet || isDevOps) && (
          <Tooltip title="Create">
            <IconButton color="primary" onClick={() => handleOpenForm()}>
              <Iconify icon="solar:add-square-bold" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <TextField
        variant="filled"
        size="small"
        label="Search Role..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Iconify icon="eva:search-fill" width={24} />
              </InputAdornment>
            ),
          },
        }}
        disabled={rolesEmpty}
      />
    </Stack>
  )

  const renderFormDialog = () => (
    <RoleForm
      isDevSet={isDevSet}
      isDevOps={isDevOps}
      appId={appId}
      current={current}
      open={formDialog.value}
      onClose={formDialog.onFalse}
    />
  );

  const renderLoading = () => (
    <Stack sx={{ px: 2, flex: '1 1 auto' }}>
      <AccessSkeleton length={6} height={40} />
    </Stack>
  );

  const renderEmpty = () => (
    <Stack sx={{ px: 2, pb: 2, flex: '1 1 auto' }}>
      <EmptyContent filled />
    </Stack>
  );

  const renderNotFound = () => (
    <Stack sx={{ pt: 2, flex: '1 1 auto' }}>
      <SearchNotFound
        query={search}
        sx={{
          p: 3,
          mx: 'auto',
          width: `calc(100% - 40px)`,
          bgcolor: 'background.neutral',
        }}
      />
    </Stack>
  );

  const renderFilterResult = () => (
    <Stack sx={{ px: 2.5, pb: 1, flex: '1 1 auto' }}>
      <Typography variant="body2">
        <strong>{roles.length}</strong> results found
      </Typography>
    </Stack>
  );

  const renderList = () => (
    <>
      {search && renderFilterResult()}
      
      <Scrollbar sx={{ maxHeight: { md: 400 } }}>
        <nav>
          <Box
            component="ul"
            sx={{
              px: 2,
              pb: 1,
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {filteredList.map((item) => (
              <ListItem 
                key={item.RoleId}
                disablePadding
                disableGutters
                secondaryAction={
                  (isDevSet || isDevOps) && (
                    <Tooltip title="Edit">
                      <IconButton color="inherit" onClick={() => handleOpenForm(item)}>
                        <Iconify icon="solar:pen-bold-duotone" />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemButton
                  disableGutters
                  sx={[
                    {
                      p: 1.5,
                      gap: 2,
                      borderRadius: 1,
                      ...(selectedRole?.RoleId === item.RoleId && { bgcolor: 'action.selected' }),
                    }
                  ]}
                  onClick={() => onSelectRole(item)}
                >
                  <ListItemText
                    primary={
                      <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
                        {item.RoleName}
                        <Label
                          variant="soft"
                          color={(item.IsActive && 'success') || 'error'}
                          sx={{ cursor: 'pointer' }}
                        >
                          {(item.IsActive && 'Active') || 'Inactive'}
                        </Label>
                      </Stack>      
                    }
                    slotProps={{
                      primary: { noWrap: true },
                      secondary: { noWrap: true }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        </nav>
      </Scrollbar>
    </>
  );

  const renderContent = () => {
    if (rolesValidating) return renderLoading();
    if (rolesEmpty) return renderEmpty();
    if (notFound) return renderNotFound();
    return renderList();
  };

  return (
    <>
      {renderToolbar()}
      {renderContent()}
      {renderFormDialog()}

      <Drawer
        open={openNav}
        onClose={onCloseNav}
        slotProps={{ backdrop: { invisible: true }, paper: { sx: { width: 320 } } }}
      >
        {renderToolbar()}
        {renderContent()}
        {renderFormDialog()}
      </Drawer>
    </>
  );
}
