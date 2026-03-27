import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { Grid, Slide } from '@mui/material';

import { CompanyFileHomeBaseProps } from '../CompanyFileHome';
import CompanyPersonalInformationEdit from '../company/CompanyPersonalInformationEdit';

import { BaseRequestFields, EntityWithIdFields } from 'types/baseEntities';
import { CompanyActivityInsert } from 'types/company/companyActivityData';
import {
  CompanyDetailFormFields,
  CompanyFields,
  CompanyFormData,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import {
  CompanyAddressInsertDTO,
  CompanyMailFields,
  CompanyMailInsert,
  CompanyPhoneInsertDTO,
} from 'types/company/companyReferentialData';

import { HttpCompanyActivity } from 'http/company/httpCompanyActivity';
import {
  HttpCompany,
  HttpCompanyAddress,
  HttpCompanyDeclarationOfAssets,
  HttpCompanyFlow,
  HttpCompanyIncomeStatement,
  HttpCompanyMail,
  HttpCompanyPatrimonialStatement,
  HttpCompanyPhoneNumber,
} from 'http/index';

import { RequiredMailSchema } from '../../../util/validation/validationSchemas';
import { useAction } from '../../../hooks/useAction';
import {
  CompanyBasePatrimonialStatementFields,
  CompanyDeclarationOfAssets,
  CompanyFinancialYearEditForm
} from '../../../types/company/companyFinanceInformationData';
import {
  CompanyFlowInsert,
  CompanyFlowInsertRequest,
  CompanyFlowInsertRequestFields,
  CompanyFlowSemesterData,
  CompanySemesterFlowView
} from '../../../types/company/companyFlowData';
import {
  CompanyDeclarationOfAssetsFormFields,
  CompanyDeclarationOfAssetsFormType,
} from '../../company/finance/declarationAssets/CompanyDeclarationOfAssetsEditCard';
import { PersonTypes } from '../../../types/person/personEnums';
import {FlowSemesterDataFields, FlowSemesterViewFields} from "../../../types/general/generalFinanceData";
import {
  FinancialYearEditFormFields,
  FinancialYearEditFormType
} from "../../company/finance/components/FinancialYearDetail";

export enum CompanyFileEditProfileFormFields {
  Company = 'company',
  Activity = 'activity',
  LastFinance = 'lastFinance',
  PrevFinance = 'prevFinance',
  Flow = 'flow',
  DeclarationOfAssets = 'declarationOfAssets',
}

export interface CompanyFileEditProfileForm {
  [CompanyFileEditProfileFormFields.Company]: CompanyFormData;
  [CompanyFileEditProfileFormFields.Activity]: CompanyActivityInsert;
  [CompanyFileEditProfileFormFields.LastFinance]: FinancialYearEditFormType;
  [CompanyFileEditProfileFormFields.PrevFinance]: FinancialYearEditFormType;
  [CompanyFileEditProfileFormFields.Flow]: CompanyFlowInsert[];
  [CompanyFileEditProfileFormFields.DeclarationOfAssets]: CompanyDeclarationOfAssetsFormType;
}

function CompanyFileHomeEditProfile({ company, afterSubmit, marketEdit, updateDirtyValue }: CompanyFileHomeBaseProps) {
  const { snackbarSuccess, snackbarError, showLoader, hideLoader } =
    useAction();
  const navigate = useNavigate();
  const location = useLocation();
  const companyId: number = company ? company[EntityWithIdFields.Id] : 0;
  const [activityId, setActivityId] = useState<number>(0);
  const [financialYear, setFinancialYear] = useState<number>();
  const [flowList, setFlowList] = useState<CompanyFlowSemesterData[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const creditCompanyFile = marketEdit ? true : location.state ? location.state.prevPathname.includes('?tipo=2') : false
  const [triggerAlert, setTriggerAlert] = useState<boolean>(false);
  const isLegalPerson: boolean =
    !!company &&
    company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;
  const companyEditProfileSchema = yup.object().shape({
    [CompanyFileEditProfileFormFields.Company]: yup.object().shape({
      [CompanyDetailFormFields.Mail]: RequiredMailSchema,
    }),
  });

  const methods = useForm<CompanyFileEditProfileForm>({
    defaultValues: {
      ...company,
      [CompanyDetailFormFields.Company]: {
        ...company,
      },
    },
    resolver: yupResolver(companyEditProfileSchema)
  });

  useEffect(() => {
    updateDirtyValue && updateDirtyValue(methods.formState.isDirty)
  }, [methods.formState.isDirty]);

  const watchDeclarationOfAssets = methods.watch(
    `${CompanyFileEditProfileFormFields.DeclarationOfAssets}.${CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets}`,
  );

  useEffect(() => {
    if (isLegalPerson) {
      if (!financialYear) {
        setTriggerAlert(true);
      } else {
        setTriggerAlert(false);
      }
    } else {
      if (!watchDeclarationOfAssets) {
        setTriggerAlert(true);
      } else {
        setTriggerAlert(false);
      }
    }
  }, [financialYear, watchDeclarationOfAssets]);
  const getFlowList = (semesters: CompanySemesterFlowView[]) => {
    let tempFlows: CompanyFlowSemesterData[] = [];
    if (semesters.length !== 0) {
      let editableFlows: CompanyFlowSemesterData[] = [];
      semesters.map((sem, idx) => {
        if (idx < 4) {
          if (idx === 0) {
            const auxFlows = [...sem[FlowSemesterViewFields.Flows]];
            auxFlows.reverse().map((flow) => {
              if (flow[FlowSemesterDataFields.AllowEdit]) {
                editableFlows = [flow, ...editableFlows];
              }
            });
            tempFlows = [...editableFlows, ...tempFlows];
          } else if (idx === 3 && editableFlows.length !== 6) {
            let lastFlows: CompanyFlowSemesterData[] = [];
            const auxFlows = [...sem[FlowSemesterViewFields.Flows]];
            auxFlows.reverse().map((flow, idx2) => {
              if (
                flow[FlowSemesterDataFields.AllowEdit] &&
                idx2 < 6 - editableFlows.length
              ) {
                lastFlows = [flow, ...lastFlows];
              }
            });
            tempFlows = [...lastFlows, ...tempFlows];
          } else {
            tempFlows = [
              ...sem[FlowSemesterViewFields.Flows],
              ...tempFlows,
            ];
          }
        } else {
          return;
        }
      });
      setFlowList(tempFlows);
    }
    return tempFlows;
  };

  const loadData = () => {
    setActivityId(0);

    if (company) {
      setLoading(true);
      if (isLegalPerson) {
        Promise.all([
          HttpCompanyActivity.getByCompanyId(company[EntityWithIdFields.Id]),
          HttpCompanyPatrimonialStatement.getLast(companyId),
          HttpCompanyIncomeStatement.getLast(companyId),
          HttpCompanyPatrimonialStatement.getPrevious(companyId),
          HttpCompanyIncomeStatement.getPrevious(companyId),
          HttpCompanyFlow.getSemesterList(companyId),
        ]).then((values) => {
          const lastFinance = {
            [FinancialYearEditFormFields.PatrimonialStatement]: values[1],
            [FinancialYearEditFormFields.IncomeStatement]: values[2],
          };

          const prevFinance = {
            [FinancialYearEditFormFields.PatrimonialStatement]: values[3],
            [FinancialYearEditFormFields.IncomeStatement]: values[4],
          };

          const flowListDefault: CompanyFlowSemesterData[] = getFlowList(
            values[5],
          );
          methods.reset({
            [CompanyDetailFormFields.Company]: {
              ...company,
            },
            [CompanyFileEditProfileFormFields.Activity]: values[0],
            [CompanyFileEditProfileFormFields.LastFinance]: lastFinance,
            [CompanyFileEditProfileFormFields.PrevFinance]: prevFinance,
            [CompanyFlowInsertRequestFields.FlowList]:
              flowListDefault as CompanyFlowInsert[],
          });
          setFinancialYear(
            values[1][CompanyBasePatrimonialStatementFields.Year],
          );
          setActivityId(values[0][EntityWithIdFields.Id]);
          setLoading(false);
        });
      } else {
        Promise.all([
          HttpCompanyActivity.getByCompanyId(company[EntityWithIdFields.Id]),
          HttpCompanyFlow.getSemesterList(companyId),
          HttpCompanyDeclarationOfAssets.getLastByCompany(companyId),
        ]).then((values) => {
          const declarationOfAssets: CompanyDeclarationOfAssetsFormType = {
            [CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets]:
              values[2],
          };
          const flowListDefault: CompanyFlowSemesterData[] = getFlowList(
            values[1],
          );
          methods.reset({
            [CompanyDetailFormFields.Company]: {
              ...company,
            },
            [CompanyFileEditProfileFormFields.Activity]: values[0],
            [CompanyFlowInsertRequestFields.FlowList]:
              flowListDefault as CompanyFlowInsert[],
            [CompanyFileEditProfileFormFields.DeclarationOfAssets]:
              declarationOfAssets,
          });
          setActivityId(values[0][EntityWithIdFields.Id]);
          setLoading(false);
        });
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [company]);

  const updateLegalPerson = (
    data: CompanyFileEditProfileForm,
    companyData: CompanyFormData,
    mappedPhonesList: CompanyPhoneInsertDTO[],
    flows: CompanyFlowInsertRequest,
  ) => {
    const lastFinancial: CompanyFinancialYearEditForm =
      data[CompanyFileEditProfileFormFields.LastFinance];
    const prevFinancial: CompanyFinancialYearEditForm =
      data[CompanyFileEditProfileFormFields.PrevFinance];

    const promises = [
      insertCompanyPhoneNumber(mappedPhonesList),
      insertCompanyMail(companyData[CompanyFields.Mail]),
      updateCompany(companyData),
      updateClosingDate(companyData[CompanyDetailFormFields.DateClosing]),
      insertCompanyAddressList(
        companyData[CompanyViewDTOFields.Address] as CompanyAddressInsertDTO[],
      ),
      updateActivity(data[CompanyFileEditProfileFormFields.Activity]),
    ];

    if (creditCompanyFile && !triggerAlert) {
      // @ts-ignore
      promises.push(updateFinancials(lastFinancial));
      // @ts-ignore
      promises.push(updateFinancials(prevFinancial));
      promises.push(insertFlowList(flows));
    }

    Promise.all(promises)
      .then(() => {
        hideLoader();
        snackbarSuccess('Los datos del legajo se guardaron correctamente');
        afterSubmit && afterSubmit()
        !afterSubmit && navigate(-1);
      })
      .catch(() => {
        snackbarError('No se pudieron guardar los datos del legajo');
        hideLoader();
      });
  };

  const updatePhysicalPerson = (
    data: CompanyFileEditProfileForm,
    companyData: CompanyFormData,
    mappedPhonesList: CompanyPhoneInsertDTO[],
    flows: CompanyFlowInsertRequest,
  ) => {
    const promises = [
      insertCompanyPhoneNumber(mappedPhonesList),
      insertCompanyMail(companyData[CompanyFields.Mail]),
      updateCompany(companyData),
      insertCompanyAddressList(
        companyData[CompanyViewDTOFields.Address] as CompanyAddressInsertDTO[],
      ),
      updateActivity(data[CompanyFileEditProfileFormFields.Activity]),
    ];

    if ((creditCompanyFile && !triggerAlert) || marketEdit) {
      // @ts-ignore
      promises.push(
        updateDeclarationOfAssets(
          data[CompanyFileEditProfileFormFields.DeclarationOfAssets][
            CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets
          ],
        ),
      );
      promises.push(insertFlowList(flows));
    }

    Promise.all(promises)
      .then(() => {
        hideLoader();
        snackbarSuccess('Los datos del legajo se guardaron correctamente');
        afterSubmit && afterSubmit()
        !afterSubmit && navigate(-1)
      })
      .catch(() => {
        snackbarError('No se pudieron guardar los datos del legajo');
        hideLoader();
      });
  };

  const onHandleSubmit = (data: CompanyFileEditProfileForm) => {
    showLoader();

    const mappedPhonesList: CompanyPhoneInsertDTO[] = data[
      CompanyFileEditProfileFormFields.Company
    ][CompanyViewDTOFields.Phone].map((phone) => {
      return {
        ...phone,
        codModulo: 1,
        codOrigen: 1,
      };
    });

    const companyData: CompanyFormData =
      data[CompanyFileEditProfileFormFields.Company];

    const flows: CompanyFlowInsertRequest = {
      [CompanyFlowInsertRequestFields.FlowList]: data.lstEmpresaMovimientos,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    if (company?.[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal) {
      updateLegalPerson(data, companyData, mappedPhonesList, flows);
    } else {
      updatePhysicalPerson(data, companyData, mappedPhonesList, flows);
    }
  };

  const updateClosingDate = (date?: string): Promise<void> => {
    if (!date) return new Promise((resolve) => resolve());

    let [day, month] = date.split('/').map((x) => parseInt(x)) || [0, 0];

    return HttpCompany.updateClosingDate(companyId, day, month);
  };

  const updateFinancials = (financials: CompanyFinancialYearEditForm) => {
    return Promise.all([
      HttpCompanyPatrimonialStatement.update(
        companyId,
        financials[FinancialYearEditFormFields.PatrimonialStatement][
          EntityWithIdFields.Id
        ],
        financials[FinancialYearEditFormFields.PatrimonialStatement],
      ),
      HttpCompanyIncomeStatement.update(
        companyId,
        financials[FinancialYearEditFormFields.IncomeStatement][
          EntityWithIdFields.Id
        ],
        financials[FinancialYearEditFormFields.IncomeStatement],
      ),
    ]);
  };

  const updateDeclarationOfAssets = (
    declarationOfAssets: CompanyDeclarationOfAssets,
  ) => {
    return HttpCompanyDeclarationOfAssets.update(
      companyId,
      declarationOfAssets[EntityWithIdFields.Id],
      declarationOfAssets,
    );
  };

  const insertFlowList = (flows: CompanyFlowInsertRequest) => {
    return HttpCompanyFlow.insertList(companyId, { ...flows });
  };

  const insertCompanyMail = (mail: string): Promise<void> => {
    let companyMail: CompanyMailInsert = {
      [CompanyMailFields.MailTypeCode]: 0,
      [CompanyMailFields.Mail]: mail,
    };
    return HttpCompanyMail.insert(companyId, companyMail);
  };

  const insertCompanyPhoneNumber = (
    phoneList: CompanyPhoneInsertDTO[],
  ): Promise<void> => {
    return HttpCompanyPhoneNumber.insertList(companyId, phoneList);
  };

  const updateCompany = (
    company: CompanyViewDTO | CompanyFormData,
  ): Promise<void> => {
    return HttpCompany.updateCompany(companyId, company);
  };

  const insertCompanyAddressList = (
    addressList: CompanyAddressInsertDTO[],
  ): Promise<void> => {
    return HttpCompanyAddress.insertList(companyId, addressList);
  };

  const updateActivity = (activity: CompanyActivityInsert): Promise<void> => {
    return HttpCompanyActivity.updateActivity(companyId, activityId, activity);
  };

  return (
    <>
      <Slide direction="right" in mountOnEnter timeout={600}>
        <Grid container spacing={2} justifyContent="end">
          <Grid item xs={12}>
            <FormProvider {...methods}>
              {company && (
                <CompanyPersonalInformationEdit
                  onSubmit={onHandleSubmit}
                  company={company}
                  financialYear={financialYear}
                  flows={flowList}
                  loading={loading}
                  marketEdit={marketEdit}
                  canEditEconomicInfo={!triggerAlert}
                />
              )}
            </FormProvider>
          </Grid>
        </Grid>
      </Slide>
    </>
  );
}

export default CompanyFileHomeEditProfile;
