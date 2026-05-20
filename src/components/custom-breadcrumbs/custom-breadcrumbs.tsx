import type { Theme, SxProps } from '@mui/material/styles';
import type { BreadcrumbsProps } from '@mui/material/Breadcrumbs';

import Card from '@mui/material/Card';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useTheme } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import { BackLink } from './back-link';
import { MoreLinks } from './more-links';
import { BreadcrumbsLink } from './breadcrumb-link';
import {
  BreadcrumbsRoot,
  BreadcrumbsHeading,
  BreadcrumbsContent,
  BreadcrumbsContainer,
  BreadcrumbsSeparator,
} from './styles';
import { SvgColor } from '../svg-color';

import type { MoreLinksProps } from './more-links';
import type { BreadcrumbsLinkProps } from './breadcrumb-link';

import { CONFIG } from 'src/global-config';

import { usePathname } from 'src/routes/hooks';

import { getMenus } from 'src/api/core/menu';

// ----------------------------------------------------------------------

export type CustomBreadcrumbsSlotProps = {
  breadcrumbs: BreadcrumbsProps;
  moreLinks: Omit<MoreLinksProps, 'links'>;
  heading: React.ComponentProps<typeof BreadcrumbsHeading>;
  content: React.ComponentProps<typeof BreadcrumbsContent>;
  container: React.ComponentProps<typeof BreadcrumbsContainer>;
};

export type CustomBreadcrumbsSlots = {
  breadcrumbs?: React.ReactNode;
};

export type CustomBreadcrumbsProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  activeLast?: boolean;
  backHref?: string;
  action?: React.ReactNode;
  moreLinks?: MoreLinksProps['links'];
  slots?: CustomBreadcrumbsSlots;
  slotProps?: Partial<CustomBreadcrumbsSlotProps>;
  customTitle?: string;
};

export function CustomBreadcrumbs({
  sx,
  action,
  backHref,
  slots = {},
  moreLinks = [],
  slotProps = {},
  activeLast = false,
  customTitle
}: CustomBreadcrumbsProps) {
  const theme = useTheme();

  const { navData } = getMenus();

  const pathname = usePathname();

  const getPathBreadcrumbs = (nav: typeof navData, path: string): { heading: string; links: BreadcrumbsLinkProps[] } => {
    const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
    const paths: string[] = [];

    for (let i = 1; i < parts.length; i++) {
      paths.push("/" + parts.slice(0, i + 1).join("/"));
    }

    const links: BreadcrumbsLinkProps[] = [];

    const findTitle = (nav: typeof navData, path: string): string => {
      for (const list of nav) {
        for (const item of list.items) {
          if (item.path === path) return item.title;

          if (item.children) {
            const childTitle = findTitle([{ items: item.children }], path);
            if (childTitle) return childTitle;
          }
        }
      }
      return '';
    };

    for (const path of paths) {
      const title = findTitle(nav, path);
      if (title) links.push({ name: title });
    }

    return { heading: links.at(-1)?.name ?? '', links };
  };

  const pathBreadcrums = getPathBreadcrumbs(navData, pathname);

  const heading = customTitle ?? pathBreadcrums.heading;
  const links = pathBreadcrums.links;

  const lastLink = links.at(-1)?.name;

  const renderHeading = () => (
    <BreadcrumbsHeading {...slotProps?.heading}>
      {backHref ? <BackLink href={backHref} label={heading} /> : heading}
    </BreadcrumbsHeading>
  );

  const renderLinks = () =>
    slots?.breadcrumbs ?? (
      <Breadcrumbs separator={<BreadcrumbsSeparator />} {...slotProps?.breadcrumbs}>
        {links.map((link, index) => (
          <BreadcrumbsLink
            key={link.name ?? index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            disabled={link.name === lastLink && !activeLast}
          />
        ))}
      </Breadcrumbs>
    );

  const renderMoreLinks = () => <MoreLinks links={moreLinks} {...slotProps?.moreLinks} />;

  return (
    <Card
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(to right, ${theme.vars.palette.grey[900]} 15%, 
              ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.88)})`,
              `url(${CONFIG.assetsDir}/assets/images/mock/cover/cover-6.webp)`,
            ],
          }),
          p: 4,
          mb: 3,
          borderRadius: 2,
          boxShadow: 'none'
        })
      ]}
    >
      <BreadcrumbsRoot>
        <BreadcrumbsContainer {...slotProps?.container}>
          <BreadcrumbsContent {...slotProps?.content}>
            {(heading || backHref) && renderHeading()}
            {(!!links.length || slots?.breadcrumbs) && renderLinks()}
          </BreadcrumbsContent>
          {action}
        </BreadcrumbsContainer>

        {!!moreLinks?.length && renderMoreLinks()}
      </BreadcrumbsRoot>

      <SvgColor
        src={'/assets/background/shape-square.svg'}
        sx={{
          top: 0,
          left: 0,
          width: 280,
          zIndex: -1,
          height: 280,
          opacity: 0.12,
          position: 'absolute',
          transform: 'rotate(220deg)',
          color: theme.palette.primary.lighter
        }}
      />
    </Card>
  );
}
