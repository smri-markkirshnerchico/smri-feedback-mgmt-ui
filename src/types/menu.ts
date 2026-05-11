export type IMenu = {
    MenuId: string;
    MenuName: string;
    Description: string;
    Icon: string;
    Link: string;
    Sequence: number;
    EffectiveDate: string;
    IsFolder: boolean;
    IsActive: boolean;
    ParentMenuId: string;
};