export type ISMEvents = {
    SMEventId?: string;
    EventName: string;
    StLocId: string;
    EventDates: IEventDates[];
}

export type IEventDates = {
    Year?: number;
    StartDate: string;
    EndDate: string;
}