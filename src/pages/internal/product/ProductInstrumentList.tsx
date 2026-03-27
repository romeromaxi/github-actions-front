import React, { useEffect, useState } from 'react';

import {
  CondensedTableList,
  ITableColumn,
  TableColumnType
} from 'components/table';
import ProductInstrumentFormDrawer from './ProductInstrumentFormDrawer';

import { HttpCacheProduct } from 'http/cache/httpCacheProduct';

import { EntityWithIdFields } from 'types/baseEntities';
import {
  ProductInstrument,
  ProductInstrumentFields,
} from 'types/product/productInstrumentData';
import { useAction } from 'hooks/useAction';
import {AddButton, ButtonIconDropdown} from '../../../components/buttons/Buttons';
import {Card, Stack} from '@mui/material';
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {LineSegments, Pencil} from "phosphor-react";
import {WrapperIcons} from "../../../components/icons/Icons";

interface ProductInstrumentListProps {
  title?: string;
  onSelect?: (entity: ProductInstrument) => void;
  smallActions?: boolean;
  notAllowsEditing?: boolean;
}

function ProductInstrumentList(props: ProductInstrumentListProps) {
  const { snackbarSuccess } = useAction();

  const [productInstruments, setProductInstruments] = useState<
    ProductInstrument[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [productInstrumentsInDrawer, setProductInDrawer] =
    useState<ProductInstrument | null>(null);

  const productColumnsBase: ITableColumn[] = [
    { label: 'Código', value: ProductInstrumentFields.ProductInstrumentCode },
    {
      label: 'Nombre',
      onRenderCell: (entity: ProductInstrument) => (
        <span>{entity[ProductInstrumentFields.ProductInstrumentDesc]}</span>
      ),
    },
    { label: 'Tipo', value: ProductInstrumentFields.ProductInstrumentTypeDesc },
    { label: 'Destino', value: ProductInstrumentFields.ProductDestinyDesc },
    {
      label: 'Activo',
      value: ProductInstrumentFields.Active,
      type: TableColumnType.Boolean,
    },
  ];

  const productColumns: ITableColumn[] = props.notAllowsEditing
    ? productColumnsBase
    : productColumnsBase.concat([
        {
          label: '',
          onRenderCell: (entity: ProductInstrument) => (
              <ButtonIconDropdown label={''}
                                  items={[
                                    {label: 'Editar', icon: <WrapperIcons Icon={Pencil} size='md'/>, onClick: () =>  setProductInDrawer(entity)}
                                  ]}
                                  size={'small'}
              />
          ),
        },
      ]);

  const onOpenDrawer = () =>
    setProductInDrawer({
      [ProductInstrumentFields.Active]: true,
    } as ProductInstrument);

  const renderActions = () => (
    <AddButton size={'small'} onClick={onOpenDrawer}>
      Nuevo
    </AddButton>
  );

  const loadProductInstruments = () => {
    setLoading(true);

    HttpCacheProduct.getInstruments(false).then((listInstrument) => {
      setProductInstruments(listInstrument);
      setLoading(false);
    });
  };

  const onHandleCloseDrawer = () => setProductInDrawer(null);

  const onHandleSubmitDrawer = (message: string) => {
    snackbarSuccess(message);
    setProductInDrawer(null);
    loadProductInstruments();
  };

  useEffect(() => {
    loadProductInstruments();
  }, []);

  return (
    <Stack spacing={2}>
      <TabSectionCardHeader icon={LineSegments}
                            sectionTitle={'Listado de instrumentos'}
                            actions={renderActions()}
      />
      <Card>
        <CondensedTableList<ProductInstrument>
          entityList={productInstruments}
          columns={productColumns}
          isLoading={loading}
          error={false}
        />
      </Card>

      {productInstrumentsInDrawer && (
        <ProductInstrumentFormDrawer
          entity={productInstrumentsInDrawer}
          title={`${productInstrumentsInDrawer[EntityWithIdFields.Id] ? 'Editar Instrumento' : 'Nuevo Instrumento'}`}
          onCloseDrawer={onHandleCloseDrawer}
          onSubmitDrawer={onHandleSubmitDrawer}
        />
      )}
    </Stack>
  );
}

export default ProductInstrumentList;
