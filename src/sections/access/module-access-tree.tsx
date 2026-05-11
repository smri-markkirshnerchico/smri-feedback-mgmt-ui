import type { IModuleAccess } from 'src/types/access';
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

function BuildTree(list: IModuleAccess[]): TreeViewBaseItem[] {
  if (!list?.length) return [];

  const map: TreeViewBaseItem[] = [];
  const item: Record<string, TreeViewBaseItem> = {};

  for (const data of list) {
    const current: TreeViewBaseItem = {
      id: data.Id,
      label: data.Name,
      children: [],
    };
    item[data.Id] = current;

    if (!fTextNullable(data.ParentId)) {
      map.push(current);
    }
  }

  for (const data of list) {
    const current = item[data.Id];
    if (fTextNullable(data.ParentId)) {
      const parent = item[data.ParentId];
      if (parent) {
        parent.children ??= [];
        parent.children.push(current);
      }
    }
  }

  return map;
}

interface CustomTreeLabelProps {
  item: IModuleAccess;
  onClick?: () => void;
}

function CustomTreeLabel({ item, onClick } : Readonly<CustomTreeLabelProps>) {
  let iconName;

  if (item.IsModule) {
    iconName = "solar:folder-favourite-bookmark-bold-duotone";
  } 
  else if (item.IsFolder) {
    iconName = "solar:folder-with-files-bold-duotone";
  }
  else {
    iconName = "solar:file-bold-duotone";
  }

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
        icon={iconName}
        sx={[
          (theme) => ({
            color: theme.palette.mode == 'light' ? 
                   varAlpha(theme.vars.palette.primary.mainChannel, 1) :
                   varAlpha(theme.vars.palette.primary.lightChannel, 1)
          })
        ]} 
      />
      <Typography>{item.Name}</Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type Props = {
  list: IModuleAccess[];
  listValidating: boolean;
  listEmpty: boolean;
  selectedItems: string[];
  onSetSelectedItems: (items: string[]) => void;
};

export function ModuleAccessTree({ list, listValidating, listEmpty, selectedItems, onSetSelectedItems }: Readonly<Props>) {
  const [menuTree, setMenuTree] = useState<TreeViewBaseItem[]>([]);

  useEffect(() => {
    if (list.length) {
      const buildTree = BuildTree(list);
      setMenuTree(buildTree);
    }
  }, [list]);

  const CustomTreeItem = useCallback((props: TreeItem2Props) => {
    const data = list.find(m => m.Id === props.itemId);
  
    if (!data) return;

    return (
      <TreeItem2
        {...props}
        slots={{
          label: CustomTreeLabel,
        }}
        slotProps={{
          label: { item: data } as CustomTreeLabelProps,
        }}
      />
    );
  }, [list]);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleExpansionToggle = useCallback((_event: React.SyntheticEvent, itemId: string, isExpanded: boolean) => {
    setExpandedItems(prev => isExpanded ? [...prev, itemId] : prev.filter((id) => id !== itemId));
  }, []);

  const getChildren = useCallback((parentId: string): string[] => {
    const children = list.filter(item => item.ParentId === parentId);

    const result = children.flatMap(child => {
      const childId = child.Id.toString();
      return [childId, ...getChildren(childId)];
    });

    return result;
  }, [list]);

  const getParent = useCallback((itemId: string, selectedItems: string[]): string[] => {
    let selectedList = [...selectedItems];
    let currentId = itemId;
    
    while (true) {
      const parent = list.find(item => item.Id === currentId);
      if (!parent?.ParentId) break;

      const parentId = parent.ParentId;
      const children = list.filter(item => item.ParentId === parent.ParentId).map(item => item.Id);
      const childrenSelected = children.some(id => selectedList.includes(id));

      if (childrenSelected && !selectedList.includes(parentId)) {
        selectedList.push(parentId);
      } else if (!childrenSelected && selectedList.includes(parentId)) {
        selectedList = selectedList.filter(id => id !== parentId);
      }

      currentId = parentId;
    }

    return selectedList;
  }, [list]);

  const handleSelectionToggle = useCallback((_event: React.SyntheticEvent, itemId: string) => {
    const isSelected = selectedItems.includes(itemId);
    const children = getChildren(itemId);

    let updatedSelectedItems = isSelected ? 
                               selectedItems.filter(id => id !== itemId && !children.includes(id)) : 
                               [...selectedItems, itemId, ...children];

    updatedSelectedItems = getParent(itemId, updatedSelectedItems);

    handleExpansionToggle(_event, itemId, !isSelected);

    onSetSelectedItems(updatedSelectedItems);
  }, [selectedItems, getChildren, getParent, handleExpansionToggle, onSetSelectedItems]);

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
      {listEmpty ? (
        <EmptyContent />
      ) : (
        <>
          {listValidating ? (
            <LoadingScreen sx={{ py: 10 }} />
          ) : (
            <RichTreeView
              expandedItems={expandedItems}
              sx={{ overflowX: 'hidden', minHeight: 240, width: 1 }}
              expansionTrigger='iconContainer'
              itemChildrenIndentation={30}
              slots={{ item: CustomTreeItem }}
              items={menuTree}
              selectedItems={selectedItems}
              onItemExpansionToggle={handleExpansionToggle}
              onItemSelectionToggle={handleSelectionToggle}
              checkboxSelection
              multiSelect
            />
          )}
        </>
      )} 
    </Box>
  );
}