import type { IResponsibility, IOrgAccess } from 'src/types/responsibility';

import { useState, useEffect } from 'react';
import { useTabs } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Skeleton from '@mui/material/Skeleton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

import { fDate } from 'src/utils/format-time';

import { ResponsibilityOrgAccess } from './responsibility-org-access';

// ----------------------------------------------------------------------

type Props = {
  selected: IResponsibility;
  loading: boolean;
  open: boolean;
  onClose: () => void;
};

export function ResponsibilityDetails({ selected, loading, open, onClose }: Readonly<Props>) {
  const [orgAccess, setOrgAccess] = useState<IOrgAccess[]>([]);

  const emptyTab = 'empty';

  const selectTabs = useTabs(emptyTab);

  useEffect(() => {
    selectTabs.setValue(selected.Module.find(m => m.ModuleId === selectTabs.value)?.ModuleId || 
                        selected.Module[0]?.ModuleId || 
                        emptyTab);
  }, [selected]);

  useEffect(() => {
    setOrgAccess(selected.Module.find(m => m.ModuleId == selectTabs.value)?.OrgAccess ?? [])
  }, [selected, selectTabs.value]);

  const renderTabs = () => (
    <CustomTabs
      value={selectTabs.value}
      onChange={selectTabs.onChange}
      sx={{ borderRadius: 1, order: { xs: 2, sm: 1 } }}
    >
      {selectTabs.value == emptyTab ? (
        <Tab value={emptyTab} label={'No Module Found'} disabled />
      ) : ( 
        selected.Module.find(m => m.ModuleId === selectTabs.value) && (
          selected.Module.map((item) => (
            <Tab 
              key={item.ModuleId} 
              value={item.ModuleId}
              label={
                <Box sx={{ alignItems: 'center' }}>
                  <Chip 
                    variant={'outlined'}
                    label={item.ModuleName} 
                    sx={{ border: 'none' }} 
                  />
                </Box>
              }
            />
          ))
        )
      )}
    </CustomTabs>
  );

  const renderToolbar = () => (
    <Box
      sx={{
        gap: 2,
        width: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center' }
      }}
    >
      <Scrollbar sx={{ width: { xs: 1, sm: 2 }, order: { xs: 2, sm: 1 } }}>
        {loading ? (
          <Skeleton height={50} />
        ) : (
          renderTabs()
        )}
      </Scrollbar>
    </Box>
  );

  const renderOrgAccess = () => (
    selectTabs.value != emptyTab && (
      <ResponsibilityOrgAccess 
        list={orgAccess}
        loading={loading}
        moduleId={selectTabs.value}
        respId={selected.RespId}
        coGrpCode={selected.CoGrpCode}
      />
    )
  )

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      scroll="body"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction={'row'} spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            {selected?.RespName}
            <Label variant="soft" color={(selected?.IsActive && 'success') || 'error'}>
              {(selected?.IsActive && 'Active') || 'Inactive'}
            </Label>
            <Label variant="soft" color="info">
              {selected?.CoGrpCode}
            </Label>
            <Label variant="soft">
              Effective {fDate(selected?.EffectiveDate)}
            </Label>
          </Stack>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)' }
          }}
        >
          {renderToolbar()}
          {renderOrgAccess()}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
