import React, { useState } from 'react';
import {Card, CardActions, Stack, Typography} from '@mui/material';
import { ITableColumn, Pagination, TableList } from 'components/table';

import { EntityPagination, EntityPaginationFields } from 'types/baseEntities';
import {
  Offerer,
  OffererFields,
  OffererQuaFilterSearch,
} from 'types/offerer/offererData';
import OffererLogoUpdateDialog from './OffererLogoUpdateDialog';
import {SearchButton} from '../../../components/buttons/Buttons';
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {stringFormatter} from "../../../util/formatters/stringFormatter";

interface OffererTableListProps {
  loading: boolean;
  offerers?: Offerer[];
  pagination?: EntityPagination;
  searchOfferers: (p: OffererQuaFilterSearch) => void;
  prevFilter: OffererQuaFilterSearch;
}

function OffererTableList({
  loading,
  offerers,
  pagination,
  searchOfferers,
  prevFilter
}: OffererTableListProps) {
  const [offererToChangeLogo, setOffererToChangeLogo] = useState<Offerer>();

  const columns: ITableColumn[] = [
    { 
      label: 'Nombre', 
      value: OffererFields.BusinessName, 
      textAlign: 'left',
      onRenderCell: (entity: Offerer) => (
       <Stack>
         <TypographyBase maxLines={2} tooltip>{entity[OffererFields.BusinessName]}</TypographyBase>
         <Typography variant='caption' color="text.lighter">
           {stringFormatter.formatCuit(entity[OffererFields.CUIT])}
         </Typography>
       </Stack>       
    )},
    { label: 'Acesso', value: OffererFields.LogInName },
    { label: 'Nombre Fantasía', value: OffererFields.BusinessTradeName },
    { label: 'Usuarios', value: OffererFields.UsersQuantity },
    { label: 'Tipo', value: OffererFields.Type },
    { label: 'Status', value: OffererFields.Status },
    {
      label: '',
      value: '',
      onRenderCell: (offerer: Offerer) => (
        <SearchButton
          color={'inherit'}
          size={'small'}
          onClick={() => setOffererToChangeLogo(offerer)}
        >
          Logo
        </SearchButton>
      ),
    },
  ];

  const onPaging = (actualPage: number) => {
    const filter: OffererQuaFilterSearch = {
      ...prevFilter,
      [EntityPaginationFields.ActualPage]: actualPage,
    };

    searchOfferers(filter);
  };

  return (
    <Card>
      <TableList<Offerer>
        entityList={offerers}
        columns={columns}
        isLoading={loading}
        error={false}
      />

      <CardActions>
        <Pagination
          entityPagination={pagination}
          isLoading={loading}
          onPaging={onPaging}
        />
      </CardActions>

      <OffererLogoUpdateDialog
        offerer={offererToChangeLogo}
        onCloseDialog={() => setOffererToChangeLogo(undefined)}
      />
    </Card>
  );
}

export default OffererTableList;
