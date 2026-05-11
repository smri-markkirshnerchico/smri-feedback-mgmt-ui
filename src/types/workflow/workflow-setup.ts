export type IWorkflow = {

    WorkflowId?: string;
    WorkflowCode: string;
    WorkflowName: string;
    ModuleId: string;
    WorkflowGroupId: string;
    WorkflowFunctionIds: string[];
    WorkflowFieldIds: string[];
    WorkflowStageIds: string[];
    WorkflowTransitionIds: string[];

}

export type IWorkflowStage = {
    WorkflowStageId?: string;
    WorkflowStatusId: string;
    WorkflowStatusName?: string;
    IsStart: boolean;
    IsEnd: boolean;
    Sequence: number;
    FormColumnCount: number;
}

export type IWorkflowField = {
    WorkflowFieldId?: string;
    FieldName: string;
    FieldType: string;
    DefaultValue: any;
    DisplayName?: string;
    Formula?: string;
    DataSourceType?: string;
    DataSource?: string;
    DataSourceParams?: string;
}


export type IWorkflowFieldExtension = {
    WorkflowFieldId?: string;
    FieldName: string;
    FieldType: string;
    DefaultValue?: any;
    DisplayName?: string;
    Formula?: string;
    DataSourceType?: string;
    DataSource?: string;
    DataSourceParams?: string;
    DisplaySequence?: string;
    IsShowOnTable: boolean;
}

export type IWorkflowFunction = {
    WorkflowFunctionId?: string;
    FunctionName: string;
    Url: string;
    HttpMethod: string;
    BearerToken?: string | null;
    Body: IWorkflowBodyStructure[];
    Headers: Record<string, string>;
}

export type IWorkflowBodyStructure = {
    Type: string;
    Key: string;
    Value?: any;
}

export type IWorkflowTransition = {
    WorkflowTransitionId?: string;
    CurrentStageId: string;
    CurrentStageName?: string;
    ExpressionRule?: string;
    WorkflowActionId: string;
    WorkflowActionName?: string;
    NextStageId: string;
    NextStageName?: string;
    ApproverRoles: string[];
    ApproverRule: string;
    ApprovalCount?: number | undefined;
    FunctionIds?: string[];
    IsRequiredRemarks: boolean;
}

export type IWorkflowStageField = {
    WorkflowStageFieldId?: string;
    WorkflowStageId: string;
    StageFields: StageField[];
}

export type StageField = {

    WorkflowFieldId: string;
    DisplaySequence: number;
    WorkflowFieldName?: string;
    IsRequired: boolean;
    IsEditable: boolean;
    SpanCount: number;
    IsShowOnTable: boolean;
}


export type IWFTransitionFields = {
    WorkflowFieldId: string;
    IsRequired: boolean;
    IsEditable: boolean;
    DisplaySequence: number;
    SpanCount?: number;
    //Fied
    FieldType?: string;
    DisplayName?: string;
    FieldName?: string;

    //Data Source List
    DataSourceType?: "Static" | "API" | "LOV";
    DataSource?: string;
    DataSourceParams?: string;

    IsDivider?: boolean;
    UniqueId: string;

    IsShowOnTable: boolean;

}

export const PrimitiveDataTypes = [
    "String",
    "Integer",
    "Float",
    "Boolean",
    "Double",
    "Decimal",
    "DateTime",
    "Date",
    "Long",
    "Char",
    "File",
    "Label",
    "TextArea",
    "File Image" //Not primitive but included in the list
];