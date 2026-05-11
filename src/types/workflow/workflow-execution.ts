export type IWorkflowExecution = {
    WorkflowExecutionId?: string;
    WorkflowId: string;
    ReferenceId?: string;
    CurrentStageId: string;
    StartedAt: string;
    EndedAt: string;
    MetaData: Record<string, any>;
}

export type FieldValueDto = {
    FieldName: string;
    Value?: string;
}

export type IWorkflowExecutionCreate = {
    WorkflowId: string;
    ReferenceId?: string;
    MetaData: Record<string, object>;
}

export type IWorkflowExecutionUpdate = {
    WorkflowExecutionId: string;
    WorkflowCode: string;
    UserActionId: string;
    MetaData: Record<string, object>;
    Remarks?: string;
}