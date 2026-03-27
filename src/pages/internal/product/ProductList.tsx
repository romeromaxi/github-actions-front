import React, { useEffect, useState } from 'react';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { Product, ProductFields } from 'types/product/productData';
import {
  CondensedTableList,
  ITableColumn,
  TableColumnType
} from 'components/table';
import ProductFormDrawer from './ProductFormDrawer';
import { useAction } from 'hooks/useAction';
import {AddButton, ButtonIconDropdown} from '../../../components/buttons/Buttons';
import {Card, Stack} from '@mui/material';
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {ClipboardText, Pencil} from "phosphor-react";
import {WrapperIcons} from "../../../components/icons/Icons";

interface ProductListProps {
  productId?: number;
  title?: string;
  onSelect?: (entity: Product) => void;
  smallActions?: boolean;
  notAllowsEditing?: boolean;
}

function ProductsList(props: ProductListProps) {
  const { snackbarSuccess } = useAction();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productInDrawer, setProductInDrawer] = useState<Product | null>(null);

  const productColumnsBase: ITableColumn[] = [
    { label: 'Código', value: ProductFields.ProductCode },
    {
      label: 'Producto',
      onRenderCell: (entity: Product) => (
        <span>{entity[ProductFields.ProductDesc]}</span>
      ),
    },
    { label: 'Instrumento', value: ProductFields.ProductInstrumentDesc },
    {
      label: 'Servicio',
      onRenderCell: (entity: Product) => (
        <span>{entity[ProductFields.ProductServiceDesc] || '-'}</span>
      ),
    },
    {
      label: 'Activo',
      value: ProductFields.Active,
      type: TableColumnType.Boolean,
    },
  ];

  const productColumns: ITableColumn[] = props.notAllowsEditing
    ? productColumnsBase
    : productColumnsBase.concat([
        {
          label: '',
          onRenderCell: (entity: Product) => (
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
    setProductInDrawer({ [ProductFields.Active]: true } as Product);

  const renderActions = () => (
    <AddButton size={'small'} onClick={onOpenDrawer}>
      Nuevo
    </AddButton>
  );

  const loadProducts = () => {
    setLoading(true);

    HttpCacheProduct.getList(false).then((products) => {
      setProducts(products);
      setLoading(false);
    });
  };

  const onHandleCloseDrawer = () => setProductInDrawer(null);

  const onHandleSubmitDrawer = (message: string) => {
    snackbarSuccess(message);
    setProductInDrawer(null);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Stack spacing={2}>
      <TabSectionCardHeader icon={ClipboardText}
                            sectionTitle={'Listado de productos'}
                            actions={renderActions()}
      />
      <Card>
        <CondensedTableList<Product>
          entityList={products}
          columns={productColumns}
          isLoading={loading}
          error={false}
        />
      </Card>

      {productInDrawer && (
        <ProductFormDrawer
          entity={productInDrawer}
          title={`${productInDrawer.id ? 'Editar Producto' : 'Nuevo Producto'}`}
          onCloseDrawer={onHandleCloseDrawer}
          onSubmitDrawer={onHandleSubmitDrawer}
        />
      )}
    </Stack>
  );
}

export default ProductsList;
