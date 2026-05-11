export interface IResponsibility {
    RespId: string;
    RespName: string;
    CoGrpCode: string;
    EffectiveDate: string;
    IsActive: boolean;
    RoleId: string;
    Module: {
        ModuleId: string;
        ModuleName: string;
        MenuId: string[];
        OrgAccess: IOrgAccess[]
    }[];
}

export interface IOrgAccess {
    OrgAccessId: string;
    CompanyCode: string;
    BranchCode: string;
    DivisionCode: string;
    DepartmentCode: string;
    PositionLevel: number[];
    CompanyDesc: string;
    BranchDesc: string;
    DivisionDesc: string;
    DepartmentDesc: string;
}