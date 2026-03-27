import React, { useContext, useState } from 'react';
import {
  ProductLineFields,
  ProductLineView,
} from '../../../../types/lines/productLineData';
import {
  CartAddIconButton,
  CartRemoveIconButton,
} from '../../../../components/buttons/Buttons';
import { iconSx } from './lineCardActionIconSx';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { Tooltip } from '@mui/material';
import { useAction } from '../../../../hooks/useAction';

interface CartActionIconButtonProps {
  productLine: ProductLineView;
}

function CartActionIconButton({ productLine }: CartActionIconButtonProps) {
  const { addLineToShoppingCart, removeLineFromShoppingCart } = useAction();

  const [inShoppingCart, setInShoppingCart] = useState<boolean>(
    productLine[ProductLineFields.IsInShoppingCart],
  );

  const shoppingCartAdd = () => {
    setInShoppingCart(true);
    addLineToShoppingCart(productLine[EntityWithIdFields.Id]);
    /*        HttpProductLineShoppingCart.addShoppingCart(productLine[EntityWithIdFields.Id])
            .then(() => {
                reload()
            })
            .catch(() => {
                setInShoppingCart(false)
            })*/
  };

  const shoppingCartRemove = () => {
    setInShoppingCart(false);
    removeLineFromShoppingCart(productLine[EntityWithIdFields.Id], 0);
    /*        HttpProductLineShoppingCart.removeShoppingCart(productLine[EntityWithIdFields.Id])
            .then(() => {
                reload()
            })
            .catch(() => {
                setInShoppingCart(true)
            })*/
  };

  return (
    <div>
      {inShoppingCart ? (
        <Tooltip title={'Quitar de mi solicitud'}>
          <div>
            <CartRemoveIconButton sx={iconSx} onClick={shoppingCartRemove} />
          </div>
        </Tooltip>
      ) : (
        <Tooltip title={'Agregar a mi solicitud'}>
          <div>
            <CartAddIconButton sx={iconSx} onClick={shoppingCartAdd} />
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export default CartActionIconButton;
