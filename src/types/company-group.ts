export type ICompanyGroup = {
    GroupCode: string;
    GroupDesc: string;
    IsActive: boolean;
    Companies: IGroupCompany[];
}

export type IGroupCompany = {
    CompanyCode: string;
    CompanyDesc: string;
}