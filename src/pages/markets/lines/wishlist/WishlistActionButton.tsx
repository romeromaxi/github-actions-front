import React, {useEffect, useState} from 'react';
import {ProductLineFields, ProductLineView,} from 'types/lines/productLineData';
import {FavoriteEmptyButton, FavoriteFullButton,} from 'components/buttons/Buttons';
import {Tooltip} from '@mui/material';
import {useTypedSelector} from 'hooks/useTypedSelector';
import {EntityWithIdFields} from 'types/baseEntities';
import {GeneralConfigurationSecObjects, SecurityComponents,} from 'types/security';
import {SafetyComponent} from 'components/security';
import FailRedirectMarketDialog from "../../home/components/FailRedirectMarketDialog";
import {
  AppConfigFields,
  AppConfigPaletteColor,
  AppConfigPaletteColorFields,
  AppConfigPaletteFields
} from "types/appConfigEntities";
import { useUser } from '../../../../hooks/contexts/UserContext';
import { useWishlistActions } from '../../../../hooks/useWishlistActions';
import { useSnackbarActions } from '../../../../hooks/useSnackbarActions';
import { useUserSummaryActions } from '../../../../hooks/useUserSummaryActions';

interface WishlistActionIconButtonProps {
  productLine: ProductLineView;
  favoriteAddComponent?: React.ReactElement;
  favoriteRemoveComponent?: React.ReactElement;
}

function WishlistActionButton({
  productLine,
  favoriteAddComponent,
  favoriteRemoveComponent,
}: WishlistActionIconButtonProps) {
  const paletteSecondary: AppConfigPaletteColor =
    window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Secondary];
  
  const { addLineToWishlist, removeLineFromWishlist } = useWishlistActions();
  const { addSnackbarSuccess } = useSnackbarActions();
  const { reloadUserSummary } = useUserSummaryActions();
  
  const { wishlist } = useTypedSelector((state) => state.wishList);
  const [failRedirect, setFailRedirect] = useState<boolean>(false);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(
    !!wishlist?.map((l) => l.id).includes(productLine?.[EntityWithIdFields.Id] ?? "0"),
  );
  const { isLoggedIn } = useUser();

  useEffect(() => {
    setIsInWishlist(!!wishlist?.map((l) => l.id).includes(productLine?.[EntityWithIdFields.Id] ?? "0"));
  }, [wishlist, productLine]);

  const handleOnAdd = () => {
    addLineToWishlist(productLine[ProductLineFields.Id], () => {
      reloadUserSummary();
      addSnackbarSuccess('La línea se ha agregado a favoritos con éxito');
    })
    setIsInWishlist(true);
  };

  const handleOnRemove = () => {
    removeLineFromWishlist(productLine[ProductLineFields.Id], () => {
      reloadUserSummary();
      addSnackbarSuccess('La línea se ha quitado de favoritos con éxito');
    });
    setIsInWishlist(false);
  };

  const onOpenFailRedirect = () => setFailRedirect(true);

  return (
    <div>
      {!isLoggedIn ? (
        <Tooltip title={'Agregar a favoritos'}>
          <div>
            {favoriteAddComponent ? (
              React.cloneElement(favoriteAddComponent, { onClick: onOpenFailRedirect })
            ) : (
              <FavoriteEmptyButton color={"secondary"} onClick={onOpenFailRedirect} />
            )}
          </div>
        </Tooltip> 
      ) : isInWishlist ? (
        <SafetyComponent
          componentName={SecurityComponents.GeneralConfiguration}
          objectName={GeneralConfigurationSecObjects.SolicitationFavoriteButton}
        >
          <Tooltip title={'Quitar de favoritos'}>
            <div>
              {favoriteRemoveComponent ? (
                React.cloneElement(favoriteRemoveComponent, {
                  onClick: handleOnRemove,
                })
              ) : (
                <FavoriteFullButton 
                  color={'secondary'} 
                  onClick={handleOnRemove} 
                  sx={{
                    height: '100%', 
                    width: '100%', 
                    padding: '10px !important', 
                    color: `${paletteSecondary[AppConfigPaletteColorFields.Dark]} !important`
                  }}
                />
              )}
            </div>
          </Tooltip>
        </SafetyComponent>
      ) : (
        <SafetyComponent
          componentName={SecurityComponents.GeneralConfiguration}
          objectName={GeneralConfigurationSecObjects.SolicitationFavoriteButton}
        >
          <Tooltip title={'Agregar a favoritos'}>
            <div>
              {favoriteAddComponent ? (
                React.cloneElement(favoriteAddComponent, { onClick: handleOnAdd })
              ) : (
                <FavoriteEmptyButton 
                  onClick={handleOnAdd} 
                  color={"secondary"} 
                  sx={{
                    height: '100%', 
                    width: '100%', 
                    padding: '10px !important'
                  }}
                />
              )}
            </div>
          </Tooltip>
        </SafetyComponent>
      )}
      <FailRedirectMarketDialog 
        open={failRedirect}
        onClose={() => setFailRedirect(false)}
        hideTitle
      />
    </div>
  );
}

export default WishlistActionButton;