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
      needsMyReview: `${ROOTS.MAIN}/employee/needs-my-review`,
    },
    manager: {
      dashboard: `${ROOTS.MAIN}/manager/dashboard`,
      myFeedback: `${ROOTS.MAIN}/manager/my-feedback`,
      needsMyReview: `${ROOTS.MAIN}/manager/needs-my-review`,
      myTeamsReview: `${ROOTS.MAIN}/manager/my-teams-review`,
    },
    admin: {
      dashboard: `${ROOTS.MAIN}/admin/dashboard`,
    },
  },
};
