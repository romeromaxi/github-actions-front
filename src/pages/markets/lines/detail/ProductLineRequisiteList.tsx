import React, { useEffect, useState } from 'react';
import {
    ProductLineViewDetail,
  ProductLineRequisiteDetailFields,
  ProductLineRequisiteDetailView,
} from '../../../../types/lines/productLineData';
import { Divider, Skeleton, Stack, Typography } from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { HttpProductLineRequisite } from '../../../../http';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import MarketTypography from '../../components/MarketTypography';

interface ProductLineDetailRequirementsProps {
  productLine: ProductLineViewDetail;
}

export function ProductLineDetailRequisiteList({
  productLine,
}: ProductLineDetailRequirementsProps) {
  const [requisiteList, setRequisiteList] = useState<
    ProductLineRequisiteDetailView[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    HttpProductLineRequisite.getByProductLine(
      productLine[EntityWithIdFields.Id],
    ).then((requisiteList) => {
      setRequisiteList(requisiteList);
      setLoading(false);
    });
  }, [productLine]);

  return (
    <Stack direction={'column'} gap={2}>
      <MarketTypography
        variant={'h6'}
        style={{ fontWeight: 500, fontSize: '1.25rem', color: '#111' }}
      >
        Requisitos
      </MarketTypography>
      {loading ? (
        <LoadingProductLineRequisiteList />
      ) : requisiteList.length > 0 ? (
        requisiteList.map((r) => (
          <div>
            <ProductLineRequisite requisite={r} />
            <Divider />
          </div>
        ))
      ) : (
        <MarketTypography>Sin requisitos</MarketTypography>
      )}
    </Stack>
  );
}

interface ProductLineRequisiteProps {
  requisite: ProductLineRequisiteDetailView;
}

export function ProductLineRequisite({ requisite }: ProductLineRequisiteProps) {
  return (
    <Stack direction={'row'} gap={2}>
      <InsertDriveFileOutlinedIcon fontSize={'small'} />
      <MarketTypography
        sx={{ fontSize: '0.875rem', color: '#444', fontWeight: 500 }}
      >
        <strong>
          {requisite?.[ProductLineRequisiteDetailFields.RequisiteTitle]}
        </strong>
      </MarketTypography>
    </Stack>
  );
}

export function LoadingProductLineRequisite() {
  return (
    <Stack direction={'row'} gap={2}>
      <InsertDriveFileOutlinedIcon fontSize={'small'} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: 1 }} />
    </Stack>
  );
}

export function LoadingProductLineRequisiteList() {
  return (
    <>
      {[...Array(3)].map(() => (
        <div>
          <LoadingProductLineRequisite />
          <Divider />
        </div>
      ))}
    </>
  );
}
