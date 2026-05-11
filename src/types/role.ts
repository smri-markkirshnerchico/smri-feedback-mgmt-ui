export interface IRole {
    RoleId: string;
    RoleCode: string;
    RoleName: string;
    EffectiveDate: string;
    IsActive: boolean;
    IsDevSet: boolean;
    IsDevOps: boolean;
    IsSysAd: boolean;
    IsWF: boolean;
    AppId: string;
    Module: {
        ModuleId: string;
        MenuId: string[];
    }[];
}