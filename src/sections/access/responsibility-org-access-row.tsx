import type { IOrgAccess } from 'src/types/responsibility';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  row: IOrgAccess;
  onOpenForm: () => void; 
};

export function ResponsibilityOrgAccessRow({ row, onOpenForm }: Readonly<Props>)  {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.CompanyDesc ?? 'ALL'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.BranchDesc ?? 'ALL'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.DivisionDesc ?? 'ALL'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.DepartmentDesc ?? 'ALL'}</TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Edit">
            <IconButton color="inherit" onClick={onOpenForm}>
              <Iconify icon="solar:pen-bold-duotone" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}