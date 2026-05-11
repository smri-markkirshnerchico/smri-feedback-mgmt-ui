export type IHoliday = {
    HolidayId?: string;
    HolidayName: string;
    HolidayDescription?: string;
    HolidayType: string;
    IsFixed: boolean;
    IsNational: boolean;
    IsRecurring: boolean;
    Month?: number;
    Day?: number;
    HolidayDates: string[];
    Towns?: IHolidayTown[];
}

export type IHolidayTown = {
    TownCode: string;
    TownName: string;
}

export type IYearlySetupHolidayDto = {
    Year: number;
    HolidayDates: IHolidayDatesDto[];
}

export type IHolidayDatesDto = {
    HolidayId: string;
    EventDate: string;
}

export const calendarMonths = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
] as const;