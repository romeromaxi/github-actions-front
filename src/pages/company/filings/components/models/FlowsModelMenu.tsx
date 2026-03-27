import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  BackButton,
  CloseButton,
  EditButton,
  SaveButton,
} from '../../../../../components/buttons/Buttons';
import React, { Fragment, useEffect, useState } from 'react';
import { CompanyPersonalInformationContext } from '../../../../companyFile/company/CompanyPersonalInformationHome';
import {
  CompanyFileSourceType,
  CompanyFileType,
} from '../../../../../types/company/companyEnums';
import CompanyFileFlowPage from '../../../../companyFile/finance/components/CompanyFileFlowPage';
import { HttpCompanyFlow } from '../../../../../http';
import { FormProvider, useForm } from 'react-hook-form';
import {
  CompanyFlowInsert,
  CompanyFlowInsertRequest,
  CompanyFlowInsertRequestFields,
  CompanyFlowSemesterData,
  CompanyFlowSemesterDataFields,
  CompanySemesterFlowView,
  CompanySemesterFlowViewFields,
} from '../../../../../types/company/companyFlowData';
import {
  BaseRequestFields,
  EntityWithIdFields,
} from '../../../../../types/baseEntities';
import useAxios from '../../../../../hooks/useAxios';
import { useAction } from '../../../../../hooks/useAction';
import CompanyFlowForm from '../../../flow/CompanyFlowForm';
import CompanyFlowChart from '../../../flow/CompanyFlowChart';
import CompanyFlowYearlyTotals from '../../../flow/CompanyFlowYearlyTotals';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../../../types/company/companyData';
import { PersonTypes } from '../../../../../types/person/personEnums';
import { ButtonExportDropdown } from '../../../../../components/buttons/ButtonExportDropdown';

interface FlowsModelMenuProps {
  onBack: () => void;
  company: CompanyViewDTO;
}

interface FlowsModelMenuForm {
  lstEmpresaMovimientos: CompanyFlowInsert[];
}

const FlowsModelMenu = ({ onBack, company }: FlowsModelMenuProps) => {
  const { snackbarSuccess } = useAction();
  const { fetchData, fetchAndDownloadFile } = useAxios();
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [flowList, setFlowList] = useState<CompanyFlowSemesterData[]>();

  const methods = useForm<FlowsModelMenuForm>();

  const getFlowList = (semesters: CompanySemesterFlowView[]) => {
    let tempFlows: CompanyFlowSemesterData[] = [];
    if (semesters.length !== 0) {
      let editableFlows: CompanyFlowSemesterData[] = [];
      semesters.map((sem, idx) => {
        if (idx < 4) {
          if (idx === 0) {
            const auxFlows = [...sem[CompanySemesterFlowViewFields.Flows]];
            auxFlows.reverse().map((flow) => {
              if (flow[CompanyFlowSemesterDataFields.AllowEdit]) {
                editableFlows = [flow, ...editableFlows];
              }
            });
            tempFlows = [...editableFlows, ...tempFlows];
          } else if (idx === 3 && editableFlows.length !== 6) {
            let lastFlows: CompanyFlowSemesterData[] = [];
            const auxFlows = [...sem[CompanySemesterFlowViewFields.Flows]];
            auxFlows.reverse().map((flow, idx2) => {
              if (
                flow[CompanyFlowSemesterDataFields.AllowEdit] &&
                idx2 < 6 - editableFlows.length
              ) {
                lastFlows = [flow, ...lastFlows];
              }
            });
            tempFlows = [...lastFlows, ...tempFlows];
          } else {
            tempFlows = [
              ...sem[CompanySemesterFlowViewFields.Flows],
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

  useEffect(() => {
    HttpCompanyFlow.getSemesterList(company[EntityWithIdFields.Id]).then(
      (r) => {
        methods.reset({
          lstEmpresaMovimientos: getFlowList(r) as CompanyFlowInsert[],
        });
      },
    );
  }, [allowEdit]);

  const onSubmit = (data: FlowsModelMenuForm) => {
    const flows: CompanyFlowInsertRequest = {
      [CompanyFlowInsertRequestFields.FlowList]: data.lstEmpresaMovimientos,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    fetchData(
      () =>
        HttpCompanyFlow.insertList(company[EntityWithIdFields.Id], {
          ...flows,
        }),
      true,
    ).then(() => {
      setEditing(false);
      snackbarSuccess('Los movimientos se actualizaron correctamente');
    });
  };

  const onExportExcel = () =>
    fetchAndDownloadFile(() =>
      HttpCompanyFlow.exportLastToExcel(company[EntityWithIdFields.Id]),
    );

  return (
    <Stack spacing={2}>
      <FormProvider {...methods}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant="h3" fontWeight={600}>
            Compra y Venta
          </Typography>
          <Stack direction="row" alignItems={'center'} spacing={2}>
            {allowEdit &&
              (!editing ? (
                <Fragment>
                  <ButtonExportDropdown
                    size={'small'}
                    onExportExcel={onExportExcel}
                  />
                  <EditButton
                    size={'small'}
                    onClick={() => {
                      setEditing(true);
                    }}
                  >
                    Editar
                  </EditButton>
                </Fragment>
              ) : (
                <Fragment>
                  <CloseButton
                    color={'inherit'}
                    size={'small'}
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Cancelar
                  </CloseButton>
                  <SaveButton
                    onClick={methods.handleSubmit(onSubmit)}
                    size={'small'}
                  >
                    Guardar
                  </SaveButton>
                </Fragment>
              ))}
            <BackButton onClick={onBack} size={'small'}>
              Mis Presentaciones
            </BackButton>
          </Stack>
        </Stack>
        <CompanyPersonalInformationContext.Provider
          value={{
            dataId: company[EntityWithIdFields.Id],
            dataSource: CompanyFileSourceType.Company,
            fileType: CompanyFileType.Long,
          }}
        >
          {!editing ? (
            <CompanyFileFlowPage
              editAllowed={false}
              onAllowEdit={() => {
                setAllowEdit(true);
              }}
              physicalPerson={
                company[CompanyViewDTOFields.PersonTypeCode] ==
                PersonTypes.Physical
              }
            />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} mt={5}>
                <Typography fontSize={18} fontWeight={600}>
                  Movimientos
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <CompanyFlowForm company={company} flows={flowList} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={2}>
                  <Card>
                    <CardHeader title={'Gráfico de movimientos'} />
                    <CardContent>
                      {flowList && <CompanyFlowChart flowList={flowList} />}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader title={'Totales por año'} />
                    <CardContent>
                      <CompanyFlowYearlyTotals flowList={flowList} />
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          )}
        </CompanyPersonalInformationContext.Provider>
      </FormProvider>
    </Stack>
  );
};

export default FlowsModelMenu;
