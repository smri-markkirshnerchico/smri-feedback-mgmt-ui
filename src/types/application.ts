export type IApplication = {
    AppId: string;
    AppCode: string;
    AppName: string;
    IsActive: boolean;
};

export type IApplicationFilter = {
    keyword: string;
    status: string;
};