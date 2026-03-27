import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import Section from 'components/cards/Section';
import ProductLineRequisiteChip from './components/ProductLineRequisiteChip';

import {
  ProductLineRequisiteDetailFields,
  ProductLineRequisiteDetailView,
} from 'types/lines/productLineData';

import { HttpProductLineRequisite } from 'http/line/httpProductLineRequisite';

interface ProductLineRequisiteListProps {
  productLineId: number;
}

interface ProductLineRequisiteByType {
  [key: number]: ProductLineRequisiteDetailView[];
}

function ProductLineRequisiteList(props: ProductLineRequisiteListProps) {
  const [requisitesByType, setRequisitesByType] =
    useState<ProductLineRequisiteByType>();

  useEffect(() => {
    HttpProductLineRequisite.getByProductLine(props.productLineId).then(
      (requisites) => {
        let dictionaryRequisites: ProductLineRequisiteByType = {};

        requisites.forEach((requisite) => {
          let typeCode: number =
            requisite[
              ProductLineRequisiteDetailFields.ProductLineRequisiteTypeCode
            ];
          if (dictionaryRequisites[typeCode])
            dictionaryRequisites[typeCode] = [
              ...dictionaryRequisites[typeCode],
              requisite,
            ];
          else dictionaryRequisites[typeCode] = [requisite];
        });

        setRequisitesByType(dictionaryRequisites);
      },
    );
  }, []);

  const mapRequisites = () => {
    let components: React.ReactElement[] = [];

    if (!requisitesByType) return components;

    let entries = Object.entries(requisitesByType);

    if (entries.length)
      entries.forEach(([key, value]) => {
        components.push(
          <ProductLineRequisiteChip
            requisiteType={parseInt(key)}
            requisites={value}
          />,
        );
      });
    else
      components.push(
        <Typography fontWeight={500} fontStyle="italic" color="text.disabled">
          Sin requisitos
        </Typography>,
      );

    return components;
  };

  return (
    <Section title="Requisitos">
      {requisitesByType ? (
        <Stack spacing={1} pl={'3%'}>
          {mapRequisites()}
        </Stack>
      ) : (
        <div>Cargando...</div>
      )}
    </Section>
  );
}

export default ProductLineRequisiteList;
