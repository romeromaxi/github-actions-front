import React, { useEffect, useState } from 'react';
import {Card, Stack} from '@mui/material';

import {
  CondensedTableList,
  ITableColumn,
  TableColumnType
} from 'components/table';
import ProductServiceFormDrawer from './ProductServiceFormDrawer';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  ProductService,
  ProductServiceFields,
} from 'types/product/productserviceData';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { useAction } from '../../../hooks/useAction';
import {AddButton, ButtonIconDropdown} from '../../../components/buttons/Buttons';
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {Handshake, Pencil} from 'phosphor-react';
import {WrapperIcons} from "../../../components/icons/Icons";

interface ProductServiceListProps {
  title?: string;
  onSelect?: (entity: ProductService) => void;
  smallActions?: boolean;
  notAllowsEditing?: boolean;
}

function ProductsList(props: ProductServiceListProps) {
  const { snackbarSuccess } = useAction();

  const [productServices, setProductServices] = useState<ProductService[]>([]);
  const [loading, setLoading] = useState(true);
  const [productServiceInDrawer, setProductInDrawer] =
    useState<ProductService | null>(null);

  const productColumnsBase: ITableColumn[] = [
    { label: 'Código', value: ProductServiceFields.ProductServiceCode },
    {
      label: 'Producto Servicio',
      onRenderCell: (entity: ProductService) => (
        <span>{entity[ProductServiceFields.ProductServiceDesc]}</span>
      ),
    },
    {
      label: 'Activo',
      value: ProductServiceFields.Active,
      type: TableColumnType.Boolean,
    },
  ];

  const productColumns: ITableColumn[] = props.notAllowsEditing
    ? productColumnsBase
    : productColumnsBase.concat([
        {
          label: '',
          onRenderCell: (entity: ProductService) => (
              <ButtonIconDropdown label={''}
                                  items={[
                                    {label: 'Editar', icon: <WrapperIcons Icon={Pencil} size='md'/>, onClick: () =>  setProductInDrawer(entity)}
                                  ]}
                                  size={'small'}
              />
          ),
        },
      ]);

  const onOpenDrawer = () => {
    setProductInDrawer({
      [ProductServiceFields.Active]: true,
    } as ProductService);
  };

  const renderActions = () => (
    <AddButton size={'small'} onClick={onOpenDrawer}>
      Nuevo
    </AddButton>
  );

  const loadProductServices = () => {
    setLoading(true);

    HttpCacheProduct.getServices(false).then((listServices) => {
      setProductServices(listServices);
      setLoading(false);
    });
  };

  const onHandleCloseDrawer = () => setProductInDrawer(null);

  const onHandleSubmitDrawer = (message: string) => {
    snackbarSuccess(message);
    setProductInDrawer(null);
    loadProductServices();
  };

  useEffect(() => {
    loadProductServices();
  }, []);

  return (
    <Stack spacing={2}>
      <TabSectionCardHeader icon={Handshake}
                            sectionTitle={'Listado de servicios'}
                            actions={renderActions()}
      />
      <Card>
        <CondensedTableList<ProductService>
          entityList={productServices}
          columns={productColumns}
          isLoading={loading}
          error={false}
        />
      </Card>

      {productServiceInDrawer && (
        <ProductServiceFormDrawer
          entity={productServiceInDrawer}
          title={`${productServiceInDrawer[EntityWithIdFields.Id] ? 'Editar Servicio' : 'Nuevo Servicio'}`}
          onCloseDrawer={onHandleCloseDrawer}
          onSubmitDrawer={onHandleSubmitDrawer}
        />
      )}
    </Stack>
  );
}

export default ProductsList;
