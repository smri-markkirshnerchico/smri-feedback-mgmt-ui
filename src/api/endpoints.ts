// ----------------------------------------------------------------------

const ROOTS = {
  Core: '/Core',
  Admin: '/Admin',
  Auth: '/Auth',
  Session: '/Session'
};

// ----------------------------------------------------------------------

export const endpoints = {
  core: {
    admin: {
      auth: {
        login: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Auth}/Login`,
        validate: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Auth}/Validate`,
        check: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Auth}/Check`,
        logout: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Auth}/Logout`
      },
      module: `${ROOTS.Core}${ROOTS.Admin}/Minimals/Module`,
      menu: `${ROOTS.Core}${ROOTS.Admin}/Minimals/Menu`,
      session: {
        companies: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Session}/Companies`,
        branches: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Session}/Branches`
      },
    }
  },
  application: {
    root: `/App`
  }
};