import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { FormControl, FormHelperText, Grid } from '@mui/material';

import TitleCardContent from 'components/text/TitleCardContent';
import PrequalificationLinesSelected from './PrequalificationLinesSelected';
import PrequalificationStepperButtonActions from '../PrequalificationStepperButtonActions';
import {
  PrequalificationStepperContext,
  PrequalificationStepProps,
} from '../PrequalificationStepper';

import { EntityWithIdFields } from 'types/baseEntities';
import { ProductLineView } from 'types/lines/productLineData';

import { HttpOffererProductLine } from 'http/index';

function PrequalificationStepConfirmLine(props: PrequalificationStepProps) {
  let params = useParams();
  const lineId: number = parseInt(params.idLine ?? '');
  const offererId: number = parseInt(params.idOfferer ?? '');
  const { setListProductLinesId } = useContext(PrequalificationStepperContext);

  const [productLines, setProductLines] = useState<ProductLineView[]>();
  const [productLinesSelected, setProductLinesSelected] = useState<number[]>(
    [],
  );
  const [helperText, setHelperText] = useState<string>();

  const onSelectLine = (productLine: number, drop: boolean) => {
    setHelperText(undefined);

    if (drop)
      setProductLinesSelected(
        productLinesSelected.filter((x) => x !== productLine),
      );
    else setProductLinesSelected([...productLinesSelected, productLine]);
  };

  const loadProductLine = (): void => {
    HttpOffererProductLine.getById(offererId, lineId).then((line) => {
      setProductLines([line as ProductLineView]);
    });
  };

  useEffect(() => {
    loadProductLine();
  }, []);

  const onHandleSubmit = () => {
    if (productLinesSelected.length) {
      setListProductLinesId(productLinesSelected);
      props.onNext && props.onNext();
      return;
    }

    setHelperText('Campo obligatorio');
  };

  return (
    <>
      <TitleCardContent text="Confirmá la línea a las que te queres precalificar" />

      {productLines ? (
        productLines.length ? (
          <Grid container spacing={2} mt={'2px'}>
            {productLines.map((line, index) => (
              <Grid item xs={3} key={`prequalificationLinesSelected_${index}`}>
                <PrequalificationLinesSelected
                  productLine={line}
                  selected={productLinesSelected.some(
                    (x) => x === line[EntityWithIdFields.Id],
                  )}
                  onSelect={onSelectLine}
                />
              </Grid>
            ))}

            {helperText && (
              <Grid item xs={12}>
                <FormControl error>
                  <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
              </Grid>
            )}
          </Grid>
        ) : (
          <div>No hay líneas seleccionadas</div>
        )
      ) : (
        <div>Cargando...</div>
      )}
      <PrequalificationStepperButtonActions
        onBack={props.onBack}
        onNext={onHandleSubmit}
      />
    </>
  );
}

export default PrequalificationStepConfirmLine;
