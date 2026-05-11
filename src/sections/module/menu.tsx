import type { IMenu } from 'src/types/menu';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { MenuTree } from './menu-tree';
import { MenuForm } from './menu-form';

import { getMenus } from 'src/api/admin/menu';

// ----------------------------------------------------------------------

type Props = {
  moduleId: string;
  moduleName: string;
  open: boolean;
  onClose: () => void;
};

export function Menu({ moduleId, moduleName, open, onClose }: Readonly<Props>) {
  const { menus, menusValidating, menusEmpty } = getMenus(moduleId);

  const [currentMenu, setCurrentMenu] = useState<IMenu|undefined>();

  const handleSetCurrent = useCallback((item: IMenu) => {
    setCurrentMenu(item);
  }, []);

  const handleResetCurrent = useCallback(() => {
    setCurrentMenu(undefined);
  }, []);

  const renderTree = () => (
    <MenuTree
      menus={menus}
      menusValidating={menusValidating}
      menusEmpty={menusEmpty}
      onSetCurrent={handleSetCurrent}
    />
  );

  const renderForm = () => (
    <MenuForm
      current={currentMenu}
      menus={menus}
      menusValidating={menusValidating}
      moduleId={moduleId}
      onResetCurrent={handleResetCurrent}
    />
  );
  
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      scroll="body"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Menu — {moduleName}</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 6,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }
              }}
            >
              {renderForm()}
              {renderTree()}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
    </Dialog>
  );
}
