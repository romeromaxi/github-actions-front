import React, { useContext, useEffect, useState } from 'react';

import { Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';

import { DataWithLabel } from 'components/misc/DataWithLabel';

import {
  CompanyActivityFields,
  CompanyActivityView,
  CompanyAfipActivityFields,
  CompanyAfipActivityView,
} from 'types/company/companyActivityData';

import { HttpCompanyAfipActivity } from 'http/company/httpCompanyActivity';
import CompanyAfipActivityDialog from 'pages/company/activity/CompanyAfipActivityDialog';
import { CompanyForm, CompanyViewDTO } from 'types/company/companyData';
import { EntityWithIdFields } from 'types/baseEntities';
import { CompanyFileSourceType } from 'types/company/companyEnums';
import { HttpCompanyFile } from 'http/index';
import SectionDivider from 'components/cards/SectionDivider';
import { CompanyPersonalInformationContext } from '../CompanyPersonalInformationHome';

interface CompanyPersonalInformationDetailActivityProps {
  company: CompanyForm | CompanyViewDTO;
  activity: CompanyActivityView;
  inDetail?: boolean;
}

function CompanyPersonalInformationDetailActivity({
  company,
  activity,
  inDetail,
}: CompanyPersonalInformationDetailActivityProps) {
  const { dataId, dataSource } = useContext(CompanyPersonalInformationContext);

  const [afipActivity, setAfipActivity] = useState<CompanyAfipActivityView>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (dataId && dataSource) {
      const callbackActivities =
        dataSource === CompanyFileSourceType.Company
          ? HttpCompanyAfipActivity.getByCompanyId
          : HttpCompanyFile.getCompanyAfipActivitiesByFileId;

      callbackActivities(dataId).then((listActivities) => {
        setAfipActivity(
          listActivities.filter(
            (x) => x[CompanyAfipActivityFields.IsMainActivity],
          )[0] ?? undefined,
        );
      });
    }
  }, [dataId, dataSource]);

  const showDialog = () => setOpenDialog(true);

  const hideDialog = () => setOpenDialog(false);

  const drawActivity = () => {
    return (
      <div>
        <Divider>Actividad</Divider>

        <CompanyPersonalInformationDetailAfipActivity
          afipActivity={afipActivity}
        />
      </div>
    );
  };

  const drawActivityInfo = () => {
    return (
      <Stack spacing={1.5}>
        <SectionDivider title={'Actividad'} />
        <div>
          <CompanyPersonalInformationDetailAfipActivity
            afipActivity={afipActivity}
          />
          <CompanyPersonalInformationDetailDataActivity
            activity={activity}
            company={company}
          />
        </div>
      </Stack>
    );
  };

  return !inDetail ? (
    <Grid container>
      <Stack direction="row">
        <Grid item xs={12}>
          {drawActivity()}
        </Grid>
      </Stack>
    </Grid>
  ) : (
    <Grid container>
      {drawActivityInfo()}
      <CompanyAfipActivityDialog
        open={openDialog}
        companyId={company[EntityWithIdFields.Id]}
        onClose={hideDialog}
      />
    </Grid>
  );
}

interface CompanyPersonalInformationDetailAfipActivityProps {
  afipActivity?: CompanyAfipActivityView;
}

function CompanyPersonalInformationDetailAfipActivity({
  afipActivity,
}: CompanyPersonalInformationDetailAfipActivityProps) {
  return afipActivity ? (
    <Grid container>
      <Grid item xs={12}>
        <DataWithLabel
          label="Sector / Rubro"
          data={
            <Typography fontWeight={600} fontSize={'1.075rem'}>
              {`${afipActivity[CompanyAfipActivityFields.AfipSectorDesc]} / ${afipActivity[CompanyAfipActivityFields.AfipAreaDesc]}`}
            </Typography>
          }
          rowDirection
          mediumWidth
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Actividad"
          data={
            <Typography fontWeight={600} fontSize={'1.075rem'}>
              {afipActivity[CompanyAfipActivityFields.AfipActivityDesc]}
            </Typography>
          }
          rowDirection
          mediumWidth
        />
      </Grid>
      {/*<Grid item xs={12}>
                    <DataWithLabel label={"Inicio de Actividad"} 
                                   data={dateFormatter.toShortDate(afipActivity[CompanyAfipActivityFields.ActivityStartDate])}
                                   rowDirection
                                   mediumWidth
                    />
                </Grid>*/}
    </Grid>
  ) : (
    <>
      <Skeleton />
      <Skeleton />
    </>
  );
}

interface CompanyPersonalInformationDetailDataActivityProps {
  activity?: CompanyActivityView;
  company: CompanyForm | CompanyViewDTO;
}

function CompanyPersonalInformationDetailDataActivity({
  activity,
  company,
}: CompanyPersonalInformationDetailDataActivityProps) {
  const hasIsExporter = activity?.[CompanyActivityFields.IsExporter] !== null;

  return activity ? (
    <Grid container>
      {/*<DataWithLabel label="Ámbito Territorial"
                               data={activity[CompanyActivityFields.RangeTerritory] || '-'}
                               rowDirection
                <Grid item xs={12}>
                    <DataWithLabel label={"Antigüedad (años)"} 
                                   data={company[CompanyViewDTOFields.CompanyAge]}
                                   rowDirection
                                   mediumWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <DataWithLabel label={"Empleados"}
                                   data={company[CompanyViewDTOFields.NumberEmployees]}
                                   rowDirection
                                   mediumWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <DataWithLabel label="Principal fuente de Ingresos"
                                   data={activity[CompanyActivityFields.RevenueSource]}
                                   dataProps={{
                                       sx: {
                                           overflowWrap: 'anywhere'
                                       }
                                   }}
                                   rowDirection
                                   mediumWidth
                    />
                </Grid>
                />*/}
      <Grid item xs={12}>
        <DataWithLabel
          label="¿Es exportadora?"
          data={
            hasIsExporter
              ? activity[CompanyActivityFields.IsExporter]
                ? 'Si'
                : 'No'
              : undefined
          }
          rowDirection
          mediumWidth
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="¿Es empleadora?"
          data={activity[CompanyActivityFields.IsEmployer] ? 'Si' : 'No'}
          rowDirection
          mediumWidth
        />
      </Grid>
      <Grid item xs={12}>
        <DataWithLabel
          label="Descripción"
          data={activity[CompanyActivityFields.ActivityDesc]}
          dataProps={{
            sx: {
              overflowWrap: 'anywhere',
            },
          }}
          rowDirection
          mediumWidth
        />
      </Grid>
    </Grid>
  ) : (
    <>
      <Skeleton />
      <Skeleton />
    </>
  );
}

export default CompanyPersonalInformationDetailActivity;
