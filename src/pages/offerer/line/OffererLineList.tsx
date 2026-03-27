import React, { useState } from 'react';
import { Grid } from '@mui/material';


import { HttpProductLine } from 'http/index';
import OffererLineTable from './components/OffererLineTable';
import { EntityWithIdFields } from '../../../types/baseEntities';
import ProductLineDetailDialog from '../../markets/lines/components/ProductLineDetailDialog';
import LineMarketViewDialog from './card/LineMarketViewDialog';
import { useNavigate } from 'react-router-dom';
import {ProductLineViewDetail, ProductLineViewSummaryWithPublicationData} from "../../../types/lines/productLineData";
import ProductLineSummaryDetailDrawer from 'pages/markets/lines/detail/ProductLineSummaryDetailDrawer';

interface OffererLinesBaseListProps {
  title?: string;
  offererId: number;
}

function OffererLineList({ title, offererId }: OffererLinesBaseListProps) {
  const navigate = useNavigate();
  const [productLineDetail, setProductLineDetail] = useState<ProductLineViewDetail>();
  const [productLineDetailOpen, setProductLineDetailOpen] =
    useState<boolean>(false);
  const [marketPreviewOpen, setMarketPreviewOpen] = useState<boolean>(false);

  const handleOnEdit = (line: ProductLineViewSummaryWithPublicationData) =>
    navigate(`/offerer/lines/${line[EntityWithIdFields.Id]}`);

  const handleOnDetail = (line: ProductLineViewSummaryWithPublicationData) => {
    HttpProductLine.getByProductLineId(line[EntityWithIdFields.Id]).then(
      (productLine) => {
        setProductLineDetail(productLine);
        setProductLineDetailOpen(true);
      },
    );
  };

  const handleOnMarketPreview = (line: ProductLineViewSummaryWithPublicationData) => {
    HttpProductLine.getByProductLineId(line[EntityWithIdFields.Id]).then(
      (productLine) => {
        setProductLineDetail(productLine);
        setMarketPreviewOpen(true);
      },
    );
  };

  return (
    <React.Fragment>
      <Grid container item xs={12} justifyContent="center">
        <Grid item xs={12}>
          <OffererLineTable
            onClickEdit={handleOnEdit}
            onClickDetail={handleOnDetail}
            onClickPreview={handleOnMarketPreview}
            offererId={offererId}
          />
        </Grid>
      </Grid>

      {
        productLineDetail && productLineDetailOpen && (
          <ProductLineSummaryDetailDrawer open={productLineDetailOpen}
                                          line={productLineDetail}
                                          onClose={() => {
                                            setProductLineDetailOpen(false);
                                            setProductLineDetail(undefined);
                                          }}
          />
        )
      }
      
      {productLineDetail && marketPreviewOpen && (
        <LineMarketViewDialog
          onClose={() => {
            setMarketPreviewOpen(false);
            setProductLineDetail(undefined);
          }}
          line={productLineDetail}
          open={marketPreviewOpen}
        />
      )}
    </React.Fragment>
  );
}

export default OffererLineList;
