import React, { useEffect, useState } from 'react';
import {Card, Stack} from '@mui/material';

import {
  CondensedTableList,
  ITableColumn,
  TableColumnType,
} from 'components/table';
import NeedFormDrawer from './NeedFormDrawer';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { Need, NeedFields } from 'types/general/generalNeedData';
import { useAction } from '../../../hooks/useAction';
import {AddButton, ButtonIconDropdown} from '../../../components/buttons/Buttons';
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {HandHeart} from "@phosphor-icons/react";
import {WrapperIcons} from "../../../components/icons/Icons";
import {Pencil} from "phosphor-react";

interface NeedListProps {
  needId?: number;
  title?: string;
  onSelect?: (entity: Need) => void;
  smallActions?: boolean;
  notAllowsEditing?: boolean;
}

function NeedsList(props: NeedListProps) {
  const { snackbarSuccess } = useAction();

  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [needInDrawer, setNeedInDrawer] = useState<Need | null>(null);

  const needColumnsBase: ITableColumn[] = [
    { label: 'Código', value: NeedFields.NeedCode },
    {
      label: 'Necesidad',
      onRenderCell: (entity: Need) => (
        <span>{entity[NeedFields.NeedDesc]}</span>
      ),
    },
    {
      label: 'Activo',
      value: NeedFields.Active,
      type: TableColumnType.Boolean,
    },
  ];

  const needColumns: ITableColumn[] = props.notAllowsEditing
    ? needColumnsBase
    : needColumnsBase.concat([
        {
          label: '',
          onRenderCell: (entity: Need) => (
              <ButtonIconDropdown label={''}
                                  items={[
                                    {label: 'Editar', icon: <WrapperIcons Icon={Pencil} size='md'/>, onClick: () =>  setNeedInDrawer(entity)}
                                  ]}
                                  size={'small'}
              />
          ),
        },
      ]);

  const onOpenDrawer = () => {
    setNeedInDrawer({ activo: true } as Need);
  };

  const renderActions = () => (
    <AddButton size={'small'} onClick={onOpenDrawer}>
      Nuevo
    </AddButton>
  );

  const loadNeeds = () => {
    setLoading(true);

    HttpCacheProduct.getNeeds(false).then((needs) => {
      setNeeds(needs);
      setLoading(false);
    });
  };

  const onHandleCloseDrawer = () => setNeedInDrawer(null);

  const onHandleSubmitDrawer = (message: string) => {
    setNeedInDrawer(null);
    snackbarSuccess(message);
    loadNeeds();
  };

  useEffect(() => {
    loadNeeds();
  }, []);

  return (
    <Stack spacing={2}>
      <TabSectionCardHeader icon={HandHeart}
                            sectionTitle={'Listado de necesidades'}
                            actions={renderActions()}
      />
      <Card>
        <CondensedTableList<Need>
            entityList={needs}
            columns={needColumns}
            isLoading={loading}
            error={false}
        />
      </Card>

      {needInDrawer && (
        <NeedFormDrawer
          entity={needInDrawer}
          title={`${needInDrawer.id ? 'Editar Necesidad' : 'Nueva Necesidad'}`}
          onCloseDrawer={onHandleCloseDrawer}
          onSubmitDrawer={onHandleSubmitDrawer}
        />
      )}
    </Stack>
  );
}

export default NeedsList;
