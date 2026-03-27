import React from 'react';
import ShoppingBagActionButton from '../shoppingbag/ShoppingBagActionButton';
import {Button, Stack } from '@mui/material';
import { ProductLineView } from 'types/lines/productLineData';
import {EntityWithIdFields} from "../../../../types/baseEntities";
import { CheckIcon, PlusIcon } from "lucide-react";
import ButtonHoverSwitch from "../../../../components/buttons/ButtonHoverSwitch";

interface ProductLineCardActionsProps {
  productLine: ProductLineView;
}

function ProductLineCardActions({ productLine }: ProductLineCardActionsProps) {
  return (
    <Stack direction={'row'} spacing={1} width={1} alignItems={'center'}>
      <ShoppingBagActionButton
        productLine={productLine}
        basic={false}
        reloadCompanies={() => {}}
        fullWidth
        shoppingBagAddComponent={
          <Button size={'small'} color={'primary'} variant={'contained'} fullWidth
                  startIcon={<PlusIcon />}
                  id={`add-to-shopping-cart-line${productLine[EntityWithIdFields.Id]}`}
          >
              Agregar a Solicitudes
          </Button>
        }
        shoppingBagRemoveComponent={
          <ButtonHoverSwitch size={'small'}
                             normalProps={{
                                 color: 'primary', variant: 'outlined', startIcon: <CheckIcon />
                             }}
                             hoverProps={{
                                 color: 'secondary', variant: 'outlined'
                             }}
                             hoverChildren={'Descartar'}
                             id={`remove-from-shopping-cart-line${productLine[EntityWithIdFields.Id]}`}
                             fullWidth
          >
              Agregada
          </ButtonHoverSwitch>
      }
      />
    </Stack>
  );
}

export default ProductLineCardActions;
