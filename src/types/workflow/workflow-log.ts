export type IWorkflowLog = {

    WorkflowLogId: string;
    WorkflowExecutionId: string;
    StatusName: string;
    TransactionDate: Date;
    Executioner: string;
    Remarks?: string;
}