export type ISessionAccess = {
    IsDevSet: boolean;
    IsDevOps: boolean;
    IsSysAd: boolean;
};

export type ISessionApplication = {
    AppId: string;
    AppCode: string;
    AppName: string;
};

export type ISessionModule = {
    ModuleId: string;
    ModuleCode: string;
    ModuleName: string;
    AppId: string;
};

export type ISessionCompanyGroups = {
    CoGrpCode: string;
    CoGrpDesc: string;
}

export type ISessionResponsibilities = {
    RespId: string;
    RespName: string;
}

export type ISessionCompanies = {
    CompanyCode: string;
    CompanyDesc: string;
}

export type ISessionBranches = {
    BranchCode: string;
    BranchDesc: string;
}

export type ISessionDivisions = {
    DivisionCode: string;
    DivisionDesc: string;
}

export type ISessionDepartments = {
    DepartmentCode: string;
    DepartmentDesc: string;
}

export type ISessionPositionLevels = {
    PositionLevelId: number;
    PositionLevelDesc: string;
}