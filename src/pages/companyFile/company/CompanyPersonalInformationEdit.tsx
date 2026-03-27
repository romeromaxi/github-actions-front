import React, { useEffect, useState } from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { Alert, Skeleton } from '@mui/lab';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog, DialogActions,
    DialogContent,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import {
  AsyncSelect,
  ControlledRadioYesNo,
  ControlledTextFieldFilled,
} from 'components/forms';
import { DataWithLabel } from 'components/misc/DataWithLabel';
import SectionDivider from 'components/cards/SectionDivider';
import {
  CloseButton,
  EditIconButton,
  SaveButton,
} from 'components/buttons/Buttons';

import AddressFormBoxListManager from 'pages/company/components/addresses/AddressFormBoxListManager';

import {
  HttpCacheCompany,
  HttpCacheGeneral,
  HttpCachePerson,
  HttpCompanyPhoneNumber
} from 'http/index';
import { AddressTypes } from 'types/general/generalEnums';
import {
  CompanyActivityFields,
  CompanyAfipActivityFields,
  CompanyAfipActivityView,
} from 'types/company/companyActivityData';
import {
  CompanyDetailFormFields,
  CompanyFields,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';

import {
  CompanyFileEditProfileForm,
  CompanyFileEditProfileFormFields,
} from '../homesEdit/CompanyFileHomeEditProfile';

import { ControlledDatePicker } from 'components/forms/ControlledDatePicker';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { PersonTypes } from 'types/person/personEnums';
import { HttpCompanyAfipActivity } from 'http/company/httpCompanyActivity';
import { EntityWithIdFields } from 'types/baseEntities';
import PhoneFormBoxList from '../../company/components/phones/PhoneFormBoxList';
import {
  EntityAddress,
  EntityAddressFields,
  EntityPhoneNumber,
  EntityPhoneNumberFields,
} from '../../../types/general/generalReferentialData';
import { AddressFormatter } from '../../../util/formatters/addressFormatter';
import FinancialYearEditComponent from '../../company/finance/components/FinancialYearEditComponent';
import CompanyFlowForm from '../../company/flow/CompanyFlowForm';
import CompanyFlowChart from '../../company/flow/CompanyFlowChart';
import CompanyFlowYearlyTotals from '../../company/flow/CompanyFlowYearlyTotals';
import { CompanyFlowSemesterData } from '../../../types/company/companyFlowData';
import CompanyDeclarationOfAssetsEditTabs from '../../company/finance/declarationAssets/CompanyDeclarationOfAssetsEditTabs';
import { CompanyDeclarationOfAssetsFormFields } from '../../company/finance/declarationAssets/CompanyDeclarationOfAssetsEditCard';
import { CompanyPhoneNumberFields } from '../../../types/company/companyReferentialData';
import {
  CompanyDeclarationOfAssetsTotals,
  CompanyDeclarationOfAssetsTotalsFields,
  CompanyPatrimonialStatement,
} from '../../../types/company/companyFinanceInformationData';
import {
  FinancialYearEditFormFields,
  FinancialYearEditFormType
} from "../../company/finance/components/FinancialYearDetail";
import {PatrimonialStatementFields} from "../../../types/general/generalFinanceData";
import BaseDialogTitle from "../../../components/dialog/BaseDialogTitle";

interface CompanyPersonalInformationEditProps {
  onSubmit: (data: CompanyFileEditProfileForm) => void;
  company: CompanyViewDTO | any;
  marketEdit?: boolean;
  financialYear?: number;
  flows?: CompanyFlowSemesterData[];
  loading?: boolean;
  canEditEconomicInfo?: boolean;
}

const isCompleteDeclaration = (totals: CompanyDeclarationOfAssetsTotals[]) => {
  const mainDeclaration: CompanyDeclarationOfAssetsTotals = totals[0];

  return (
    (mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.ActiveTotal] !==
      0 ||
      mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.PassiveTotal] !==
        0) &&
    mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.ActiveTotal] ===
      mainDeclaration[
        CompanyDeclarationOfAssetsTotalsFields.NetPatrimonyTotal
      ] +
        mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.PassiveTotal]
  );
};

