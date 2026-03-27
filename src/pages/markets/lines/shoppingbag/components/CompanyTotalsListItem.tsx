import React from 'react';
import { Chip } from '@mui/material';
import { ShoppingBagListItem } from './ShoppingBagListItem';
import { CompanyLineStatusViewDTOFields } from 'types/lines/productLineData';
import {
  CompanyTotalsShoppingCart,
  CompanyTotalsShoppingCartFields,
} from 'types/market/marketData';
import {EntityWithIdFields} from "../../../../../types/baseEntities";

export interface CompanyTotalsListItemProps {
  companyTotal: CompanyTotalsShoppingCart;
  onClick: (selected: boolean | null) => void;
  selected?: boolean;
  multiple?: boolean;
}

export function CompanyTotalsListItem({
  companyTotal,
  selected,
  onClick, multiple
}: CompanyTotalsListItemProps) {
  const componentChildren =
    companyTotal[CompanyTotalsShoppingCartFields.NumberLinesInShoppingCart] >
    0 ? (
      <Chip
        label={`${companyTotal[CompanyTotalsShoppingCartFields.NumberLinesInShoppingCart]} ${companyTotal[CompanyTotalsShoppingCartFields.NumberLinesInShoppingCart] > 1 ? 'lineas' : 'linea'}`}
        size={'small'}
        color={'primary'}
      />
    ) : (
      <></>
    );

  return (
    <ShoppingBagListItem
      companyId={companyTotal[EntityWithIdFields.Id]}
      businessName={companyTotal[CompanyLineStatusViewDTOFields.BusinessName]}
      companyPersonType={companyTotal[CompanyLineStatusViewDTOFields.PersonTypeCode]}
      onClick={onClick} multiple={multiple}
      selected={!!selected}
      hasPermissions={
        companyTotal[CompanyLineStatusViewDTOFields.HasPermissions]
      }
      allowChoose={companyTotal[CompanyLineStatusViewDTOFields.HasPermissions]}
    >
      {componentChildren}
    </ShoppingBagListItem>
  );
}
