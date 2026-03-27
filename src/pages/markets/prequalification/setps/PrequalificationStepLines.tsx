import React, { useContext, useEffect, useState } from 'react';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Stack,
} from '@mui/material';
import TitleCardContent from 'components/text/TitleCardContent';

import PrequalificationLinesSelected from './PrequalificationLinesSelected';
import PrequalificationStepperButtonActions from '../PrequalificationStepperButtonActions';
import {
  PrequalificationStepperContext,
  PrequalificationStepProps,
} from '../PrequalificationStepper';

import { HttpMarketShoppingCart } from 'http/market/httpMarketShoppingCart';

import { EntityWithIdFields } from 'types/baseEntities';
import { ProductLineView } from 'types/lines/productLineData';

function PrequalificationStepLines(props: PrequalificationStepProps) {
  const { setListProductLinesId } = useContext(PrequalificationStepperContext);

  const [productLines, setProductLines] = useState<ProductLineView[]>();
  const [productLinesSelected, setProductLinesSelected] = useState<number[]>(
    [],
  );
  const [helperText, setHelperText] = useState<string>();
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const onSelectLine = (productLine: number, drop: boolean) => {
    setHelperText(undefined);
    setSelectAll(false);

    if (drop)
      setProductLinesSelected(
        productLinesSelected.filter((x) => x !== productLine),
      );
    else setProductLinesSelected([...productLinesSelected, productLine]);
  };

  const onClickSelectAll = () => {
    if (selectAll) setProductLinesSelected([]);
    else if (productLines)
      setProductLinesSelected(
        productLines.map((x) => x[EntityWithIdFields.Id]),
      );

    setSelectAll(!selectAll);
  };

  const searchProductLines = (): void => {
    HttpMarketShoppingCart.getUserInfo().then(setProductLines);
  };

  useEffect(() => {
    searchProductLines();
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TitleCardContent text="Elegí todas las líneas a las que te quieras precalificar" />

        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={onClickSelectAll}
              color="primary"
            />
          }
          label="Todas"
        />
      </Stack>

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

export default PrequalificationStepLines;
