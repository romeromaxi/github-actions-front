import React, { useEffect, useState } from 'react';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import {
  ProductDestiny,
  ProductDestinyFields,
} from 'types/product/productdestinyData';
import { LoaderBlockUI } from 'components/loader';
import {
  CondensedTableList,
  ITableColumn,
  TableColumnType
} from 'components/table';
import ProductDestinyFormDrawer from './ProductDestinyFormDrawer';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { useAction } from '../../../hooks/useAction';
import {AddButton, ButtonIconDropdown} from '../../../components/buttons/Buttons';
import {Card, Stack} from '@mui/material';
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {Path, Pencil} from 'phosphor-react';
import {WrapperIcons} from "../../../components/icons/Icons";

interface ProductDestinyListProps {
  productId?: number;
  title?: string;
  onSelect?: (entity: ProductDestiny) => void;
  smallActions?: boolean;
  notAllowsEditing?: boolean;
}

function ProductsList(props: ProductDestinyListProps) {
  const { snackbarSuccess } = useAction();

  const [productDestinies, setProductDestinies] = useState<ProductDestiny[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [isErasing, setErasing] = useState<boolean>(false);
  const [productDestinyInDrawer, setProductInDrawer] =
    useState<ProductDestiny | null>(null);

  const productColumnsBase: ITableColumn[] = [
    { label: 'Código', value: EntityWithIdFields.Id },
    {
      label: 'Producto Destino',
      onRenderCell: (entity: ProductDestiny) => (
        <span>{entity[ProductDestinyFields.ProductDestinyDesc]}</span>
      ),
    },
    {
      label: 'Activo',
      value: ProductDestinyFields.Active,
      type: TableColumnType.Boolean,
    },
  ];

  const productColumns: ITableColumn[] = props.notAllowsEditing
    ? productColumnsBase
    : productColumnsBase.concat([
        {
          label: '',
          onRenderCell: (entity: ProductDestiny) => (
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
      [ProductDestinyFields.Active]: true,
    } as ProductDestiny);
  };

  const renderActions = () => (
    <AddButton size={'small'} onClick={onOpenDrawer}>
      Nuevo
    </AddButton>
  );

  const loadProductDestines = () => {
    setLoading(true);

    HttpCacheProduct.getDestinies(false).then((products) => {
      setProductDestinies(products);
      setLoading(false);
    });
  };

  const onHandleCloseDrawer = () => setProductInDrawer(null);

  const onHandleSubmitDrawer = (message: string) => {
    snackbarSuccess(message);
    setProductInDrawer(null);
    loadProductDestines();
  };

  useEffect(() => {
    loadProductDestines();
  }, []);

  return (
    <Stack spacing={2}>
      <TabSectionCardHeader icon={Path}
                            sectionTitle={'Listado de destinos'}
                            actions={renderActions()}
      />
      <Card>
        <CondensedTableList<ProductDestiny>
          entityList={productDestinies}
          columns={productColumns}
          isLoading={loading}
          error={false}
        />
      </Card>

      {productDestinyInDrawer && (
        <ProductDestinyFormDrawer
          entity={productDestinyInDrawer}
          title={`${productDestinyInDrawer.id ? 'Editar Destino' : 'Nuevo Destino'}`}
          onCloseDrawer={onHandleCloseDrawer}
          onSubmitDrawer={onHandleSubmitDrawer}
        />
      )}

      {isErasing && <LoaderBlockUI />}
    </Stack>
  );
}

export default ProductsList;
