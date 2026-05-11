// ----------------------------------------------------------------------

const ROOTS = {
  Admin: '/Admin',
  Auth: '/Auth',
  Session: '/Session',
  LOV: '/ListOfValues',
  User: '/User',
  Company: '/Company',
  Role: '/Role',
  Responsibility: '/Responsibility',
  CompanyGroup: '/CompanyGroup',
  Position: '/Position',
  PositionLevel: '/PositionLevel',
  OrganizationalHierarchy: '/OrganizationalHierarchy',
  Branch: '/Branch',
  PositionHierarchy: '/PositionHierarchy',
  StoreLocation: '/StoreLocation',
  GeoHierarchy: '/GeographicalHierarchy',
  SMEvents: '/SMEvents',
  Minimals: '/Minimals',
  Holiday: '/Holiday'
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: `${ROOTS.Admin}${ROOTS.Auth}/Login`,
    validate: `${ROOTS.Admin}${ROOTS.Auth}/Validate`,
    check: `${ROOTS.Admin}${ROOTS.Auth}/Check`,
    logout: `${ROOTS.Admin}${ROOTS.Auth}/Logout`
  },
  admin: {
    app: `${ROOTS.Admin}/App`,
    session: {
      access: `${ROOTS.Admin}${ROOTS.Session}/Access`,
      apps: `${ROOTS.Admin}${ROOTS.Session}/Apps`,
      modules: `${ROOTS.Admin}${ROOTS.Session}/Modules`,
      responsibilities: `${ROOTS.Admin}${ROOTS.Session}/Responsibilities`,
      companyGroups: `${ROOTS.Admin}${ROOTS.Session}/CompanyGroups`,
      companies: `${ROOTS.Admin}${ROOTS.Session}/Companies`,
      branches: `${ROOTS.Admin}${ROOTS.Session}/Branches`,
      divisions: `${ROOTS.Admin}${ROOTS.Session}/Divisions`,
      departments: `${ROOTS.Admin}${ROOTS.Session}/Departments`,
      positionLevels: `${ROOTS.Admin}${ROOTS.Session}/PositionLevels`
    },
    lov: {
      list: `${ROOTS.Admin}${ROOTS.LOV}/GetListOfValues`,
      createUpdate: `${ROOTS.Admin}${ROOTS.LOV}/CreateUpdateListOfValues`,
      getLOVByGroupAppCodeAndModuleCode: `${ROOTS.Admin}${ROOTS.LOV}/GetLOVByGroupAppCodeAndModuleCode`,
      getLOVByGroup: `${ROOTS.Admin}${ROOTS.LOV}/GetLOVByGroup`
    },
    user: {
      main: `${ROOTS.Admin}${ROOTS.User}`,
      list: `${ROOTS.Admin}${ROOTS.User}/GetAllUsers`,
      find: `${ROOTS.Admin}${ROOTS.User}/Find`,
      delete: `${ROOTS.Admin}${ROOTS.User}/DeleteUser`,
      getUserActiveInactive: `${ROOTS.Admin}${ROOTS.User}/GetUserActiveInactive`
    },
    module: `${ROOTS.Admin}/Module`,
    company: {
      list: `${ROOTS.Admin}${ROOTS.Company}/GetCompanies`,
    },
    companyGroup: {
      list: `${ROOTS.Admin}${ROOTS.CompanyGroup}/GetCompanyGroups`
    },
    position: {
      list: `${ROOTS.Admin}${ROOTS.Position}/GetPositions`
    },
    positionLevel: {
      list: `${ROOTS.Admin}${ROOTS.PositionLevel}/GetPositionLevels`
    },
    orgHierarchy: {
      list: `${ROOTS.Admin}${ROOTS.OrganizationalHierarchy}/GetOrgHierarchies`
    },
    menu: `${ROOTS.Admin}/Menu`,
    role: {
      root: `${ROOTS.Admin}${ROOTS.Role}`,
      moduleAccess: `${ROOTS.Admin}${ROOTS.Role}/ModuleAccess`
    },
    responsibility: {
      root: `${ROOTS.Admin}${ROOTS.Responsibility}`,
      moduleAccess: `${ROOTS.Admin}${ROOTS.Responsibility}/ModuleAccess`,
      orgAccess: `${ROOTS.Admin}${ROOTS.Responsibility}/OrgAccess`
    },
    branch: {
      list: `${ROOTS.Admin}${ROOTS.Branch}/GetBranches`
    },
    positionHierarchy: {
      list: `${ROOTS.Admin}${ROOTS.PositionHierarchy}/GetPositionHierarchies`
    },
    storeLocation: {
      list: `${ROOTS.Admin}${ROOTS.StoreLocation}/GetStoreLocations`
    },
    geoHierarchy: {
      list: `${ROOTS.Admin}${ROOTS.GeoHierarchy}/GetGeographicalHierarchies`
    },
    smEvents: {
      list: `${ROOTS.Admin}${ROOTS.SMEvents}/GetSMEventsByStLocId`,
      createUpdate: `${ROOTS.Admin}${ROOTS.SMEvents}/CreateUpdateSMEvent`,
      calendarEvents: `${ROOTS.Admin}${ROOTS.SMEvents}/GetCalendarEventsByStoreLocId`,
      delete: `${ROOTS.Admin}${ROOTS.SMEvents}/DeleteCalendarEvent`,
    },
    minimals: {
      root: `${ROOTS.Admin}${ROOTS.Minimals}`,
      module: `${ROOTS.Admin}${ROOTS.Minimals}/Module`,
      menu: `${ROOTS.Admin}${ROOTS.Minimals}/Menu`
    },
    holiday: {
      list: `${ROOTS.Admin}${ROOTS.Holiday}/GetHolidays`,
      createUpdate: `${ROOTS.Admin}${ROOTS.Holiday}/CreateUpdateHoliday`,
      getCalendarEventsByYear: `${ROOTS.Admin}${ROOTS.Holiday}/GetCalendarEventsByYear`,
      delete: `${ROOTS.Admin}${ROOTS.Holiday}/DeleteHoliday`,
      yearlySetup: `${ROOTS.Admin}${ROOTS.Holiday}/SetupYearlyHoliday`
    }
  },
};