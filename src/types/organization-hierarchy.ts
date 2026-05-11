export type IOrganizationalHierarchy = {
    CompanyCode: string;
    CompanyDesc: string;
    Branches: IOrgBranch[];
}

export type IOrgBranch = {
    BranchDesc: string;
    BranchCode: string;
    Divisions: IOrgDivision[];
}

export type IOrgDivision = {
    DivisionCode: string;
    DivisionDesc: string;
    Departments: IOrgDepartment[];
}

export type IOrgDepartment = {
    DepartmentCode: string;
    DepartmentDesc: string;
}