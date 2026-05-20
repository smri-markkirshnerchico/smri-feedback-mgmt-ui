'use client';

import { IApplication, IApplicationFilter } from 'src/types/application';

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

import { ApplicationForm } from '../application-form';
import { ApplicationTableRow } from '../application-table-row';
import { ApplicationTableToolbar } from '../application-table-toolbar';
import { ApplicationTableFiltersResult } from '../application-table-filters-result';

import { getApplications } from 'src/api/app/application';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'AppCode', label: 'Code' },
  { id: 'AppName', label: 'Name' },
  { id: 'IsActive', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ApplicationView() {
  const table = useTable();

  const { apps, appsValidating, appsEmpty } = getApplications();

  const [tableData, setTableData] = useState<IApplication[]>(apps);

  useEffect(() => {
    setTableData(apps);
  }, [apps]);

  const filters = useSetState<IApplicationFilter>({ status: '', keyword: '' });
  const { state: currentFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset = !!currentFilters.status || !!currentFilters.keyword;

  const notFound = (!dataFiltered.length && canReset) || appsEmpty;

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage).length;

  useEffect(() => {
    if (dataInPage === 0) {
      table.onUpdatePageDeleteRow(dataInPage);
    }
  }, [dataInPage]);

  const formDialog = useBoolean();

  const [current, setCurrent] = useState<IApplication|undefined>();

  const handleOpenForm = useCallback((item?: IApplication) => {
    setCurrent(item);
    formDialog.onTrue();
  }, []);

  const renderFormDialog = () => (
    <ApplicationForm
      current={current}
      open={formDialog.value}
      onClose={formDialog.onFalse}
    />
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
        <ApplicationTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
        />

        {canReset && (
          <ApplicationTableFiltersResult
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
                {appsValidating ? (
                  <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                ) : (
                  dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ApplicationTableRow
                      key={row.AppId}
                      row={row}
                      onOpenForm={() => handleOpenForm(row)}
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
    </MainContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IApplication[];
  filters: IApplicationFilter;
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
      list.AppCode?.toLowerCase().includes(keyword.toLowerCase()) ||
      list.AppName?.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  return inputData;
}