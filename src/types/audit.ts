export type IAuditLog = {
    AuditLogId: string;
    DocumentId: string;
    CollectionName: string;
    Action: string;
    New?: string;
    Old?: string;
    AppCode: string;
    ModuleCode: string;
    ExecutedAt: string;
    ExecutedBy: string;
}

export type IAuditLogFilter = {
    Keyword?: string;
    AppCode?: string;
    ModuleCode?: string;
    Collection?: string;
    FromDate?: string;
    ToDate?: string;
    Limit?: number;
    PageNumber: number;
}

export type TransactionChartData = {
    categories: string[];
    series: {
        data: number[];
    }[];
    total: number;
    percent: number;
};