import React, { useEffect, useState } from 'react';
import {
  ProductLineViewDetail,
  ProductLineRequirementFields,
  ProductLineRequirementView,
} from '../../../../types/lines/productLineData';
import { Divider, Stack, Typography } from '@mui/material';
import { LoadingProductLineRequisiteList } from './ProductLineRequisiteList';
import { HttpProductLineRequirement } from '../../../../http';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import MarketTypography from '../../components/MarketTypography';

interface ProductLineDetailRequirementsProps {
  productLine: ProductLineViewDetail;
}

export function ProductLineDetailRequirementList({
  productLine,
}: ProductLineDetailRequirementsProps) {
  const [requirementList, setRequirementList] = useState<
    ProductLineRequirementView[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    HttpProductLineRequirement.getByProductLine(
      productLine[EntityWithIdFields.Id],
    ).then((requirementList) => {
      setRequirementList(requirementList);
      setLoading(false);
    });
  }, [productLine]);

  return (
    <Stack direction={'column'} gap={2}>
      <MarketTypography
        variant={'h6'}
        style={{ fontWeight: 500, fontSize: '1.25rem', color: '#111' }}
      >
        Requerimientos
      </MarketTypography>
      {loading ? (
        <LoadingProductLineRequisiteList />
      ) : requirementList.length > 0 ? (
        requirementList.map((r) => (
          <div>
            <ProductLineRequirement requirement={r} />
            <Divider />
          </div>
        ))
      ) : (
        <MarketTypography
          sx={{ fontSize: '0.875rem', color: '#444', fontWeight: 500 }}
        >
          Sin requerimientos
        </MarketTypography>
      )}
    </Stack>
  );
}

interface ProductLineRequirementProps {
  requirement: ProductLineRequirementView;
}

export function ProductLineRequirement({
  requirement,
}: ProductLineRequirementProps) {
  return (
    <Stack direction={'row'} gap={2}>
      <InsertDriveFileOutlinedIcon fontSize={'small'} />
      <Typography sx={{ fontSize: '0.875rem', color: '#444', fontWeight: 500 }}>
        <strong>
          {requirement?.[ProductLineRequirementFields.Description]}
        </strong>
      </Typography>
    </Stack>
  );
}
