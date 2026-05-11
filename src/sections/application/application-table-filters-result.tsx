import type { IApplicationFilter } from 'src/types/application';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<IApplicationFilter>;
};

export function ApplicationTableFiltersResult({ filters, onResetPage, totalResults }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ keyword: '' });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={{ p: 2, pt: 0 }}>
      <FiltersBlock label="Status:" isShow={currentFilters.status !== ''}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
      
      <FiltersBlock label="Keyword:" isShow={!!currentFilters.keyword}>
        <Chip {...chipProps} label={currentFilters.keyword} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
