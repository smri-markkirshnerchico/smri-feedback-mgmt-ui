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
      myFeedback: `${ROOTS.MAIN}/employee/my-feedback`,
    },
    manager: {
      dashboard: `${ROOTS.MAIN}/manager/dashboard`,
    },
    admin: {
      dashboard: `${ROOTS.MAIN}/admin/dashboard`,
    },
  },
};