const isCompleteFinancial = (
  financialYear: FinancialYearEditFormType,
) => {
  const patrimonial: CompanyPatrimonialStatement =
    financialYear[FinancialYearEditFormFields.PatrimonialStatement];

  return (
    (patrimonial[PatrimonialStatementFields.ActiveTotal] !== 0 ||
      patrimonial[PatrimonialStatementFields.PassiveTotal] !== 0) &&
    patrimonial[PatrimonialStatementFields.ActiveTotal] ===
      patrimonial[PatrimonialStatementFields.NetPatrimonyTotal] +
        patrimonial[PatrimonialStatementFields.PassiveTotal]
  );
};

function CompanyPersonalInformationEdit({
  onSubmit,
  company,
  financialYear,
  flows,
  loading,
  marketEdit,
  canEditEconomicInfo
}: CompanyPersonalInformationEditProps) {
  const navigate = useNavigate();
  const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
  const baseNameActivity: string = CompanyFileEditProfileFormFields.Activity;
  const isLegalPerson: boolean =
    !!company &&
    company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;
  const [afipActivity, setAfipActivity] = useState<CompanyAfipActivityView>();
  const obligatoryTypes: AddressTypes[] = [AddressTypes.ActivityMain];
  const [openPhones, setOpenPhones] = useState<boolean>(false);
  const [openAddresses, setOpenAddresses] = useState<boolean>(false);
  const [isLoadingAct, setLoadingAct] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [address, setAddress] = useState<string>('');
  const methods = useFormContext();
  const hasClosingDate: boolean =
    !!company[CompanyViewDTOFields.DayClosing] &&
    !!company[CompanyViewDTOFields.MonthClosing];
  const dateClosing: string = hasClosingDate
    ? `${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`
    : '';
  const watchPhones = methods.watch(
    `${baseNameCompany}.${CompanyDetailFormFields.Phone}`,
  );
  const watchAddresses = methods.watch(
    `${baseNameCompany}.${CompanyViewDTOFields.Address}`,
  );
  const watchLastFinance = methods.watch(
    `${CompanyFileEditProfileFormFields.LastFinance}`,
  );
  const watchPrevFinance = methods.watch(
    `${CompanyFileEditProfileFormFields.PrevFinance}`,
  );

  const isLoading: boolean =
    methods.watch(`${baseNameCompany}.${CompanyViewDTOFields.CUIT}`) ==
    undefined;
  const watchDeclarationOfAssets = methods.watch(
    `${CompanyFileEditProfileFormFields.DeclarationOfAssets}.${CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets}`,
  );
  const hasCertificatePyme: boolean =
    methods.watch(
      `${baseNameCompany}.${CompanyViewDTOFields.HasCertificatePyme}`,
    ) || false;
  const location = useLocation();

  const completeFinanceData = isLegalPerson
    ? !!watchLastFinance &&
      !!watchPrevFinance &&
      isCompleteFinancial(watchLastFinance) &&
      isCompleteFinancial(watchPrevFinance)
    : !!watchDeclarationOfAssets &&
      isCompleteDeclaration([watchDeclarationOfAssets]);

  const loadPhoneNumber = () => {
    HttpCompanyPhoneNumber.getMain(company[EntityWithIdFields.Id]).then(
      (phone) => {
        setPhoneNumber(
          stringFormatter.phoneNumberWithAreaCode(
            phone[CompanyPhoneNumberFields.AreaCode],
            phone[CompanyPhoneNumberFields.PhoneNumber],
          ),
        );
      },
    );
  };
  // @ts-ignore
  const creditCompanyFile = marketEdit ? true : location.state ? location.state.prevPathname.includes('?tipo=2') : false

  const searchMainActivity = () => {
    setLoadingAct(true);
    HttpCompanyAfipActivity.getByCompanyId(company[EntityWithIdFields.Id]).then(
      (listActivities) => {
        setAfipActivity(
          listActivities.filter(
            (x) => x[CompanyAfipActivityFields.IsMainActivity],
          )[0] ?? undefined,
        );
        setLoadingAct(false);
      },
    );
  };

  useEffect(() => {
    searchMainActivity();
    // searchPersonRelationship()
    loadPhoneNumber();
    getActivityAddress(company[CompanyViewDTOFields.Address]);
  }, []);

  useEffect(() => {
    if (watchPhones && watchPhones.length !== 0) {
      const mainPhone: EntityPhoneNumber = watchPhones.find(
        (ph) => ph[EntityPhoneNumberFields.MainPhone],
      );
      if (!!mainPhone)
        setPhoneNumber(
          stringFormatter.phoneNumberWithAreaCode(
            mainPhone[CompanyPhoneNumberFields.AreaCode] || '',
            mainPhone[CompanyPhoneNumberFields.PhoneNumber] || '',
          ),
        );
    }
  }, [watchPhones]);

  useEffect(() => {
    getActivityAddress(watchAddresses);
  }, [watchAddresses]);

  const onHandleSubmit = methods.handleSubmit((data) =>
    onSubmit(data as CompanyFileEditProfileForm),
  );

  const onHandleBackPage = () => navigate(-1);

  useEffect(() => {
    if (!hasCertificatePyme) {
      methods.setValue(
        `${baseNameCompany}.${CompanyViewDTOFields.CertificatePymeDate}`,
        null,
      );
      methods.setValue(
        `${baseNameCompany}.${CompanyFields.AfipSectionCode}`,
        null,
      );
    }
  }, [hasCertificatePyme]);

  const handleFocus = (e: any) => e.target.select();

  const getActivityAddress = (addresses?: EntityAddress[]) => {
    if (addresses && addresses.length !== 0) {
      const activityAddress = addresses.find(
        (x) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity,
      );
      if (activityAddress) {
        setAddress(AddressFormatter.toFullAddress(activityAddress));
      }
    }
  };

  return (
    <Card>
      <form onSubmit={onHandleSubmit} style={{ marginTop: '4px' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Typography fontWeight={600} fontSize={18}>
                  Información general de la empresa
                </Typography>
                <SaveButton type="submit" size={'small'}>{marketEdit ? 'Guardar Legajo' : 'Guardar'}</SaveButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6} container>
              <Grid item xs={12} container>
                <Grid item xs={12} container justifyContent={'space-between'}>
                  <Grid item xs={12}>
                    <SectionDivider title={'Datos de Contacto'} />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    container
                    alignItems={'center'}
                    mt={1}
                    spacing={2}
                  >
                    <Grid item xs={6}>
                      {!isLoading ? (
                        <DataWithLabel
                          label="Razón Social"
                          data={methods.watch(
                            `${baseNameCompany}.${CompanyFields.BusinessName}`,
                          )}
                          rowDirection
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <DataWithLabel
                        label={'CUIT'}
                        data={stringFormatter.formatCuit(
                          company[CompanyViewDTOFields.CUIT],
                        )}
                        rowDirection
                      />
                    </Grid>

                    {!isLegalPerson ? (
                      !isLoading ? (
                        <>
                          <Grid item xs={6}>
                            <DataWithLabel
                              label="Tipo Documento"
                              data={
                                methods.watch(
                                  `${baseNameCompany}.${CompanyFields.DocumentTypeDesc}`,
                                ) || '-'
                              }
                              rowDirection
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <DataWithLabel
                              label="Nro. Documento"
                              data={methods.watch(
                                `${baseNameCompany}.${CompanyFields.DocumentNumber}`,
                              )}
                              rowDirection
                            />
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <ControlledDatePicker
                              control={methods.control}
                              label={'Fecha de Nacimiento'}
                              name={`${baseNameCompany}.${CompanyFields.BirthdayDate}`}
                              loadPending
                              filled
                            />
                          </Grid>
                        </>
                      ) : (
                        <Grid item xs={12} container spacing={1} mt={3}>
                          {Array.from({ length: 3 }).map((key) => (
                            <Grid
                              item
                              xs={6}
                              key={`skeletonDatosContactoHumana_${key}`}
                            >
                              <Skeleton />
                            </Grid>
                          ))}
                        </Grid>
                      )
                    ) : (
                      <></>
                    )}

                    <Grid item xs={6} md={6}>
                      <ControlledTextFieldFilled
                        control={methods.control}
                        label={'Mail'}
                        name={`${baseNameCompany}.${CompanyFields.Mail}`}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <ControlledTextFieldFilled
                        control={methods.control}
                        label={'Red Social'}
                        name={`${baseNameCompany}.${CompanyFields.SocialNetwork}`}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <ControlledTextFieldFilled
                        control={methods.control}
                        label={'Web'}
                        name={`${baseNameCompany}.${CompanyFields.Web}`}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {!isLoading ? (
                        <ControlledRadioYesNo
                          label="¿Es liderada por mujeres?"
                          control={methods.control}
                          setValue={methods.setValue}
                          name={`${baseNameCompany}.${CompanyFields.IsLeadByWoman}`}
                          loadPending
                          row
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      {!isLoading && !isLegalPerson && (
                          <ControlledRadioYesNo name={`${baseNameCompany}.${CompanyViewDTOFields.IsPoliticallyExposed}`}
                                                control={methods.control}
                                                setValue={methods.setValue}
                                                label={'Persona políticamente expuesta (PEP)'}
                                                row
                          />
                      )
                      }
                      {
                        isLoading && !isLegalPerson &&
                      (
                          <Skeleton />
                      )
                      }
                    </Grid>
                    <Grid item xs={6}>
                      {!isLoading && isLegalPerson && (
                          <ControlledRadioYesNo name={`${baseNameCompany}.${CompanyViewDTOFields.HasSocialImpact}`}
                                                control={methods.control}
                                                setValue={methods.setValue}
                                                label={'Tiene Impacto Social'}
                                                row
                          />
                      )
                      }
                      {
                          isLoading && isLegalPerson &&
                          (
                              <Skeleton />
                          )
                      }
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems={'center'} mt={0.5}>
                    <Grid item xs={11}>
                      {!isLoading ? (
                        <DataWithLabel
                          label={'Teléfono'}
                          data={
                            phoneNumber ? (
                              <Typography fontWeight={600} fontSize={'1.1rem'}>
                                {phoneNumber}
                              </Typography>
                            ) : (
                              <Typography
                                fontStyle={'italic'}
                                color={'#eac276 !important'}
                                fontWeight={600}
                              >
                                Pendiente de carga
                              </Typography>
                            )
                          }
                          rowDirection
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </Grid>
                    <Grid item xs={1}>
                      <EditIconButton
                        color={'secondary'}
                        tooltipTitle={phoneNumber ? 'Cambiar teléfono principal' : 'Agregar teléfono principal'}
                        onClick={() => {
                          setOpenPhones(true);
                        }}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <DataWithLabel
                        label={'Domicilio de Actividad'}
                        data={address}
                        rowDirection
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <EditIconButton
                        color={'secondary'}
                        tooltipTitle={'Cambiar domicilio de actividad'}
                        onClick={() => {
                          setOpenAddresses(true);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/*isLegalPerson && 
                                    <Grid item xs={12} mt={2}>
                                        <SectionDivider title={"Socios"} action={
                                            <AddButton size={'small'} onClick={() => {setShowNewPerson(true)}}>Agregar socio</AddButton>
                                        }
                                        />
                                        {listRelationships && drawAssociatesEdit(listRelationships)}
                                        <NewRelatedPersonDialog show={showNewPerson}
                                                                title={"Nuevo integrante"}
                                                                companyId={company[EntityWithIdFields.Id]}
                                                                relationshipTypeClassification={PersonRelationshipTypeClassification.Society}
                                                                onCloseDrawer={() => setShowNewPerson(false)}
                                                                onFinishProcess={onNewPersonSubmit} />
                                    </Grid>
                                */}
              <Grid item xs={12} container spacing={2} mt={2}>
                <Grid item xs={12}>
                  <SectionDivider title={'Certificado MiPyME'} />
                </Grid>
                <Grid item xs={6}>
                  {!isLoading ? (
                    <ControlledRadioYesNo
                      label="Certificado MiPyME"
                      control={methods.control}
                      setValue={methods.setValue}
                      name={`${baseNameCompany}.${CompanyViewDTOFields.HasCertificatePyme}`}
                      row
                    />
                  ) : (
                    <Skeleton />
                  )}
                </Grid>
                <Grid item xs={6}>
                  <ControlledDatePicker
                    label="Vigencia"
                    control={methods.control}
                    name={`${baseNameCompany}.${CompanyViewDTOFields.CertificatePymeDate}`}
                    disabled={!hasCertificatePyme}
                    loadPending={hasCertificatePyme}
                    filled
                  />
                </Grid>
                <Grid item xs={6}>
                  <AsyncSelect
                    loadOptions={HttpCacheGeneral.getAfipSection}
                    control={methods.control}
                    name={`${baseNameCompany}.${CompanyFields.AfipSectionCode}`}
                    label={'Categoria MiPyMEs'}
                    loadPending={hasCertificatePyme}
                    fullWidth
                  />
                </Grid>
                {isLegalPerson && (
                  <Grid item xs={6}>
                    {!isLoading ? (
                      <ControlledRadioYesNo
                        label="Grupo Económico"
                        control={methods.control}
                        setValue={methods.setValue}
                        name={`${baseNameCompany}.${CompanyViewDTOFields.BelongsEconomicGroup}`}
                        row
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid item xs={6} container alignContent={'flex-start'}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <SectionDivider title="Información Actividad" />
                  <Grid container gap={1}>
                    <Grid item xs={12}>
                      {!isLoadingAct ? (
                        <DataWithLabel
                          label="Sector / Rubro"
                          data={`${afipActivity?.[CompanyAfipActivityFields.AfipSectorDesc]} / ${afipActivity?.[CompanyAfipActivityFields.AfipAreaDesc]}`}
                          rowDirection
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      {!isLoadingAct ? (
                        <DataWithLabel
                          label="Actividad"
                          data={
                            afipActivity?.[
                              CompanyAfipActivityFields.AfipActivityDesc
                            ]
                          }
                          rowDirection
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </Grid>
                    {/*<DataWithLabel label={"Inicio de Actividad"}
                                                           data={dateFormatter.toShortDate(afipActivity?.[CompanyAfipActivityFields.ActivityStartDate])}
                                                           rowDirection
                                            />*/}
                  </Grid>

                  {/*<Grid>
                                            <ControlledMultipleSelect id="selMulRangeTerritory"
                                                                      label="Ámbito Territorial"
                                                                      lstData={rangeTerritories}
                                                                      field={`${baseNameActivity}.${CompanyActivityFields.RangeTerritory}`}
                                                                      valuesSelected={lstCodsRangeTerritories}
                                                                      onHandleChange={(_, value?: number[]) => setCodsRangeTerritories(value || [])}
                                                                      sx={{ width: '100%', backgroundColor: 'white' }}
                                                                      fullWidth
                                            />
                                        </Grid>*/}

                  <Grid container alignItems={'center'}>
                    {!isLoading ? (
                      <>
                        <Grid item xs={12} md={6}>
                          <ControlledRadioYesNo
                            label="¿Es exportadora?"
                            control={methods.control}
                            setValue={methods.setValue}
                            name={`${baseNameActivity}.${CompanyActivityFields.IsExporter}`}
                            loadPending
                            row
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ControlledRadioYesNo
                            label="¿Es empleadora?"
                            control={methods.control}
                            setValue={methods.setValue}
                            name={`${baseNameActivity}.${CompanyActivityFields.IsEmployer}`}
                            row
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} md={6}>
                          <Skeleton />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Skeleton />
                        </Grid>
                      </>
                    )}
                    {/*
                                            <Stack width={'100%'}>
                                                
                                                <ControlledTextFieldFilled control={methods.control} 
                                                                           label={'Antigüedad (años)'} 
                                                                           name={`${baseNameCompany}.${CompanyFields.CompanyAge}`} 
                                                                           fullWidth
                                                />
                                                <ControlledTextFieldFilled control={methods.control} 
                                                                           label={'Cantidad Empleados'} 
                                                                           name={`${baseNameCompany}.${CompanyFields.NumberEmployees}`} 
                                                                           fullWidth
                                                />
                                            </Stack>
                                                 */}
                    {/*<Grid item xs={12} md={9.5}>
                                                <ControlledTextFieldFilled control={methods.control}
                                                                           label={'Principal fuente de ingresos'}
                                                                           name={`${baseNameActivity}.${CompanyActivityFields.RevenueSource}`}
                                                                           fullWidth
                                                />
                                            </Grid>*/}
                    <Grid item xs={12}>
                      <ControlledTextFieldFilled
                        label="Descripción"
                        control={methods.control}
                        name={`${baseNameActivity}.${CompanyActivityFields.ActivityDesc}`}
                        loadPending
                        multiline
                        rows={3}
                        maxRows={6}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={12} mt={2}>
                <SectionDivider title="Información Fiscal" />
                <Grid container mt={1} spacing={1} alignItems="center">
                  {/*
                                           
                                            <Grid item xs={12} md={4}>
                                                <DataWithLabel label={`Fecha de inscripción ${PublicEntityEnums.ARCA}`}
                                                               data={dateFormatter.toShortDate(company[CompanyViewDTOFields.AfipRegistrationDate])}/>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <ControlledTextFieldFilled control={methods.control}
                                                                           label={'Número IIBB'}
                                                                           name={`${baseNameCompany}.${CompanyViewDTOFields.CUIT}`}
                                                                           disabled
                                                                           fullWidth
                                                />
                                            </Grid>
                                             */}
                  <Grid item xs={12} md={4}>
                    {!isLoading ? (
                      <ControlledRadioYesNo
                        label="Condición IIBB"
                        control={methods.control}
                        setValue={methods.setValue}
                        name={`${baseNameCompany}.${CompanyViewDTOFields.RegisteredAtIIBB}`}
                        loadPending
                        row
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </Grid>
                  {isLegalPerson && (
                    <Grid item xs={12} md={4}>
                      <ControlledTextFieldFilled
                        label="Cierre de Ejercicio Económico"
                        control={methods.control}
                        placeholder="dd/mm"
                        name={`${baseNameCompany}.${CompanyDetailFormFields.DateClosing}`}
                        helperText="Formato: dd/mm. Por ejemplo 31/12"
                        defaultValue={dateClosing}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={4}>
                    {!isLoading ? (
                      <ControlledRadioYesNo
                        label="Convenio Multilateral"
                        control={methods.control}
                        setValue={methods.setValue}
                        name={`${baseNameCompany}.${CompanyViewDTOFields.HasMultilateralAgreement}`}
                        loadPending
                        row
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <AsyncSelect
                      label="Condición Frente al IVA"
                      control={methods.control}
                      name={`${baseNameCompany}.${CompanyViewDTOFields.AfipResponsibilityTypeCode}`}
                      loadOptions={HttpCachePerson.getAfipResponsiblityTypes}
                      loadPending
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <ControlledTextFieldFilled
                      control={methods.control}
                      label="Facturación último año"
                      name={`${baseNameCompany}.${CompanyViewDTOFields.BillingAmount}`}
                      fullWidth
                      loadPending
                      currency
                      textAlign={'right'}
                      onFocus={handleFocus}
                    />
                  </Grid>
                  {!isLegalPerson && (
                    <>
                      <Grid item xs={12} md={4}>
                        <AsyncSelect
                          label="Autónomo"
                          control={methods.control}
                          name={`${baseNameCompany}.${CompanyViewDTOFields.SelfEmployedTypeCode}`}
                          loadOptions={HttpCacheCompany.getSelfEmployedTypes}
                          loadPending
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <AsyncSelect
                          label="Monotributista"
                          control={methods.control}
                          name={`${baseNameCompany}.${CompanyViewDTOFields.MonotaxTypeCode}`}
                          loadOptions={HttpCacheCompany.getMonotaxTypes}
                          loadPending
                        />
                      </Grid>
                    </>
                  )}
                  {/*
                                            isLegalPerson
                                                ?
                                                <>
                                                    <Grid item xs={12} md={3}>
                                                        <DataWithLabel label={"Tipo de Persona"}
                                                                       data={company[CompanyViewDTOFields.PersonTypeDesc]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <AsyncSelect label='Tipo Sociedad'
                                                                     control={methods.control}
                                                                     name={`${baseNameCompany}.${CompanyViewDTOFields.PersonClassificationTypeCode}`}
                                                                     loadOptions={HttpCachePerson.getPersonCompanyClassification}
                                                                     filled
                                                        />
                                                    </Grid>
                                                </>
                                                :
                                                <>
                                                    <Grid item xs={12} md={6}>
                                                        <AsyncSelect label="Monotributista"
                                                                     control={methods.control}
                                                                     name={`${baseNameCompany}.${CompanyViewDTOFields.MonotaxTypeCode}`}
                                                                     loadOptions={HttpCacheCompany.getMonotaxTypes}
                                                                     filled
                                                        />
                                                    </Grid>
        
                                                    <Grid item xs={12} md={6}>
                                                        <AsyncSelect label="Autónomo"
                                                                     control={methods.control}
                                                                     name={`${baseNameCompany}.${CompanyViewDTOFields.SelfEmployedTypeCode}`}
                                                                     loadOptions={HttpCacheCompany.getSelfEmployedTypes}
                                                                     filled
                                                        />
                                                    </Grid>
                                                </>
                                                
                                             */}
                </Grid>
              </Grid>
            </Grid>
            <FormProvider {...methods}>
              <PhoneFormBoxListDialog
                open={openPhones}
                onClose={() => {
                  setOpenPhones(false);
                }}
                baseNameCompany={baseNameCompany}
              />
            </FormProvider>
            <FormProvider {...methods}>
              <AddressFormBoxListDialog
                open={openAddresses}
                onClose={() => {
                  setOpenAddresses(false);
                }}
                baseNameCompany={baseNameCompany}
                obligatoryTypes={obligatoryTypes}
              />
            </FormProvider>
          </Grid>
          {creditCompanyFile && (
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12}>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography fontWeight={600} fontSize={18}>
                    Información Económica Financiera
                  </Typography>
                  {!marketEdit && <SaveButton type="submit" size={'small'}>Guardar</SaveButton>}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {!completeFinanceData && canEditEconomicInfo ? (
                <Grid item xs={12}>
                  <Alert severity={'warning'}>
                    {isLegalPerson
                      ? 'Para que el legajo se considere completo, el Estado de Situación Patrimonial no puede tener todos los valores en 0 (cero).'
                      : 'Para que el legajo se considere completo, el Valor Mercado del Estado de Situación Patrimonial no puede tener todos los valores en 0 (cero).'}
                  </Alert>
                </Grid>
              ) : (
                <></>
              )}

              {!canEditEconomicInfo ? (
                <>
                  <Grid item xs={12}>
                    <Alert severity={'info'}>
                      Para poder editar esta sección debe completar primero la
                      fecha de cierre en la pantalla anterior
                    </Alert>
                  </Grid>
                  {!financialYear && isLegalPerson && loading && (
                    <Grid item container xs={12}>
                      <Grid item xs={12}>
                        <Skeleton />
                      </Grid>
                      <Grid item xs={12} container spacing={1} mt={3}>
                        {Array.from({ length: 50 }).map(() => (
                          <Grid item xs={12} md={6}>
                            <Skeleton />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </>
              ) : (
                <>
                  {financialYear && isLegalPerson && (
                    <>
                      <Grid item xs={12}>
                        <Alert severity='info'>
                          Para  agregar un nuevo Ejercicio debe dirigirse a la pantalla anterior y modificar el último año de balance.
                        </Alert>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          fontWeight={600}
                          fontSize={16}
                          textAlign={'center'}
                        >{`Ejercicio ${financialYear}`}</Typography>
                        <FinancialYearEditComponent
                          year={financialYear}
                          patrimonialNameBase={`${CompanyFileEditProfileFormFields.LastFinance}.${FinancialYearEditFormFields.PatrimonialStatement}`}
                          incomeNameBase={`${CompanyFileEditProfileFormFields.LastFinance}.${FinancialYearEditFormFields.IncomeStatement}`}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          fontWeight={600}
                          fontSize={16}
                          textAlign={'center'}
                        >{`Ejercicio ${financialYear - 1}`}</Typography>
                        <FinancialYearEditComponent
                          year={financialYear - 1}
                          patrimonialNameBase={`${CompanyFileEditProfileFormFields.PrevFinance}.${FinancialYearEditFormFields.PatrimonialStatement}`}
                          incomeNameBase={`${CompanyFileEditProfileFormFields.PrevFinance}.${FinancialYearEditFormFields.IncomeStatement}`}
                        />
                      </Grid>
                    </>
                  )}

                  {!isLegalPerson ? (
                    !isLoading ? (
                        
                      <Grid item xs={12}>
                        <Stack spacing={2}>
                          <Alert severity='info'>
                            Para  agregar una nueva Manifestación de Bienes debe dirigirse a la pantalla anterior y modificar la fecha de la última declaración.
                          </Alert>
                          <CompanyDeclarationOfAssetsEditTabs
                            nameBase={`${CompanyFileEditProfileFormFields.DeclarationOfAssets}.${CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets}`}
                          />
                        </Stack>
                      </Grid>
                    ) : (
                      <Grid item container xs={12}>
                        <Grid item xs={12} container spacing={1} mt={3}>
                          {Array.from({ length: 30 }).map(() => (
                            <Grid item xs={12} md={6}>
                              <Skeleton />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )
                  ) : (
                    <></>
                  )}
                  {company && flows && (
                    <>
                      <Grid item xs={12} mt={5}>
                        <Typography
                          fontSize={18}
                          fontWeight={600}
                          textAlign={'center'}
                        >
                          Movimientos
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <CompanyFlowForm company={company} flows={flows} />
                      </Grid>
                      <Grid item xs={6}>
                        <Stack spacing={2}>
                          <Card>
                            <CardHeader title={'Gráfico de movimientos'} />
                            <CardContent>
                              {<CompanyFlowChart flowList={flows} />}
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader title={'Totales por año'} />
                            <CardContent>
                              <CompanyFlowYearlyTotals flowList={flows} />
                            </CardContent>
                          </Card>
                        </Stack>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          )}
        </CardContent>

        {
            !marketEdit &&
            <CardActions>
              <CloseButton onClick={onHandleBackPage} sx={{ marginRight: 1 }}>
                Cancelar
              </CloseButton>
              <SaveButton type="submit">Guardar</SaveButton>
            </CardActions>
        }
      </form>
    </Card>
  );
}

export default CompanyPersonalInformationEdit;

interface PhoneFormBoxListDialogProps {
  open: boolean;
  onClose: () => void;
  baseNameCompany: string;
  baseListName?: string
}

export const PhoneFormBoxListDialog = ({ baseListName = CompanyDetailFormFields.Phone, ...props}: PhoneFormBoxListDialogProps) => {
  const handleClose = (event: any, reason?: string) => {
    // Solo cerrar si es por backdrop click o escape key explícito, no por cambios en el form
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      props.onClose();
    }
  };

  return (
    <Dialog 
      open={props.open} 
      onClose={handleClose} 
      maxWidth={'md'} 
      fullWidth
      disableEscapeKeyDown={false}
    >
        <BaseDialogTitle title={'Teléfonos'}
                         onClose={props.onClose}
        />
        
      <DialogContent sx={{ paddingTop: '0px !important' }}>
        <PhoneFormBoxList
          phoneListName={`${props.baseNameCompany}.${baseListName}`}
        />
      </DialogContent>
        
        <DialogActions>
            <Button variant={'outlined'} color={'secondary'} 
                    onClick={props.onClose} fullWidth>
                Cerrar
            </Button>
        </DialogActions>
    </Dialog>
  );
};

interface AddressFormBoxListDialogProps {
  open: boolean;
  onClose: () => void;
  baseNameCompany: string;
  obligatoryTypes: AddressTypes[];
}

export const AddressFormBoxListDialog = (
  props: AddressFormBoxListDialogProps,
) => {
  return (
      props.open ?
        <AddressFormBoxListManager
          addressFieldName={`${props.baseNameCompany}.${CompanyViewDTOFields.Address}`}
          obligatoryTypes={props.obligatoryTypes}
          addressPerRow={1}
          cantAddAddress
          companyFileOpen
          onCloseCompanyFile={props.onClose}
        />
          :
          <></>
  );
};
