import React, {useCallback, useMemo, useState} from 'react';
import {
  ProductLineFields,
  ProductLineView,
} from 'types/lines/productLineData';
import {
  ShoppingBagFilledButton,
  ShoppingBagFilledIconButtonBasic,
  ShoppingBagOutlineButton,
  ShoppingBagOutlinedIconButtonBasic,
} from 'components/buttons/Buttons';
import { Tooltip } from '@mui/material';
import { iconSx } from '../components/lineCardActionIconSx';
import ShoppingBagPopup from './ShoppingBagPopup';
import { DialogAlert } from 'components/dialog';
import { SafetyComponent } from 'components/security';
import {
  GeneralConfigurationSecObjects,
  SecurityComponents,
} from 'types/security';
import MustHaveRelatedCompanyDialog from './dialogs/MustHaveRelatedCompanyDialog';
import FailRedirectMarketDialog from "../../home/components/FailRedirectMarketDialog";
import { useUser } from '../../../../hooks/contexts/UserContext';
import { useShoppingCartActions } from 'hooks/useShoppingCartActions';
import { useSnackbarActions } from 'hooks/useSnackbarActions';
import { useLoaderActions } from '../../../../hooks/useLoaderActions';
import { EntityWithIdFields, BaseResponse, BaseResponseFields } from 'types/baseEntities';

interface ShoppingBagActionIconButtonProps {
  productLine: ProductLineView;
  shoppingBagAddComponent?: React.ReactElement;
  shoppingBagRemoveComponent?: React.ReactElement;
  reloadCompanies: () => void;
  basic: boolean;
  onAfterAddRemoveAction?: () => void,
  fullWidth?: boolean
}

