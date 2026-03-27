import React, { useEffect } from 'react';
import ProductLineDetailDialog, {
  ProductLineDetailDialogProps,
} from './ProductLineDetailDialog';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { HttpMarketLineViewDetail } from '../../../../http/market/httpMarketLineViewDetail';

function ProductLineDetailDialogWithAnalytics(
  props: ProductLineDetailDialogProps,
) {
  useEffect(() => {
    if (props.open) {
      HttpMarketLineViewDetail.recordLineDetailViewed(
        props.line[EntityWithIdFields.Id],
      ).then((r) => console.log(r));
    }
  }, [props.open]);

  return <ProductLineDetailDialog {...props} />;
}

export default ProductLineDetailDialogWithAnalytics;
