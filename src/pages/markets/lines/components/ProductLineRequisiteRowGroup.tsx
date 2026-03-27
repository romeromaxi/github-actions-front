import React, { useState } from 'react';
import {
  ProductLineRequisiteDescriptionFields,
  ProductLineRequisiteDescriptionView,
} from 'types/lines/productLineData';
import { Box, Collapse, Grid } from '@mui/material';
import { ExpandIconButton } from 'components/buttons/Buttons';
import ProductLineRequisiteRowTitle from './ProductLineRequisiteRowTitle';
import { EntityWithIdFields } from 'types/baseEntities';
import ProductLineRequisiteRow from './ProductLineRequisiteRow';

interface ProductLineRequisiteRowGroupProps {
  requisiteDescription: ProductLineRequisiteDescriptionView;
}

function ProductLineRequisiteRowGroup({
  requisiteDescription,
}: ProductLineRequisiteRowGroupProps) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const requisiteRowData =
    requisiteDescription[
      ProductLineRequisiteDescriptionFields.DetailDescription
    ];

  const rowList = requisiteRowData.map((requisite, index) => {
    const isGrouped = requisiteRowData.length > 1;
    return (
      <Grid
        container
        key={`requisiteRowData_${requisiteDescription[EntityWithIdFields.Id]}_${index}`}
      >
        <Grid item xs={1}>
          <Box width={1} />
        </Grid>

        <Grid item xs={11}>
          <Box sx={{ ml: isGrouped ? 5 : 0 }}>
            <ProductLineRequisiteRow label={requisite} />
          </Box>
        </Grid>
      </Grid>
    );
  });

  return (
    <>
      <Grid container>
        <Grid item xs={1}>
          {requisiteRowData.length != 1 && (
            <ExpandIconButton
              initialExpanded={'expandMore'}
              sx={{ m: 0, p: 0 }}
              onClick={() => setCollapsed(!collapsed)}
              tooltipTitle={collapsed ? 'Contraer' : 'Expandir'}
            />
          )}
        </Grid>

        <Grid item xs={11}>
          <ProductLineRequisiteRowTitle
            requisiteDescription={requisiteDescription}
          />
        </Grid>
      </Grid>

      {requisiteRowData.length > 1 && (
        <Collapse in={collapsed}>{rowList}</Collapse>
      )}
    </>
  );
}

export default ProductLineRequisiteRowGroup;
