import React, { useState } from 'react';
import {
  EntityPagination,
  EntityPaginationFields,
} from '../../../types/baseEntities';
import {
  ITableColumn,
  Pagination,
  TableColumnType,
  TableList,
} from '../../../components/table';
import {Card, CardActions, Stack, Typography} from '@mui/material';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import { SearchButton } from '../../../components/buttons/Buttons';
import {
  PersonQuaFilterSearch,
  PersonSummaryView,
  PersonSummaryViewFields,
} from '../../../types/person/personData';
import PersonValidateStateChip from './PersonValidateStateChip';
import InternalValidateDataDrawer from './InternalValidateDataDrawer';
import {TypographyBase} from "../../../components/misc/TypographyBase";

interface InternalCompaniesTableListProps {
  loading: boolean;
  persons?: PersonSummaryView[];
  pagination?: EntityPagination;
  searchPersons: (arg: PersonQuaFilterSearch) => void;
  prevFilter: PersonQuaFilterSearch;
}

function InternalValidatePersonTableList({
  loading,
  persons,
  pagination,
  searchPersons,
  prevFilter,
}: InternalCompaniesTableListProps) {
  const [viewPerson, setViewPerson] = useState<PersonSummaryView>();

  const onPaging = (page: number) => {
    const filter: PersonQuaFilterSearch = {
      ...prevFilter,
      [EntityPaginationFields.ActualPage]: page,
    };

    searchPersons(filter);
  };

  const columns: ITableColumn[] = [
    {
      label: 'Razón Social',
      value: PersonSummaryViewFields.BusinessName,
      textAlign: 'left',
      onRenderCell: (entity: PersonSummaryView) => (
          <Stack>
            <TypographyBase maxLines={2} tooltip>{entity[PersonSummaryViewFields.BusinessName]}</TypographyBase>
            <Typography variant="caption" color="text.lighter">{stringFormatter.formatCuit(entity[PersonSummaryViewFields.CUIT])}</Typography>
          </Stack>
      )
    },
    {
      label: 'Persona Tipo',
      value: PersonSummaryViewFields.PersonTypeDesc,
    },
    {
      label: 'Fecha',
      value: PersonSummaryViewFields.ValidationStateDate,
      type: TableColumnType.Date,
    },
    {
      label: 'Estado',
      onRenderCell: (person: PersonSummaryView) => (
        <PersonValidateStateChip
          label={person[PersonSummaryViewFields.ValidationStateDesc]}
          code={person[PersonSummaryViewFields.ValidationStateCode]}
        />
      ),
    },
    {
      label: '',
      onRenderCell: (person: PersonSummaryView) => (
        <SearchButton
          size={'small'}
          color={'inherit'}
          onClick={() => {
            setViewPerson(person);
          }}
        >
          Ver
        </SearchButton>
      ),
    },
  ];

  const onCloseValidateDrawer = () => setViewPerson(undefined);

  return (
    <Card>
      <TableList<PersonSummaryView>
        entityList={persons}
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

      {viewPerson && (
        <InternalValidateDataDrawer
          open
          person={viewPerson}
          onClose={onCloseValidateDrawer}
          onReload={() => {
            searchPersons(prevFilter);
          }}
        />
      )}
    </Card>
  );
}

export default InternalValidatePersonTableList;
