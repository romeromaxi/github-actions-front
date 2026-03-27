import { AvatarGroup, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import BoxDataWithLabel, {
  BoxDataWithLabelLoading,
} from 'components/misc/BoxDataWithLabel';
import {
  SolicitationTotalsViewFields,
  SolicitationTotalsViewOffererFields,
} from 'types/solicitations/solicitationData';
import { OffererSolicitationsInformationContext } from './OffererSolicitation/OffererSolicitationsInformation';
import { OffererWorkTeamView } from 'types/offerer/offererSolicitationData';
import { HttpOffererWorkTeams } from 'http/offerer/httpOffererWorkTeams';
import OffererWorkTeamAvatar from '../workTeams/OffererWorkTeamAvatar';
import { Skeleton } from '@mui/lab';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../types/baseEntities';
import TotalBoxComponent from '../../../components/misc/TotalBoxComponent';

interface OffererInformationHeaderProps {
  offererId: number;
}

const OffererInformationHeader = ({
  offererId,
}: OffererInformationHeaderProps) => {
  const { solicitationTotals } = useContext(
    OffererSolicitationsInformationContext,
  );
  const [workTeams, setWorkTeams] = useState<OffererWorkTeamView[]>();

  const searchUserWorkTeams = () => {
    setWorkTeams(undefined);
    HttpOffererWorkTeams.getListByLoggedUser(offererId).then(setWorkTeams);
  };

  useEffect(() => {
    searchUserWorkTeams();
  }, []);

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Stack direction={'row'} spacing={3}>
        <Stack spacing={1}>
          <Typography fontSize={15} fontWeight={500}>
            Mis Equipos de Trabajo
          </Typography>
          <Stack direction={'row'}>
            {workTeams ? (
              <AvatarGroup max={4}>
                {workTeams.map((x) => (
                  <OffererWorkTeamAvatar workTeam={x} />
                ))}
              </AvatarGroup>
            ) : (
              Array.from(Array(3).keys()).map((item) => (
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  key={`OffererInformationHeaderAvatarLoading_${item}`}
                />
              ))
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={3}>
        {!!solicitationTotals ? (
          <>
            <TotalBoxComponent
              label={'Sin Asignar'}
              size={'small'}
              total={
                solicitationTotals[
                  SolicitationTotalsViewOffererFields
                    .TeamUserUnassignedSolicitationsQuantity
                ]
              }
            />

            <TotalBoxComponent
              label={'Con Alerta'}
              size={'small'}
              total={
                solicitationTotals[
                  SolicitationTotalsViewOffererFields
                    .TeamUserAlertSolicitationsQuantity
                ]
              }
            />
          </>
        ) : (
          <>
            <BoxDataWithLabelLoading />
            <BoxDataWithLabelLoading />
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default OffererInformationHeader;
