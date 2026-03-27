import {
  BaseRequest,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';

export enum CompanyActivityFields {
  CompanyId = 'idEmpresa',
  ActivityDesc = 'descripcionActividad',
  RevenueSource = 'fuenteIngresos',
  RangeCustomersCode = 'codRangoClientes',
  RangeSuppliersCode = 'codRangoProveedores',
  MainCustomer1 = 'principalCliente1',
  MainCustomer2 = 'principalCliente2',
  MainCustomer3 = 'principalCliente3',
  MainSupplier1 = 'principalProveedor1',
  MainSupplier2 = 'principalProveedor2',
  MainSupplier3 = 'principalProveedor3',
  RangeTerritory = 'descAmbitoTerritorio',
  HasOwnPremises = 'tieneLocalPropio',
  IsExporter = 'esExportador',
  IsEmployer = 'esEmpleador',
  Licenses = 'licencias',
  CompanyCompetitiveAdvantageCode = 'codEmpresaVentajaCompetencia',
  RangeCustomersDesc = 'descRangoClientes',
  RangeSuppliersDesc = 'descRangoProveedores',
  CompanyCompetitiveAdvantageDesc = 'descEmpresaVentajaCompetencia',
}

export interface CompanyActivity extends EntityWithId<number> {
  [CompanyActivityFields.CompanyId]: number;
  [CompanyActivityFields.ActivityDesc]: string;
  [CompanyActivityFields.RevenueSource]: string;
  [CompanyActivityFields.RangeCustomersCode]: number;
  [CompanyActivityFields.RangeSuppliersCode]: number;
  [CompanyActivityFields.MainCustomer1]: string;
  [CompanyActivityFields.MainCustomer2]: string;
  [CompanyActivityFields.MainCustomer3]: string;
  [CompanyActivityFields.MainSupplier1]: string;
  [CompanyActivityFields.MainSupplier2]: string;
  [CompanyActivityFields.MainSupplier3]: string;
  [CompanyActivityFields.RangeTerritory]?: string;
  [CompanyActivityFields.HasOwnPremises]: boolean;
  [CompanyActivityFields.IsExporter]: boolean;
  [CompanyActivityFields.IsEmployer]: boolean;
  [CompanyActivityFields.Licenses]: string;
  [CompanyActivityFields.CompanyCompetitiveAdvantageCode]: number;
}

export interface CompanyActivityView extends CompanyActivity {
  [CompanyActivityFields.RangeCustomersDesc]: string;
  [CompanyActivityFields.RangeSuppliersDesc]: string;
  [CompanyActivityFields.CompanyCompetitiveAdvantageDesc]: string;
}

export interface CompanyActivityInsert
  extends CompanyActivityView,
    BaseRequest {}

export interface CompanyRange extends EntityWithIdAndDescription {}
export interface CompanyCompetitiveAdvantage
  extends EntityWithIdAndDescription {}

export enum CompanyAfipActivityFields {
  Id = 'id',
  CompanyId = 'idEmpresa',
  AfipActivityCode = 'codAfipActividad',
  CLANAECode = 'descCodigoCLANAE',
  IsMainActivity = 'esActividadPrincipal',
  ActivityStartDate = 'fechaActividad',
  AfipAreaCode = 'codAfipRubro',
  AfipSectorCode = 'codAfipSector',
  AfipSepymeCode = 'codAfipRamoSepyme',
  AfipActivityDesc = 'descAfipActividad',
  AfipAreaDesc = 'descAfipRubro',
  AfipSectorDesc = 'descAfipSector',
  AfipSepymeDesc = 'descAfipRamoSepyme',
  RangeCustomersCode = 'codRangoClientes',
  RangeSuppliersCode = 'codRangoProveedores',
  MainCustomer1 = 'principalCliente1',
  MainCustomer2 = 'principalCliente2',
  MainCustomer3 = 'principalCliente3',
  MainSupplier1 = 'principalProveedor1',
  MainSupplier2 = 'principalProveedor2',
  MainSupplier3 = 'principalProveedor3',
}

export interface CompanyAfipActivityView extends EntityWithId<number> {
  [CompanyAfipActivityFields.CompanyId]: number;
  [CompanyAfipActivityFields.AfipActivityCode]: number;
  [CompanyAfipActivityFields.CLANAECode]: string;
  [CompanyAfipActivityFields.IsMainActivity]: boolean;
  [CompanyAfipActivityFields.ActivityStartDate]: Date;
  [CompanyAfipActivityFields.AfipAreaCode]: number;
  [CompanyAfipActivityFields.AfipSectorCode]: number;
  [CompanyAfipActivityFields.AfipSepymeCode]: number;
  [CompanyAfipActivityFields.AfipActivityDesc]: string;
  [CompanyAfipActivityFields.AfipAreaDesc]: string;
  [CompanyAfipActivityFields.AfipSectorDesc]: string;
  [CompanyAfipActivityFields.AfipSepymeDesc]: string;
  [CompanyAfipActivityFields.RangeCustomersCode]: number;
  [CompanyAfipActivityFields.RangeSuppliersCode]: number;
  [CompanyAfipActivityFields.MainCustomer1]: string;
  [CompanyAfipActivityFields.MainCustomer2]: string;
  [CompanyAfipActivityFields.MainCustomer3]: string;
  [CompanyAfipActivityFields.MainSupplier1]: string;
  [CompanyAfipActivityFields.MainSupplier2]: string;
  [CompanyAfipActivityFields.MainSupplier3]: string;
}
