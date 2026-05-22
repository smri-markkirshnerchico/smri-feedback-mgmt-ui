// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  MAIN: '/main',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`
    }
  },
  // MAIN
  main: {
    home: `${ROOTS.MAIN}/home`,
    employee: {
      dashboard: `${ROOTS.MAIN}/employee/dashboard`,
    },
    manager: {
      dashboard: `${ROOTS.MAIN}/manager/dashboard`,
    },
    admin: {
      dashboard: `${ROOTS.MAIN}/admin/dashboard`,
    },
  },
};
