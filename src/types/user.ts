export type IUserDto = {
    UserId?: string;
    EmpId: string;
    SssNo: string;
    FirstName: string;
    MiddleName?: string;
    LastName: string;
    EmailAddress: string;
    CompanyCode: string;
    CompanyDesc?: string;
    BranchCode: string;
    BranchDesc?: string;
    DivisionCode: string;
    DivisionDesc?: string;
    DepartmentCode: string;
    DepartmentDesc?: string;
    PositionLevelId: number;
    PositionDesc?: string;
    PositionCode: string;
    IsResigned: boolean;
    IsActive: boolean;
    Responsibility: string[];
}

export type IUserFilter = {
    Keyword: string;
    Company: string;
    Branch: string;
    Responsibility: string;
}


export type IUserFind = {
    Employeenumber: string;
    Sssnumber: string;
    Firstname: string;
    Middlename: string;
    Lastname: string;
    Emailaddress: string;
    Companycode: string;
    Branchcode: string;
    Divisioncode: string;
    Departmentcode: string;
    Positioncode: string;
    Positionlevel: string;
    Isresigned: string;
}

export type UserActiveInactive = {
    Active: number;
    Inactive: number;
}