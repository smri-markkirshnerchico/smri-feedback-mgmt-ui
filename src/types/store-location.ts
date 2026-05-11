export type IStoreLocation = {
    StLocId: number;
    Address: string;
    StoreOpening: string;
    CountryCode: string;
    Sato: string;
    CompanyCode: string;
    CompanyDesc: string;
    BranchCode: string;
    BranchDesc: string;
    RegionCode: string;
    RegionDesc: string;
    RegionName: string;
    ProvinceCode: string;
    ProvinceDesc: string;
    ProvinceName: string;
    TownCode: string;
    TownDesc: string;
    TownName: string;
    BarangayCode: string;
    BarangayDesc: string;
    BarangayName: string;
}

export type IStoreLocationFilter = {
    Keyword?: string;
    CompanyCode?: string;
    BranchCode?: string;
}