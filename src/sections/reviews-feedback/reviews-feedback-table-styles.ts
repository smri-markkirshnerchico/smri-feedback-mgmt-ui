import type { Theme, SxProps } from '@mui/material/styles';

import type { TableHeadCellProps } from 'src/components/table';

// ----------------------------------------------------------------------

type ReviewsFeedbackTableRowSxOptions = {
  clickable?: boolean;
};

/** Card-style table row borders on cells (tr borders are unreliable in tables). */
export function reviewsFeedbackTableRowSx(
  theme: Theme,
  options?: ReviewsFeedbackTableRowSxOptions
): SxProps<Theme> {
  const borderColor = theme.vars.palette.divider;

  return {
    bgcolor: theme.vars.palette.background.paper,
    boxShadow: theme.vars.customShadows.z1,
    ...(options?.clickable && {
      cursor: 'pointer',
      '&:hover': { bgcolor: theme.vars.palette.action.hover },
    }),
    '& > td': {
      py: 2,
      borderTop: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
      borderBottomStyle: 'solid',
      borderLeft: 'none',
      borderRight: 'none',
      '&:first-of-type': {
        borderLeft: `1px solid ${borderColor}`,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      },
      '&:last-of-type': {
        borderRight: `1px solid ${borderColor}`,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
      },
    },
  };
}

// ----------------------------------------------------------------------
export const REVIEWS_FEEDBACK_TABLE_HEAD_CELL_SX = {
  color: 'text.secondary',
  bgcolor: 'background.neutral',
} as const;

export function withReviewsFeedbackTableHeadSx(
  headCells: TableHeadCellProps[]
): TableHeadCellProps[] {
  return headCells.map((cell) => ({
    ...cell,
    sx: { ...REVIEWS_FEEDBACK_TABLE_HEAD_CELL_SX, ...cell.sx },
  }));
}
