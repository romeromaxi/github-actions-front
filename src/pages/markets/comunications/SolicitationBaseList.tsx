import React, { useEffect, useState } from 'react';

import { Alert } from '@mui/lab';
import { Grid } from '@mui/material';

import { TitlePage } from 'components/text/TitlePage';
import SectionHeader from 'components/cards/SectionHeader';
import CardBaseLoading from 'components/cards/CardBaseLoading';
import SolicitationCard from './components/SolicitationCard';

import { EnumColors } from 'types/general/generalEnums';
import {
  SolicitationProductLine,
  SolicitationProductLineFields,
} from 'types/solicitations/solicitationData';

interface SolicitationBaseListProps {
  funcSearch: () => Promise<SolicitationProductLine[]>;
}

interface SolicitationProductLineByOfferer {
  [key: string]: SolicitationProductLine[];
}

function SolicitationBaseList(props: SolicitationBaseListProps) {
  const [solicitationsByOfferer, setSolicitationByOfferer] =
    useState<SolicitationProductLineByOfferer>();

  useEffect(() => {
    props.funcSearch().then((solicitations) => {
      let dictionarySolicitations: SolicitationProductLineByOfferer = {};

      solicitations.forEach((solicitation) => {
        if (
          dictionarySolicitations[
            solicitation[SolicitationProductLineFields.OffererBusinessName]
          ]
        )
          dictionarySolicitations[
            solicitation[SolicitationProductLineFields.OffererBusinessName]
          ] = [
            ...dictionarySolicitations[
              solicitation[SolicitationProductLineFields.OffererBusinessName]
            ],
            solicitation,
          ];
        else
          dictionarySolicitations[
            solicitation[SolicitationProductLineFields.OffererBusinessName]
          ] = [solicitation];
      });

      setSolicitationByOfferer(dictionarySolicitations);
    });
  }, []);

  const mapSolicitations = () => {
    let components: React.ReactElement[] = [];
    solicitationsByOfferer &&
      Object.entries(solicitationsByOfferer).forEach(([key, value]) =>
        components.push(
          <Grid
            item
            xs={12}
            container
            spacing={1}
            key={`titleOfferer_${key.replace(' ', '')}`}
          >
            <Grid item xs={12}>
              <SectionHeader>{key}</SectionHeader>
            </Grid>
            {value.map((solicitation, index) => (
              <Grid item xs={12} key={`gridSolicitation_${index}`}>
                <SolicitationCard solicitation={solicitation} />
              </Grid>
            ))}
          </Grid>,
        ),
      );

    return components;
  };

  const mapLoadings = () =>
    Array.from(Array(3).keys()).map((item) => (
      <Grid item xs={12} key={`keyCardBaseLoading_${item}`}>
        <CardBaseLoading baseColor={EnumColors.BLUE} />
      </Grid>
    ));

  return (
    <React.Fragment>
      <TitlePage text={'Comunicaciones'} />

      <Grid container spacing={2}>
        {solicitationsByOfferer ? (
          !Object.entries(solicitationsByOfferer).length ? (
            <Grid item xs={12}>
              <Alert color="info">
                No se han encontrado comunicaciones activas
              </Alert>
            </Grid>
          ) : (
            mapSolicitations()
          )
        ) : (
          mapLoadings()
        )}
      </Grid>
    </React.Fragment>
  );
}

export default SolicitationBaseList;
