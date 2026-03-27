import React, { useEffect, useState } from 'react';
import {
  CondensedTableList,
  ITableColumn,
  TableColumnType,
} from 'components/table';
import { useAction } from 'hooks/useAction';
import {AddButton, ButtonIconDropdown} from '../../../components/buttons/Buttons';
import { Card, Stack } from '@mui/material';
import ProductInstrumentTypeFormDrawer from './ProductInstrumentTypeFormDrawer';
import { ProductInstrumentType, ProductInstrumentTypeFields } from '../../../types/product/productInstrumentData';
import { HttpCacheProduct } from '../../../http/cache/httpCacheProduct';
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {PresentationChart} from "@phosphor-icons/react";
import {WrapperIcons} from "../../../components/icons/Icons";
import {Pencil} from "phosphor-react";

interface ProductInstrumentTypesProps {
  title?: string;
  onSelect?: (entity: ProductInstrumentType) => void;
  smallActions?: boolean;
  notAllowsEditing?: boolean;
}

function ProductInstrumentTypes(props: ProductInstrumentTypesProps) {
  const { snackbarSuccess } = useAction();

  const [types, setTypes] = useState<ProductInstrumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeInDrawer, setTypeInDrawer] = useState<ProductInstrumentType | null>(null);

  const columnsBase: ITableColumn[] = [
    { label: 'Código', value: ProductInstrumentTypeFields.Code },
    {
      label: 'Descripción',
      value: ProductInstrumentTypeFields.Description,
    },
    {
      label: 'Visible',
      value: ProductInstrumentTypeFields.IsVisible,
      type: TableColumnType.Boolean,
    },
    {
      label: 'Activo',
      value: ProductInstrumentTypeFields.Active,
      type: TableColumnType.Boolean,
    },
  ];

  const columns: ITableColumn[] = props.notAllowsEditing
    ? columnsBase
    : columnsBase.concat([
        {
          label: '',
          onRenderCell: (entity: ProductInstrumentType) => (
              <ButtonIconDropdown label={''}
                                  items={[
                                    {label: 'Editar', icon: <WrapperIcons Icon={Pencil} size='md'/>, onClick: () =>  setTypeInDrawer(entity)}
                                  ]}
                                  size={'small'}
              />
          ),
        },
      ]);

  const onOpenDrawer = () =>
    setTypeInDrawer({
      [ProductInstrumentTypeFields.Code]: 0,
      [ProductInstrumentTypeFields.Description]: '',
      [ProductInstrumentTypeFields.Active]: true,
    } as ProductInstrumentType);

  const renderActions = () => (
    <AddButton size={'small'} onClick={onOpenDrawer}>
      Nuevo
    </AddButton>
  );

  const loadTypes = () => {
    setLoading(true);
    HttpCacheProduct.getInstrumentTypes(false)
      .then(setTypes)
      .finally(() => setLoading(false));
  };

  const onHandleCloseDrawer = () => setTypeInDrawer(null);

  const onHandleSubmitDrawer = (message: string) => {
    snackbarSuccess(message);
    onHandleCloseDrawer();
    loadTypes();
  };

  useEffect(() => {
    loadTypes();
  }, []);

  return (
    <Stack spacing={2}>
      <TabSectionCardHeader icon={PresentationChart}
                            sectionTitle={'Tipos de Instrumentos'}
                            actions={renderActions()}
      />
      <Card>
        <CondensedTableList<ProductInstrumentType>
          entityList={types}
          columns={columns}
          isLoading={loading}
          error={false}
        />
      </Card>

      {typeInDrawer && (
        <ProductInstrumentTypeFormDrawer
          productInstrumentType={typeInDrawer}
          title={`${typeInDrawer[ProductInstrumentTypeFields.Code] ? 'Editar Tipo de Instrumento' : 'Nuevo Tipo de Instrumento'}`}
          onCloseDrawer={onHandleCloseDrawer}
          onSubmitDrawer={onHandleSubmitDrawer}
        />
      )}
    </Stack>
  );
}

export default ProductInstrumentTypes;