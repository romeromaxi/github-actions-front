import { EntityWithId } from '../baseEntities';

export enum ActionFields {
  ActionName = 'nombre',
  ActionLabel = 'rotulo',
  Order = 'orden',
  ActionVirtualId = 'idAccionVirtual',
  ActionTypeCode = 'codAccionTipo',
  ActionClassificationCode = 'codAccionClasificacion',
  IsInternalAction = 'esAccionInterna',
  TypeApprovalActionCode = 'codAccionTipoAprobacion',
}

export interface ActionView extends EntityWithId<number> {
  [ActionFields.ActionName]: string;
  [ActionFields.ActionLabel]: string;
  [ActionFields.Order]: number;
  [ActionFields.ActionVirtualId]: number;
  [ActionFields.ActionTypeCode]: number;
  [ActionFields.ActionClassificationCode]: number;
  [ActionFields.IsInternalAction]: boolean;
  [ActionFields.TypeApprovalActionCode]?: number;
}

export enum ActionExecuteFields {
  MessageId = 'idMensaje',
  Value = 'valor',
  WorkflowVariables = 'variablesWorkflow',
  Observations = 'observaciones',
}

export interface ActionExecute {
  [ActionExecuteFields.MessageId]: number;
  [ActionExecuteFields.Value]?: number;
  [ActionExecuteFields.WorkflowVariables]?: VariableWorkflow[];
  [ActionExecuteFields.Observations]?: string;
}

export enum VariableWorkflowFields {
  Name = 'vchNombre',
  DecimalValue = 'decValor',
  StringValue = 'vchValor',
  DateValue = 'dtmValor',
  IntegerValue = 'intValor',
  ShortValue = 'sinValor',
}

export interface VariableWorkflow {
  [VariableWorkflowFields.Name]: string;
  [VariableWorkflowFields.DecimalValue]?: number;
  [VariableWorkflowFields.StringValue]?: string;
  [VariableWorkflowFields.DateValue]?: Date;
  [VariableWorkflowFields.IntegerValue]?: number;
  [VariableWorkflowFields.ShortValue]?: number;
}
