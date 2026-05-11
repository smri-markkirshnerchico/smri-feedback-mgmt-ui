import type { IOrgAccess } from 'src/types/responsibility';

import { useState, useCallback, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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
import { LoadingScreen } from 'src/components/loading-screen';

import { ResponsibilityOrgAccessRow } from './responsibility-org-access-row';
import { ResponsibilityOrgAccessForm } from './responsibility-org-access-form';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'CompanyDesc', label: 'Company' },
  { id: 'BranchDesc', label: 'Branch' },
  { id: 'DivisionDesc', label: 'Division' },
  { id: 'DepartmentDesc', label: 'Department' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

type Props = {
  list: IOrgAccess[];
  loading: boolean;
  moduleId: string;
  respId: string;
  coGrpCode: string;
};

export function ResponsibilityOrgAccess({ list, loading, moduleId, respId, coGrpCode }: Readonly<Props>)  {  
  const table = useTable();

  const [search, setSearch] = useState<string>('');

  const dataFiltered = applyFilter({
    inputData: list,
    comparator: getComparator(table.order, table.orderBy),
    search: search,
  });

  const isEmpty = !list.length;

  const canReset = !!search;

  const notFound = (!dataFiltered.length && canReset) || isEmpty;

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage).length;

  useEffect(() => {
    if (dataInPage === 0) {
      table.onUpdatePageDeleteRow(dataInPage);
    }
  }, [dataInPage]);

  const formDialog = useBoolean();

  const [current, setCurrent] = useState<IOrgAccess>();

  const handleOpenForm = useCallback((item?: IOrgAccess) => {
    setCurrent(item);
    formDialog.onTrue();
  }, []);

  const renderHeader = () => (
    <Stack sx={{ flex: '1 1 auto' }}>
      <Typography variant="h6">
        Organization Access
      </Typography>
    </Stack>
  )

  const renderToolbar = () => (
    <>
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
          label="Search Access..."
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
          disabled={isEmpty}
        />

        <Button
          fullWidth
          color="primary"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenForm()}
          sx={{ width: { xs: 1, sm: 150 }, order: { xs: 1, sm: 2 } }}
        >
          Org Access
        </Button>
      </Box>

      {search && renderFilterResult()}
    </>
  );

  const renderFilterResult = () => (
    <Stack sx={{ flex: '1 1 auto' }}>
      <Typography variant="body2">
        <strong>{dataFiltered.length}</strong> results found
      </Typography>
    </Stack>
  );

  const renderformDialog = () => (
    <ResponsibilityOrgAccessForm
      current={current}
      moduleId={moduleId}
      respId={respId}
      coGrpCode={coGrpCode}
      open={formDialog.value}
      onClose={formDialog.onFalse}
    />
  );

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto' }}>
      {loading ? (
        <LoadingScreen sx={{ py: 10 }} />
      ) : (
        <Alert variant="outlined" severity="warning">
          No Access Found
        </Alert>
      )}
    </Stack>
  );

  const renderTable = () => (
    <>
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
              {loading ? (
                <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
              ) : (
                dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <ResponsibilityOrgAccessRow
                    key={row.OrgAccessId}
                    row={row}
                    onOpenForm={() => handleOpenForm(row)}
                  />
              )))}

              <TableEmptyRows
                height={56}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} sx={{ py: 1 }} />
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
    </>       
  );

  const renderContent = () => {
    if (isEmpty) return renderEmpty();
    return renderTable();
  };

  return (
    <Stack spacing={1.5}>
      {renderHeader()}
      {renderToolbar()}
      {renderContent()}
      {renderformDialog()}
    </Stack>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IOrgAccess[];
  search: string;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, search }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (search) {
    if (search?.toLowerCase() === "all") {
      inputData = inputData.filter((item) =>
        !item.CompanyDesc ||
        !item.BranchDesc ||
        !item.DivisionDesc ||
        !item.DepartmentDesc
      );
    }
    else {
      inputData = inputData.filter((item) =>
        item.CompanyDesc?.toLowerCase().includes(search.toLowerCase()) ||
        item.BranchDesc?.toLowerCase().includes(search.toLowerCase()) ||
        item.DivisionDesc?.toLowerCase().includes(search.toLowerCase()) ||
        item.DepartmentDesc?.toLowerCase().includes(search.toLowerCase())
      );
    }
  }

  return inputData;
}