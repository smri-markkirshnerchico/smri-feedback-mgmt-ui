import type { TabsProps } from '@mui/material/Tabs';
import type { Theme, SxProps } from '@mui/material/styles';

import NoSsr from '@mui/material/NoSsr';
import { tabClasses } from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

// ----------------------------------------------------------------------

export type CustomTabsProps = TabsProps & {
  slotProps?: TabsProps['slotProps'] & {
    scroller?: SxProps<Theme>;
    indicator?: SxProps<Theme>;
    tab?: SxProps<Theme>;
    selected?: SxProps<Theme>;
    scrollButtons?: SxProps<Theme>;
    list?: SxProps<Theme>;
  };
};

export function CustomTabs({ children, slotProps, sx, ...other }: CustomTabsProps) {
  return (
    <Tabs
      sx={[
        (theme) => ({
          gap: { sm: 0 },
          minHeight: 38,
          flexShrink: 0,
          alignItems: 'center',
          bgcolor: 'background.neutral',
          [`& .${tabsClasses.scroller}`]: { p: 1, ...slotProps?.scroller },
          [`& .${tabsClasses.list}`]: { gap: 0, ...slotProps?.list },
          [`& .${tabsClasses.scrollButtons}`]: {
            borderRadius: 1,
            minHeight: 'inherit',
            ...slotProps?.scrollButtons,
          },
          [`& .${tabsClasses.indicator}`]: {
            py: 1,
            height: 1,
            bgcolor: 'transparent',
            '& > span': {
              width: 1,
              height: 1,
              borderRadius: 1,
              display: 'block',
              bgcolor: 'common.white',
              boxShadow: theme.vars.customShadows.z1,
              ...theme.applyStyles('dark', {
                bgcolor: 'grey.900',
              }),
              ...slotProps?.indicator,
            },
          },
          [`& .${tabClasses.root}`]: {
            py: 1,
            px: { xs: 1, sm: 2 },
            zIndex: 1,
            minHeight: 'auto',
            ...slotProps?.tab,
            [`&.${tabClasses.selected}`]: { ...slotProps?.selected },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
      slotProps={{
        indicator: {
          children: (
            <NoSsr>
              <span />
            </NoSsr>
          ),
          sx: slotProps?.indicator,
        },
      }}
    >
      {children}
    </Tabs>
  );
}
