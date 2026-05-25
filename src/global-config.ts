import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  isStaticExport: boolean;
  appCode: string;
  moduleCode: string;
  domainUrl: string;
  iconifyUrl: string;
  moduleId: string;
  feedbackAppId: string;
  devRole: 'employee' | 'manager' | 'admin';
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Feedback',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  appCode: process.env.NEXT_PUBLIC_APP_CODE ?? '',
  moduleCode: process.env.NEXT_PUBLIC_MODULE_CODE ?? '',
  domainUrl: process.env.NEXT_PUBLIC_DOMAIN_URL ?? '',
  iconifyUrl: process.env.NEXT_PUBLIC_ICONIFY_URL ?? '',
  moduleId: process.env.NEXT_PUBLIC_MODULE_ID ?? '',
  feedbackAppId: process.env.NEXT_PUBLIC_FEEDBACK_APP_ID ?? '',
  /**
   * Auth
   * @method jwt
   */
  devRole: (process.env.NEXT_PUBLIC_DEV_ROLE ?? 'manager') as 'employee' | 'manager' | 'admin',
  auth: {
    method: 'jwt',
    skip: process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true',
    redirectPath: paths.main.home,
  }
};
