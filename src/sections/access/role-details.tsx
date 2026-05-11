import type { IRole } from 'src/types/role';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';

import { fDate } from 'src/utils/format-time';

import { Responsibility } from './responsibility';

// ----------------------------------------------------------------------

type Props = {
  selectedRole?: IRole;
  isDevSet: boolean;
};

export function RoleDetails({ selectedRole, isDevSet }: Readonly<Props>) {
  if (!selectedRole) {
    return <LoadingScreen />;
  }

  const renderHeader = () => (
    <Scrollbar>
      <Box sx={{ display: 'flex',  flexShrink: 0, alignItems: 'center' }}>
        <Box sx={{ gap: 1, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedRole.RoleName}
          </Typography>
          <Label
            variant="soft"
            color={(selectedRole.IsActive && 'success') || 'error'}
          >
            {(selectedRole.IsActive && 'Active') || 'Inactive'}
          </Label>
          {selectedRole.IsDevSet && (
            <Label
              variant="soft"
              color="warning"
            >
              DevSet
            </Label>
          )}
          {selectedRole.IsDevOps && (
            <Label
              variant="soft"
              color="info"
            >
              DevOps
            </Label>
          )}
          {selectedRole.IsSysAd && (
            <Label
              variant="soft"
              color="secondary"
            >
              SysAd
            </Label>
          )}
          <Label variant="soft">
            Effective {fDate(selectedRole.EffectiveDate)}
          </Label>
        </Box>
      </Box>
    </Scrollbar>
  );

  const renderContent = () => (
    <Responsibility role={selectedRole} isDevSet={isDevSet} />
  );

  return (
    <>
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          height: 56,
        }}
      >
        {renderHeader()}
      </Box>

      <Box
        sx={[
          (theme) => ({
            p: 2,
            gap: 2,
            borderTop: `1px solid ${theme.vars.palette.divider}`,
          }),
        ]}
      >
        {renderContent()}
      </Box>
    </>
  );
}
