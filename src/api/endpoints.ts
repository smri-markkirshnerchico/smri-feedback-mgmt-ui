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
      user: {
        list: `${ROOTS.Core}${ROOTS.Admin}/User/GetAllUsers`
      },
      session: {
        companies: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Session}/Companies`,
        branches: `${ROOTS.Core}${ROOTS.Admin}${ROOTS.Session}/Branches`
      },
    }
  },
  application: {
    root: `/App`,
    feedback: {
      root: `/Feedback`,
      approve: (id: string) => `/Feedback/${id}/approve`,
      reject: (id: string) => `/Feedback/${id}/reject`,
    }
  }
};