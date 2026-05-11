import type { IRole } from 'src/types/role';
import type { IResponsibility } from 'src/types/responsibility';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { SearchNotFound } from 'src/components/search-not-found';

import { AccessSkeleton } from './components/access-skeleton';

import { ResponsibilityItem } from './responsibility-item';
import { ResponsibilityForm } from './responsibility-form';
import { ResponsibilityDetails } from './responsibility-details';

import { getResponsibilities } from 'src/api/admin/responsibility';

// ----------------------------------------------------------------------

type Props = {
  role: IRole;
  isDevSet: boolean;
};

export function Responsibility({ role, isDevSet }: Readonly<Props>)  {  
  const { resp, respValidating, respEmpty } = getResponsibilities(role.RoleId);

  const [search, setSearch] = useState<string>('');
  const [current, setCurrent] = useState<IResponsibility>();
  const [selected, setSelected] = useState<IResponsibility>();

  useEffect(() => {
    if (selected) {
      setSelected(resp.find(m => m.RespId === selected.RespId));
    }
  }, [resp]);

  const formDialog = useBoolean();
  const detailsDialog = useBoolean();

  const list = useMemo(() => {
    if (!search) return resp;
    return resp.filter((item) =>
      item.RespName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, resp]);

  const handleOpenForm = useCallback((item?: IResponsibility) => {
    setCurrent(item);
    formDialog.onTrue();
  }, []);

  const handleOpenDetails = useCallback((item: IResponsibility) => {
    setSelected(item);
    detailsDialog.onTrue();
  }, []);


  const notFound = !list.length && !!search;

  const renderToolbar = () => (
    <Box
      sx={{
        gap: 2,
        width: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
        justifyContent: { md: 'space-between' }
      }}
    >
      <TextField
        variant="filled"
        size="small"
        label="Search Responsibility..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ width: { xs: 1, sm: 400 }, order: { xs: 2, sm: 1 } }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Iconify icon="eva:search-fill" width={24} />
              </InputAdornment>
            ),
          },
        }}
        disabled={respEmpty}
      />

      <Button
        fullWidth
        color="primary"
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => handleOpenForm()}
        sx={{ width: { xs: 1, sm: 200 }, order: { xs: 1, sm: 2 } }}
        disabled={role.IsDevSet || (role.IsDevOps && !isDevSet)}
      >
        Responsibility
      </Button>
    </Box>
  );

  const renderFormDialog = () => (
    <ResponsibilityForm
      roleId={role.RoleId}
      isDevSet={role.IsDevSet}
      isDevOps={role.IsDevOps}
      current={current}
      open={formDialog.value}
      onClose={formDialog.onFalse}
    />
  );

  const renderDetailsDialog = () => (
    !!selected && (
      <ResponsibilityDetails
        selected={selected}
        loading={respValidating}
        open={detailsDialog.value}
        onClose={detailsDialog.onFalse}
      />
    )
  );

  const renderLoading = () => (
    <Stack sx={{ pt: 2, flex: '1 1 auto' }}>
      <AccessSkeleton length={4} height={75} />
    </Stack>
  );

  const renderEmpty = () => (
    <Stack sx={{ pt: 2, flex: '1 1 auto' }}>
      <EmptyContent filled sx={{ py: 10 }} />
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
    <Stack sx={{ pt: 2, flex: '1 1 auto' }}>
      <Typography variant="body2">
        <strong>{list.length}</strong> results found
      </Typography>
    </Stack>
  );

  const renderList = () => (
    <>
      {search && renderFilterResult()}
      
      <Scrollbar sx={{ maxHeight: 400, mt: 2 }}>
        <Box
          component="ul"
          sx={{
            gap: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {list.map((item) => (
            <ResponsibilityItem 
              key={item.RespId}
              isDevSet={role.IsDevSet}
              isDevOps={role.IsDevOps}
              item={item}
              onClickEdit={() => handleOpenForm(item)}
              onClickDetails={() => handleOpenDetails(item)}
            />
          ))}
        </Box>
      </Scrollbar>
    </>
  );

  const renderContent = () => {
    if (respValidating) return renderLoading();
    if (respEmpty) return renderEmpty();
    if (notFound) return renderNotFound();
    return renderList();
  };

  return (
    <>
      {renderToolbar()}
      {renderContent()}
      {renderFormDialog()}
      {renderDetailsDialog()}
    </>
  );
}