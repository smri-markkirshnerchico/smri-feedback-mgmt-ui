export type IPositionHierarchy = {
    PositionCode: string;
    PositionLongDesc: string;
    Companies: IPosCompany[];
}

export type IPosCompany = {
    CompanyCode: string;
    CompanyDesc: string;
    PositionLevelId?: number;
    Description?: string;
    Branches: IPosBranch[];

}

export type IPosBranch = {
    BranchCode: string;
    BranchDesc: string;
    Divisions?: IPosDivision[];
}

export type IPosDivision = {
    DivisionCode: string;
    DivisionDesc: string;
}