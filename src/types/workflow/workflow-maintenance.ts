export type IWorkflowAction = {
    WorkflowActionId?: string;
    ActionCode: string;
    ActionName: string;
    ActionDescription?: string;
    Icon?: string;
    Color?: string;
    IsRequiredRemarks?: boolean;
}

export type IWorkflowStatus = {
    WorkflowStatusId?: string;
    StatusCode: string;
    StatusName: string;
    StatusDescription?: string;
}

export type IWorkflowGroup = {
    WorkflowGroupId?: string;
    GroupCode: string;
    GroupName: string;
    GroupDescription?: string;
    QueueName: string;
}