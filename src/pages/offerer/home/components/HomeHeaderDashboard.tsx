import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Stack, Card, useTheme, useMediaQuery} from '@mui/material';
import {TypographyBase} from '../../../../components/misc/TypographyBase';
import {useUser} from '../../../../hooks/contexts/UserContext';
import {OffererContext} from '../../components/OffererContextProvider';
import {OffererFields} from '../../../../types/offerer/offererData';
import {HttpSolicitation} from '../../../../http';
import {EntityWithIdFields} from '../../../../types/baseEntities';
import {
  SolicitationTotalsViewOfferer,
  SolicitationTotalsViewOffererFields
} from '../../../../types/solicitations/solicitationData';
import {Skeleton} from '@mui/lab';

function TotalCard({value, label, valueProps}: {value: string | number | undefined, label: string, valueProps?: any}) {
    return (
        <Card sx={{p: 2, flex: 1, borderRadius: 2, minHeight: 90, minWidth: 215, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {value !== undefined ? (
                <TypographyBase variant="h4" color="primary" {...valueProps}>
                    {value}
                </TypographyBase>
            ) : (
                <Skeleton width={60} height={40} />
            )}
            <TypographyBase variant="body2" mt={1}>
                {label}
            </TypographyBase>
        </Card>
    );
}

function HomeHeaderDashboard() {
  const {displayName} = useUser();
  const offerer = useContext(OffererContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [totals, setTotals] = useState<SolicitationTotalsViewOfferer>();

  useEffect(() => {
    HttpSolicitation.getTotalSolicitationsByOfferer(offerer[EntityWithIdFields.Id])
      .then(setTotals);
  }, [offerer[EntityWithIdFields.Id]]);

  const totalRecibidas = totals?.[SolicitationTotalsViewOffererFields.SolicitationsQuantity];
  const enProgreso = totals?.[SolicitationTotalsViewOffererFields.SolicitationsInProgressQuantity];
  const nuevas = totals?.[SolicitationTotalsViewOffererFields.SolicitationsNewQuantity];
  const admitidas = totals?.[SolicitationTotalsViewOffererFields.SolicitationsApprovedQuantity];
  
  const percentageAdmitidas = (totalRecibidas && admitidas !== undefined) 
    ? Math.round((admitidas / (totalRecibidas || 1)) * 100) 
    : 0;

  return (
    <Stack spacing={{xs: 3, md: 2}}
           width="100%"
           direction={isSmallScreen ? "column" : "row"}
           justifyContent={isSmallScreen ? "flex-start" : "space-between"}
           alignItems={isSmallScreen ? 'flex-start' : 'center'}
    >
      <Stack spacing={0.5}>
        <TypographyBase variant="body2" color="text.lighter">
          {offerer[OffererFields.BusinessName]}
        </TypographyBase>
        <TypographyBase variant="h3">
          Hola, {displayName?.split(',')[1]?.trim() || displayName?.split(' ')[0] || ''}
        </TypographyBase>
      </Stack>

      <Stack spacing={{xs: 2, md: 1.5}}>
        <TypographyBase variant="body1" fontWeight={600} color="text.lighter">
          Tus solicitudes
        </TypographyBase>
        <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={2} width="100%">
          <TotalCard value={totalRecibidas} label="Total recibidas" />
          <TotalCard value={enProgreso} label="En progreso" />
          <TotalCard value={nuevas} label="Nuevas" />
          <TotalCard
              value={totals ? `${percentageAdmitidas}%` : undefined}
              label="Admitidas"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default HomeHeaderDashboard;
