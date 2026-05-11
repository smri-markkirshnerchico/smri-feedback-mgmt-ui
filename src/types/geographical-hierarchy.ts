export type IGeographicalHierarchy = {
    RegionCode: string;
    RegionDesc: string;
    RegionName: string;
    Provinces: IGeoProvince[];
}

export type IGeoProvince = {
    ProvinceCode: string;
    ProvinceDesc: string;
    ProvinceName: string;
    Towns: IGeoTown[];
}

export type IGeoTown = {
    TownCode: string;
    TownDesc: string;
    TownName: string;
    Barangays: IGeoBarangay[];
}

export type IGeoBarangay = {
    BarangayCode: string;
    BarangayDesc: string;
    BarangayName: string;
}

export type IGeoHierarchyToTown = {
    RegionName: string;
    ProvinceName: string;
    TownCode: string;
    TownName: string;
}