function ShoppingBagActionButton({
  productLine,
  shoppingBagAddComponent,
  shoppingBagRemoveComponent,
  reloadCompanies,
  basic,
  onAfterAddRemoveAction,
  fullWidth
}: ShoppingBagActionIconButtonProps) {
  const { removeLineFromShoppingCart, addLineToCompanies } = useShoppingCartActions();
  const { addSnackbarSuccess } = useSnackbarActions();
  const { showLoader, hideLoader } = useLoaderActions();
  const [isInShoppingBag, setIsInShoppingBag] = useState<boolean>(
    productLine[ProductLineFields.IsInShoppingCart] ?? false,
  );
  const [hasMultipleCompanies, setHasMultipleCompanies] = useState<boolean>(
    !productLine[ProductLineFields.IsInShoppingCart]
  );
  const [singleCompanyId, setSingleCompanyId] = useState<number | undefined>(undefined);

  const [buttonPopup, setButtonPopup] = useState<boolean>(false);
  const { isLoggedIn } = useUser();
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [failRedirect, setFailRedirect] = useState<boolean>(false)
  const [showConfirmCreateCompany, setShowConfirmCreateCompany] =
    useState<boolean>(false);
  
  const showAsAdded = useMemo(() => (
      isInShoppingBag && !hasMultipleCompanies
  ), [isInShoppingBag, hasMultipleCompanies]);
  
  const shoppingBagPromise = new Promise(function (resolve) {
    resolve('');
  });

  const onAfterAddAction = () => {
    onAfterAddRemoveAction?.();
    addSnackbarSuccess('La línea fue agregada a tu selección correctamente');
  };

  const onAfterRemoveAction = () => {
    onAfterAddRemoveAction?.();
    addSnackbarSuccess('La línea se eliminó de tu selección correctamente');
  }

  const handleOnRemove = useCallback(() => {
      removeLineFromShoppingCart(
          productLine[ProductLineFields.Id],
          singleCompanyId ?? 0,
          onAfterRemoveAction,
      );
  }, [productLine, singleCompanyId])

  const shoppingBagAdd = async () => {
    try {
      showLoader();
      const { HttpMarketShoppingCart } = await import('../../../../http/market/httpMarketShoppingCart');
      const response = await HttpMarketShoppingCart.getAvailabilityList(productLine[ProductLineFields.Id]);
      
      hideLoader();

      if (!response || !response.length) {
        setShowConfirmCreateCompany(true);
        return;
      }

      setHasMultipleCompanies(response.length > 1);

      if (response.length === 1) {
        const companyId = response[0][EntityWithIdFields.Id];
        setSingleCompanyId(companyId); // Guardar el ID de la única empresa
        showLoader();
        try {
          const addResponse: BaseResponse | undefined = await addLineToCompanies(
            productLine[ProductLineFields.Id],
            [companyId],
          );

          if (addResponse && !addResponse[BaseResponseFields.HasError]) {
            setIsInShoppingBag(true);
            onAfterAddAction();
          }
        } catch (err) {
          console.error('Error adding line to company:', err);
        } finally {
          hideLoader();
        }
        return;
      }

      setButtonPopup(true);
    } catch (error) {
      console.error('Error checking companies:', error);
      hideLoader();
    }
  };

  const shoppingBagRemove = () => {
    setIsInShoppingBag(false);
    shoppingBagPromise
      .then(() => {
        handleOnRemove();
      })
      .catch(() => {
        setIsInShoppingBag(true);
      })
      .finally(() => setShowConfirmDelete(false));
  };

  const onShowConfirmDelete = () => setShowConfirmDelete(true);
  const onCancelDelete = () => setShowConfirmDelete(false);
  const onCancelCreateCompany = () => setShowConfirmCreateCompany(false);
  const onOpenFailRedirect = () => setFailRedirect(true);

  return (
    <div style={{ width: fullWidth ? '-webkit-fill-available' : '' }}>
      {!isLoggedIn ? (
        <Tooltip title={''}>
            {shoppingBagAddComponent ? (
              React.cloneElement(shoppingBagAddComponent, {
                onClick: onOpenFailRedirect,
              })
            ) : !basic ? (
                <ShoppingBagOutlineButton onClick={onOpenFailRedirect} />
            ) : (
                <ShoppingBagOutlinedIconButtonBasic
                  sx={iconSx}
                  onClick={onOpenFailRedirect}
                />
            )}
        </Tooltip>
      ) : showAsAdded ? (
          <SafetyComponent
            componentName={SecurityComponents.GeneralConfiguration}
            objectName={
              GeneralConfigurationSecObjects.SolicitationShoppingBagButton
            }
          >
                {shoppingBagRemoveComponent ? (
                React.cloneElement(shoppingBagRemoveComponent, {
                  onClick: onShowConfirmDelete,
                })
              ) : !basic ? (
                  <ShoppingBagFilledButton onClick={onShowConfirmDelete} />
              ) : (
                  <ShoppingBagFilledIconButtonBasic
                    sx={iconSx}
                    onClick={onShowConfirmDelete}
                  />
              )}
          </SafetyComponent>
      ) : (
          <SafetyComponent
            componentName={SecurityComponents.GeneralConfiguration}
            objectName={
              GeneralConfigurationSecObjects.SolicitationShoppingBagButton
            }
          >
              {shoppingBagAddComponent ? (
                React.cloneElement(shoppingBagAddComponent, {
                  onClick: shoppingBagAdd,
                })
              ) : !basic ? (
                  <ShoppingBagOutlineButton onClick={shoppingBagAdd} />
              ) : (
                  <ShoppingBagOutlinedIconButtonBasic
                    sx={iconSx}
                    onClick={shoppingBagAdd}
                  />
              )}
          </SafetyComponent>
      )}

        <ShoppingBagPopup
            open={buttonPopup}
            setOpen={setButtonPopup}
            line={productLine}
            callFromCard={true}
            onReloadCompanies={reloadCompanies}
            onAfterAddAction={onAfterAddAction}
        />

      <DialogAlert
        open={showConfirmDelete}
        onClose={onCancelDelete}
        onConfirm={shoppingBagRemove}
        textContent={`¿Estás seguro que deseás eliminar la línea ${productLine[ProductLineFields.Line]} de su selección?`}
      />

      <MustHaveRelatedCompanyDialog
        open={showConfirmCreateCompany}
        onClose={onCancelCreateCompany}
      />
      <FailRedirectMarketDialog 
        open={failRedirect}
        onClose={() => setFailRedirect(false)}
        hideTitle
      />
    </div>
  );
}

export default ShoppingBagActionButton;
