'use client';

import { IModule, IModuleFilter } from 'src/types/module';

import { useState, useCallback, useEffect } from 'react';
import { useSetState, useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { MainContent } from 'src/layouts/main';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
  type TableHeadCellProps
} from 'src/components/table';

import { Menu } from '../menu';
import { ModuleForm } from '../module-form';
import { ModuleTableRow } from '../module-table-row';
import { ModuleTableToolbar } from '../module-table-toolbar';
import { ModuleTableFiltersResult } from '../module-table-filters-result';

import { getModules } from 'src/api/admin/module';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'ModuleCode', label: 'Code' },
  { id: 'ModuleName', label: 'Name' },
  { id: 'EffectiveDate', label: 'EffectiveDate' },
  { id: 'IsActive', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ModuleView() {
  const table = useTable();

  const [appId, setAppId] = useState<string>('');

  const handleSelectApp = useCallback((item: string) => {
    setAppId(item);
  }, []);

  const { modules, modulesValidating, modulesEmpty } = getModules(appId);

  const [tableData, setTableData] = useState<IModule[]>(modules);

  useEffect(() => {
    setTableData(modules);
  }, [modules]);

  const filters = useSetState<IModuleFilter>({ status: '', keyword: '' });
  const { state: currentFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset = !!currentFilters.status || !!currentFilters.keyword;

  const notFound = (!dataFiltered.length && canReset) || modulesEmpty;

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage).length;

  useEffect(() => {
    if (dataInPage === 0) {
      table.onUpdatePageDeleteRow(dataInPage);
    }
  }, [dataInPage]);

  const formDialog = useBoolean();
  const menuDialog = useBoolean();

  const [current, setCurrent] = useState<IModule|undefined>();

  const handleOpenForm = useCallback((item?: IModule) => {
    setCurrent(item);
    formDialog.onTrue();
  }, []);

  const handleOpenMenu = useCallback((item?: IModule) => {
    setCurrent(item);
    menuDialog.onTrue();
  }, []);

  const renderFormDialog = () => (
    <ModuleForm
      current={current}
      appId={appId}
      open={formDialog.value}
      onClose={formDialog.onFalse}
    />
  );

  const renderMenuDialog = () => (
    !!current && (
      <Menu
        moduleId={current.ModuleId}
        moduleName={current.ModuleName}
        open={menuDialog.value}
        onClose={menuDialog.onFalse}
      />
    )
  );

  return (
    <MainContent>
      <CustomBreadcrumbs
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            color='primary'
            onClick={() => handleOpenForm()}
          >
            New
          </Button>
        }
      />

      <Card>
        <ModuleTableToolbar
          filters={filters}
          selectedApp={appId}
          onSelectApp={handleSelectApp}
          onResetPage={table.onResetPage}
        />

        {canReset && (
          <ModuleTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {modulesValidating ? (
                  <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                ) : (
                  dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ModuleTableRow
                      key={row.ModuleId}
                      row={row}
                      onOpenForm={() => handleOpenForm(row)}
                      onOpenMenu={() => handleOpenMenu(row)}
                    />
                )))}

                <TableEmptyRows
                  height={56}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />            
      </Card>

      {renderFormDialog()}
      {renderMenuDialog()}
    </MainContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IModule[];
  filters: IModuleFilter;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { status, keyword } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (status) {
    const isactive = status === 'Active';
    inputData = inputData.filter((list) => list.IsActive === isactive);
  }

  if (keyword) {
    inputData = inputData.filter((list) =>
      list.ModuleCode?.toLowerCase().includes(keyword.toLowerCase()) ||
      list.ModuleName?.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  return inputData;
}