import React, { useEffect, useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
} from '@mui/material';

import { dateFormatter } from 'util/formatters/dateFormatter';
import ProductLineDetailApprovalHistoricItem from './ProductLineDetailApprovalHistoricItem';
import {
  ProductLineApprovalFields,
  ProductLineApprovalView,
} from 'types/lines/productLineApprovalData';
import { ProductLineApprovalResultType } from 'types/lines/productLineEnums';

interface ProductLineDetailApprovalHistoricListProps {
  approvalResults?: ProductLineApprovalView[];
}

function ProductLineDetailApprovalHistoricList({
  approvalResults,
}: ProductLineDetailApprovalHistoricListProps) {
  const [orderedList, setOrderedList] = useState<ProductLineApprovalView[]>();
  const validHistoricApproval = (
    approval: ProductLineApprovalView,
    firstItem: boolean,
  ) =>
    !(
      approval[ProductLineApprovalFields.ProductLineApprovalResultCode] ===
      ProductLineApprovalResultType.Pendant
    );

  const orderProductLineApprovals = (list: ProductLineApprovalView[]) => {
    const orderedProductLineApprovals = list.sort((a, b) => {
      if (
        !a[ProductLineApprovalFields.ApprovalResultDate] &&
        !b[ProductLineApprovalFields.ApprovalResultDate]
      )
        return 0;
      if (!a[ProductLineApprovalFields.ApprovalResultDate]) return 1;
      if (!b[ProductLineApprovalFields.ApprovalResultDate]) return -1;

      return (
        new Date(b[ProductLineApprovalFields.ApprovalResultDate]!).getTime() -
        new Date(a[ProductLineApprovalFields.ApprovalResultDate]!).getTime()
      );
    });

    setOrderedList(orderedProductLineApprovals);
  };

  useEffect(() => {
    if (approvalResults && approvalResults.length !== 0) {
      orderProductLineApprovals(approvalResults);
    }
  }, [approvalResults]);

  return (
    <>
      {approvalResults && approvalResults.length !== 0 && (
        <>
          <Typography variant="h3" color="dark" fontWeight={600} mt={1} mb={1}>
            Historial de Aprobaciones
          </Typography>
          <Divider />
          <Box mb={2} />
        </>
      )}
      {orderedList?.map(
        (prevApproval, idx) =>
          validHistoricApproval(prevApproval, idx === 0) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <h3>{`Análisis del ${dateFormatter.toLongDate(prevApproval[ProductLineApprovalFields.ApprovalResultDate] || '')}`}</h3>
              </AccordionSummary>
              <AccordionDetails>
                <ProductLineDetailApprovalHistoricItem
                  approval={prevApproval}
                />
              </AccordionDetails>
            </Accordion>
          ),
      )}
    </>
  );
}

export default ProductLineDetailApprovalHistoricList;
