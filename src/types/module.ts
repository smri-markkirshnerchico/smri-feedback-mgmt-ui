export type IModule = {
    ModuleId: string;
    ModuleCode: string;
    ModuleName: string;
    EffectiveDate: string;
    Description: string;
    Alias: string;
    Icon: string;
    Url: string;
    IsActive: boolean;
    AppId: string;
};

export type IModuleFilter = {
    keyword: string;
    status: string;
};