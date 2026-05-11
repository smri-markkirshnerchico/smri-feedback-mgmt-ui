export type ListOfValueDto = {
    LOVID?: string;
    LOVGroup: string;
    IsActive: boolean;
    Values: LOValuesDto[];
    // Access: ApplicationDataDto[];
}
export type ApplicationDataDto = {
    AppId: string;
    AppName: string;
    Modules: ModuleDataDto[];
}

export type ModuleDataDto = {
    ModuleId: string;
    ModuleName: string;
}

export type LOVFilter = {
    // AppId: string;
    ModuleId: string;
    Keyword: string
}

export type LOValuesDto = {
    LOVCode: string;
    LOVDescription: string;
    Remarks?: string | null;
    ReturnValue?: string | null;
    DisplaySequence: number;
    Modules: ModuleDataDto[];
}