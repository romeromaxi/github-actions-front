import { BaseRequest } from '../baseEntities';
import {
  Flow,
  FlowFields,
  FlowInsert,
  FlowSemesterData,
  FlowSemesterDelete,
  FlowSemesterView
} from "../general/generalFinanceData";

export enum CompanyFlowFields {
  CompanyId = 'idEmpresa'
}

interface CompanyFlow extends Flow {
  [CompanyFlowFields.CompanyId]: number;
}

export interface CompanyFlowView extends CompanyFlow { }

export interface CompanyFlowInsert extends FlowInsert { }

export enum CompanyFlowInsertRequestFields {
  FlowList = 'lstEmpresaMovimientos',
}
export interface CompanyFlowInsertRequest extends BaseRequest {
  [CompanyFlowInsertRequestFields.FlowList]: CompanyFlowInsert[];
}

export interface CompanyFlowTotals {
  [CompanyFlowFields.CompanyId]: number;
  [FlowFields.Income]: number;
  [FlowFields.Sale]: number;
}

export interface CompanyFlowSemesterData extends FlowSemesterData { }

export interface CompanySemesterFlowView extends FlowSemesterView { }

export interface CompanySemesterFlowDelete extends FlowSemesterDelete { }