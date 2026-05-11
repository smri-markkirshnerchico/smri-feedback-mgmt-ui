import type { IMenu } from 'src/types/menu';
import type { TreeViewBaseItem } from '@mui/x-tree-view/models';

import { useState, useCallback, useEffect } from 'react';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { fTextNullable } from 'src/utils/format-text';

// ----------------------------------------------------------------------

function BuildTree(list: IMenu[]): TreeViewBaseItem[] {
  if (!list?.length) return [];

  const map: TreeViewBaseItem[] = [];
  const item: Record<string, TreeViewBaseItem> = {};

  for (const menu of list) {
    const current: TreeViewBaseItem = {
      id: menu.MenuId.toString(),
      label: menu.MenuName,
      children: [],
    };
    item[menu.MenuId] = current;

    if (!fTextNullable(menu.ParentMenuId)) {
      map.push(current);
    }
  }

  for (const menu of list) {
    const current = item[menu.MenuId];
    if (fTextNullable(menu.ParentMenuId)) {
      const parent = item[menu.ParentMenuId];
      if (parent) {
        parent.children ??= [];
        parent.children.push(current);
      }
    }
  }

  return map;
}

interface CustomTreeLabelProps {
  item: IMenu;
  onClick?: () => void;
}

function CustomTreeLabel({ item, onClick } : Readonly<CustomTreeLabelProps>) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={1}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <Iconify 
        icon={item.IsFolder ? "solar:folder-with-files-bold-duotone" : "solar:file-bold-duotone"}  
        sx={[
          (theme) => ({
            color: theme.palette.mode == 'light' ? 
                   varAlpha(theme.vars.palette.primary.mainChannel, 1) :
                   varAlpha(theme.vars.palette.primary.lightChannel, 1)
          })
        ]} 
      />
      <Typography>{item.MenuName}</Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type Props = {
  menus: IMenu[];
  menusValidating: boolean;
  menusEmpty: boolean;
  onSetCurrent: (item: IMenu) => void;
};

export function MenuTree({ menus, menusValidating, menusEmpty, onSetCurrent }: Readonly<Props>) {
  const [menuTree, setMenuTree] = useState<TreeViewBaseItem[]>([]);

  useEffect(() => {
    if (menus.length) {
      const buildTree = BuildTree(menus);
      setMenuTree(buildTree);
    }
  }, [menus]);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleExpansionToggle = useCallback((_event: React.SyntheticEvent, itemId: string, isExpanded: boolean) => {
    setExpandedItems((prev) => isExpanded ? [...prev, itemId] : prev.filter((id) => id !== itemId));
  }, []);

  const CustomTreeItem = useCallback((props: TreeItem2Props) => {
    const menu = menus.find(m => m.MenuId === props.itemId);

    if (!menu) return;

    return (
      <TreeItem2
        {...props}
        slots={{
          label: CustomTreeLabel
        }}
        slotProps={{
          label: { item: menu, onClick: () => onSetCurrent(menu) } as CustomTreeLabelProps
        }}
      />
    );
  }, [menus]);

  return (
    <Box
      sx={[
        (theme) => ({
          borderRadius: 2,
          border: `dashed 1px ${theme.vars.palette.divider}`,
          bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          p: 2
        })
      ]}
    >
      {menusEmpty ? (
        <EmptyContent />
      ) : (
        <>
          {menusValidating ? (
            <LoadingScreen sx={{ py: 10 }} />
          ) : (
            <RichTreeView
              expandedItems={expandedItems}   
              sx={{ overflowX: 'hidden', minHeight: 240, width: 1 }}
              expansionTrigger='iconContainer'
              itemChildrenIndentation={30}
              slots={{ item: CustomTreeItem }}
              items={menuTree}
              onItemExpansionToggle={handleExpansionToggle}
            />
          )}
        </>
      )} 
    </Box>
  );
}
