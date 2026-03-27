import {Button, Card, CardContent, CardHeader, Stack,} from '@mui/material';
import {ProductLineFields, ProductLineView, ProductLineViewDetail,} from 'types/lines/productLineData';
import React, {useEffect, useState} from 'react';
import {HttpMarketWishList} from 'http/market/httpMarketWishList';
import {useAction} from 'hooks/useAction';
import {HttpProductLine} from 'http/index';
import {EntityWithIdFields} from 'types/baseEntities';
import ProductLineDetailDialog from '../components/ProductLineDetailDialog';
import MustHaveRelatedCompanyDialog from '../shoppingbag/dialogs/MustHaveRelatedCompanyDialog';
import ProductLineSummaryComponent from '../components/ProductLineSummaryComponent';
import ProductLineSummaryComponentLoadingList from '../components/ProductLineSummaryComponentLoading';
import ShoppingBagActionButton from "../shoppingbag/ShoppingBagActionButton";
import BoxEmtynessDescription from "components/misc/BoxEmtynessDescription";
import {DialogAlert} from "../../../../components/dialog";

function ProductLineWishlist() {
  const { removeLineFromWishlist, reloadUserSummary } = useAction();

  const [wishlist, setWishlist] = useState<ProductLineView[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [showConfirmCreateCompany, setShowConfirmCreateCompany] =
    useState<boolean>(false);
  const [detailedLine, setDetailedLine] = useState<ProductLineViewDetail>();
  const [pressedLine, setPressedLine] = useState<ProductLineView>();

  const handleDeleteOpen = (line: ProductLineView) => {
    setOpen(true);
    setPressedLine(line);
  };

  const updateLineType = (line: ProductLineView | undefined) => {
    line &&
      HttpProductLine.getByProductLineId(line[EntityWithIdFields.Id]).then(
        (response) => setDetailedLine(response),
      );
  };

  const handleDetailOpen = (line: ProductLineView) => {
    setDetailOpen(true);
    updateLineType(line);
    setPressedLine(line);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getWishlist = (): void => {
    setWishlist(undefined);
    
    HttpMarketWishList.getUserInfo()
        .then(setWishlist);
  };

  const handleDelete = (line: ProductLineView | undefined) => {
    // removeLineFromWishlist
    line &&
      Promise.resolve(removeLineFromWishlist(line[ProductLineFields.Id])).then(
        () => {
          reloadUserSummary();
          getWishlist();
          handleClose();
        },
      );
  };

  const onCancelCreateCompany = () => setShowConfirmCreateCompany(false);
  const deleteDialog = () => {
    return (
      <DialogAlert
        open={open}
        onClose={handleClose}
        textConfirm={'Eliminar'}
        textContent={'¿Querés eliminar esta línea de favoritos?'}
        onConfirm={() => handleDelete(pressedLine)}
        onReject={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      />
    );
  };

  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <React.Fragment>
      {
        !!wishlist && !wishlist.length ?
            <BoxEmtynessDescription />
            :
            <Card>
              <CardHeader title={'Mis favoritos'} />
              <CardContent>
                <Stack spacing={1}>
                  {
                    !wishlist ?
                        <ProductLineSummaryComponentLoadingList />
                        :
                        wishlist.map((line) => (
                            <ProductLineSummaryComponent productLine={line}
                                                         handleDeleteClick={handleDeleteOpen}
                                                         action={
                                                           <ShoppingBagActionButton
                                                               productLine={line}
                                                               basic={false}
                                                               reloadCompanies={() => {}}
                                                               shoppingBagAddComponent={<Button size={'small'} color={'primary'} variant={'contained'}>Agregar a la selección</Button>}
                                                               shoppingBagRemoveComponent={<Button size={'small'} color={'primary'} variant={'contained'}>Agregar a la selección</Button>}
                                                               onAfterAddRemoveAction={getWishlist}
                                                           />
                                                         }
                            />
                        ))    
                  }
                </Stack>
                
                {deleteDialog()}
                
                {/*{detailDialog(pressedLine)}*/}
              </CardContent>
            </Card>
      }
      
      {detailOpen && detailedLine && (
        <ProductLineDetailDialog
          onClose={() => {
            setDetailOpen(false)
            getWishlist()
          }}
          line={detailedLine}
          open={detailOpen}
        />
      )}

      <MustHaveRelatedCompanyDialog
        open={showConfirmCreateCompany}
        onClose={onCancelCreateCompany}
      />
    </React.Fragment>
  );
}

export default ProductLineWishlist;
