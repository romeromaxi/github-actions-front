import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import './FavoriteIconButton.css';
import { useAction } from '../../../../hooks/useAction';

interface FavoriteIconButtonProps {
  productLineId: number;
  isInShoppingCart: boolean;
  pageIsShoppingCart?: boolean;
  onReload?: () => void;
}

function FavoriteIconButton({
  productLineId,
  isInShoppingCart,
  pageIsShoppingCart,
  onReload,
}: FavoriteIconButtonProps) {
  const { addLineToShoppingCart, removeLineFromShoppingCart } = useAction();

  const [inShoppingCart, setInShoppingCart] =
    useState<boolean>(isInShoppingCart);

  const onRemove = () => {
    onReload && onReload();
  };

  const removeFromToShoppingCart = () => {
    setInShoppingCart(false);
    removeLineFromShoppingCart(productLineId, 0, onRemove);
    /*HttpMarketWishList.removeLine(productLineId)
            .then(() => {
                if (onReload) onReload();
                reload();
            });*/
  };

  const addToShoppingCart = () => {
    setInShoppingCart(true);
    addLineToShoppingCart(productLineId);
    /*HttpMarketWishList.addLine(productLineId)
            .then(() => {
                reload();
            });*/
  };

  return (
    <IconButton
      sx={{ '&:hover': { backgroundColor: '#F5F5F5 !important' }, zoom: '80%' }}
    >
      <Box
        className={`fav ${inShoppingCart ? 'is_fav_animating' : ''} ${pageIsShoppingCart ? 'fav-complete' : ''}`}
        sx={{ backgroundImage: 'url(/images/twitter_fave.png)' }}
        onClick={inShoppingCart ? removeFromToShoppingCart : addToShoppingCart}
      />
    </IconButton>
  );
}

export default FavoriteIconButton;
