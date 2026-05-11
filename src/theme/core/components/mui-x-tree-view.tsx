import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiTreeItem: Components<Theme>['MuiTreeItem'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    label: ({ theme }) => ({ ...theme.typography.body2 }),
    iconContainer: { width: 'auto' },
  },
};

const MuiTreeItem2: Components<Theme>['MuiTreeItem2'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: {
      '.Mui-selected': {
        backgroundColor: 'transparent',
      },
    },
  },
};

// ----------------------------------------------------------------------

export const treeView = { MuiTreeItem, MuiTreeItem2 };
