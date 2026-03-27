import React, { useEffect, useState } from 'react';
import { ITableColumn, TableList } from 'components/table';

import {
  CompanyAfipActivityFields,
  CompanyAfipActivityView,
} from 'types/company/companyActivityData';
import { HttpCompanyAfipActivity } from 'http/company/httpCompanyActivity';
import { Typography } from '@mui/material';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import {
  StarEmptyIconButton,
  StarFilledIconButton,
} from '../../../components/buttons/Buttons';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { useAction } from '../../../hooks/useAction';

interface CompanyAfipActivityListProps {
  companyId: number;
  action?: (act: CompanyAfipActivityView) => void;
  viewActions: boolean;
}

function CompanyAfipActivityList(props: CompanyAfipActivityListProps) {
  const [activities, setActivities] = useState<CompanyAfipActivityView[]>();
  const [error, setError] = useState<boolean>(false);
  const { snackbarError, snackbarSuccess } = useAction();

  const onUpdateActivity = (activity: CompanyAfipActivityView) => {
    HttpCompanyAfipActivity.updateAfipActivity(
      props.companyId,
      activity[EntityWithIdFields.Id],
    )
      .then(() => {
        snackbarSuccess(
          'Su actividad principal se ha actualizado correctamente',
        );
        HttpCompanyAfipActivity.getByCompanyId(props.companyId).then((res) => {
          setActivities(res);
        });
      })
      .catch(() =>
        snackbarError('Ocurrió un error al actualizar su actividad principal'),
      );
    props.action && props.action(activity);
  };

  const columns: ITableColumn[] = [
    { label: 'Código', value: CompanyAfipActivityFields.AfipActivityCode },
    { label: 'Código Clanae', value: CompanyAfipActivityFields.CLANAECode },
    { label: 'Sector', value: CompanyAfipActivityFields.AfipSectorDesc },
    { label: 'Rubro', value: CompanyAfipActivityFields.AfipAreaDesc },
    {
      label: 'Fecha Inicio',
      onRenderCell: (activity: CompanyAfipActivityView) => {
        return (
          <Typography>
            {dateFormatter.toShortDate(
              activity[CompanyAfipActivityFields.ActivityStartDate],
            )}
          </Typography>
        );
      },
    },
    {
      label: 'Actividad',
      onRenderCell: (activity: CompanyAfipActivityView) => {
        return (
          <Typography>
            {activity[CompanyAfipActivityFields.AfipActivityDesc]}
          </Typography>
        );
      },
    },
    {
      label: '',
      onRenderCell: (activity: CompanyAfipActivityView) => {
        return (
          <>
            {activity[CompanyAfipActivityFields.IsMainActivity] ? (
              <StarFilledIconButton sx={{ color: 'gold' }} />
            ) : (
              <StarEmptyIconButton onClick={() => onUpdateActivity(activity)} />
            )}
          </>
        );
      },
    },
    //Chequear el otro estado y agregar onClick para setearlo
  ];

  const columnsWithoutActions: ITableColumn[] = [
    { label: 'Código', value: CompanyAfipActivityFields.AfipActivityCode },
    { label: 'Código Clanae', value: CompanyAfipActivityFields.CLANAECode },
    { label: 'Sector', value: CompanyAfipActivityFields.AfipSectorDesc },
    { label: 'Rubro', value: CompanyAfipActivityFields.AfipAreaDesc },
    {
      label: 'Fecha Inicio',
      onRenderCell: (activity: CompanyAfipActivityView) => {
        return (
          <Typography>
            {dateFormatter.toShortDate(
              activity[CompanyAfipActivityFields.ActivityStartDate],
            )}
          </Typography>
        );
      },
    },
    {
      label: 'Actividad',
      onRenderCell: (activity: CompanyAfipActivityView) => {
        return (
          <Typography>
            {activity[CompanyAfipActivityFields.AfipActivityDesc]}
          </Typography>
        );
      },
    },
  ];

  useEffect(() => {
    setError(false);

    HttpCompanyAfipActivity.getByCompanyId(props.companyId)
      .then((activities) => {
        const sortedActivities = activities.sort((x, y) =>
          y[CompanyAfipActivityFields.IsMainActivity] >
          x[CompanyAfipActivityFields.IsMainActivity]
            ? 1
            : y[CompanyAfipActivityFields.IsMainActivity] <
                x[CompanyAfipActivityFields.IsMainActivity]
              ? -1
              : 0,
        );
        setActivities(sortedActivities);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <TableList
      entityList={activities}
      columns={props.viewActions ? columns : columnsWithoutActions}
      isLoading={!activities && !error}
      error={error}
    />
  );
}

export default CompanyAfipActivityList;
