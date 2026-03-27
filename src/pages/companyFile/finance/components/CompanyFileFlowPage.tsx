import React, { useContext, useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, Grid, Stack } from '@mui/material';

import { HttpCompanyFile, HttpCompanyFlow } from 'http/index';
import {
  CompanyFlowInsertRequest,
  CompanyFlowInsertRequestFields,
  CompanyFlowSemesterData,
  CompanyFlowView,
  CompanySemesterFlowView,
} from 'types/company/companyFlowData';
import CompanyFlowChart from '../../../company/flow/CompanyFlowChart';
import CardEditingBase from 'components/cards/CardEditingBase';
import CompanyFlowTableDetail from './CompanyFlowTableDetail';
import CompanyFlowEdit from '../CompanyFlowEdit';
import { FormProvider, useForm } from 'react-hook-form';
import { BaseRequestFields } from 'types/baseEntities';
import CompanyFlowYearlyTotals from '../../../company/flow/CompanyFlowYearlyTotals';
import { CompanyFileSourceType } from 'types/company/companyEnums';
import { CompanyPersonalInformationContext } from '../../company/CompanyPersonalInformationHome';
import {FlowSemesterDataFields, FlowSemesterViewFields} from "../../../../types/general/generalFinanceData";

interface CompanyFileFlowPageProps {
  physicalPerson?: boolean;
  editAllowed?: boolean;
  onAllowEdit?: () => void;
}

function CompanyFileFlowPage({
  physicalPerson,
  editAllowed = true,
  onAllowEdit,
}: CompanyFileFlowPageProps) {
  const { dataId, dataSource } = useContext(CompanyPersonalInformationContext);

  const [lstCompanyFlow, setCompanyFlows] = useState<
    CompanyFlowSemesterData[] | CompanyFlowView[]
  >([]);

  const methods = useForm<CompanyFlowInsertRequest>({
    defaultValues: {
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    },
  });

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
      setCompanyFlows(tempFlows);
      onAllowEdit && onAllowEdit();
    }
    return tempFlows;
  };

  const loadCompanyFlowList = () => {
    HttpCompanyFlow.getSemesterList(dataId).then((response) => {
      const editableFlows: CompanyFlowSemesterData[] = getFlowList(response);
      methods.reset(
        {
          ...methods.getValues(),
          [CompanyFlowInsertRequestFields.FlowList]: editableFlows.reverse(),
        },
        { keepDefaultValues: true },
      );
    });
  };

  const loadCompanyFileFlowList = () => {
    HttpCompanyFile.getCompanyFlowsViewByFileId(dataId).then((response) => {
      const editableFlows: CompanyFlowView[] = response.splice(0, 18);
      methods.reset(
        {
          ...methods.getValues(),
          [CompanyFlowInsertRequestFields.FlowList]: editableFlows,
        },
        { keepDefaultValues: true },
      );
      setCompanyFlows(editableFlows);
    });
  };

  const onHandleSubmit = (data: CompanyFlowInsertRequest) => {
    HttpCompanyFlow.insertList(dataId, { ...data }).then(() => {
      loadCompanyFlowList();
    });
  };

  useEffect(() => {
    if (dataId && dataSource)
      dataSource === CompanyFileSourceType.Company
        ? loadCompanyFlowList()
        : loadCompanyFileFlowList();
  }, [dataSource, dataId]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormProvider {...methods}>
          <CardEditingBase
            title={'Movimientos'}
            detailContent={
              <CompanyFlowTableDetail
                flowList={lstCompanyFlow}
                physicalPerson={physicalPerson}
              />
            }
            editContent={<CompanyFlowEdit physicalPerson={physicalPerson} />}
            onCloseEdit={() => {}}
            onSubmitEdit={onHandleSubmit}
            hideEditButton={!editAllowed}
          />
        </FormProvider>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={'Gráfico de movimientos'} />
            <CardContent>
              {lstCompanyFlow && (
                <CompanyFlowChart
                  flowList={lstCompanyFlow as CompanyFlowSemesterData[]}
                  reverse
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={'Totales por año'} />
            <CardContent>
              <CompanyFlowYearlyTotals flowList={lstCompanyFlow} />
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default CompanyFileFlowPage;
