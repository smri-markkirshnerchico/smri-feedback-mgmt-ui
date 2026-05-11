import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

type ProfileLayoutProps = React.ComponentProps<'div'> & {
  slots?: {
    header: React.ReactNode;
    list: React.ReactNode;
    details: React.ReactNode;
  };
};

export function AccessLayout({ slots }: ProfileLayoutProps) {
  return (
    <LayoutRoot 
      sx={{
        p: 1,
        borderRadius: 2,
        flex: '1 1 auto'
      }}
    >
      {slots?.header}

      <LayoutContainer>
        <LayoutList>{slots?.list}</LayoutList>
        <LayoutDetails>{slots?.details}</LayoutDetails>
      </LayoutContainer>
    </LayoutRoot>
  );
}

// ----------------------------------------------------------------------

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.vars.customShadows.card,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.vars.palette.background.paper
}));

const LayoutContainer = styled('div')(({ theme }) => ({
  gap: theme.spacing(1),
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
}));

const LayoutList = styled('div')(({ theme }) => ({
  display: 'none',
  flex: '0 0 300px',
  overflow: 'hidden',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 1.5,
  [theme.breakpoints.up('md')]: { display: 'flex' },
}));

const LayoutDetails = styled('div')(({ theme }) => ({
  minWidth: 0,
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `solid 1px ${theme.vars.palette.divider}`,
}));