import React, { useEffect, useState } from 'react';
import { useQuery } from 'hooks/useQuery';

import { Grid } from '@mui/material';

import { HttpProductLine } from 'http/index';
import { ProductLineViewWithRequirement } from 'types/lines/productLineData';

import { PrequalificationStepProps } from '../PrequalificationStepper';
import PrequalificationStepCompleteLinesDataForm from './PrequalificationStepCompleteLinesDataForm';
import TitleCardContent from 'components/text/TitleCardContent';

function PrequalificationStepCompleteLinesData(
  props: PrequalificationStepProps,
) {
  let paramLines = useQuery().get('id');

  const [linesWithRequirement, setLinesWithRequirement] =
    useState<ProductLineViewWithRequirement[]>();

  useEffect(() => {
    if (paramLines) {
      let idsSearch: number[] = paramLines.split(',').map((x) => parseInt(x));

      HttpProductLine.getWithRequirementsByIdsProductLine(idsSearch).then(
        setLinesWithRequirement,
      );
    }
  }, [paramLines]);

  return (
    <>
      <TitleCardContent text="Completá la información necesaria en cada línea" />

      {linesWithRequirement ? (
        <Grid container justifyContent="center" alignItems="center" mt={'2px'}>
          <Grid item xs={12}>
            <PrequalificationStepCompleteLinesDataForm
              {...props}
              productLineWithRequirement={linesWithRequirement}
            />
          </Grid>
        </Grid>
      ) : (
        <div>Cargando...</div>
      )}
    </>
  );
}

export default PrequalificationStepCompleteLinesData;
