import { useEffect, useState } from 'react';
import {Card, CardContent, CardHeader, Grid} from '@mui/material';

import { useProductLineDetail } from '../ProductLineDetailContext';
import ProductLineDetailLayoutPage from '../components/ProductLineDetailLayoutPage';
import ProductLineDetailApprovalAnalysis from './ProductLineDetailApprovalAnalysis';
import ProductLineDetailApprovalHistoricList from './ProductLineDetailApprovalHistoricList';

import { HttpProductLineApproval } from 'http/index';
import { ProductLineApprovalView } from 'types/lines/productLineApprovalData';

function ProductLineDetailApprovalPage() {
  const { lineId } = useProductLineDetail();

  const [loading, setLoading] = useState<boolean>(true);
  const [actualApproval, setActualApproval] =
    useState<ProductLineApprovalView>();
  const [approvalResults, setApprovalResults] =
    useState<ProductLineApprovalView[]>();

  useEffect(() => {
    Promise.all([
      HttpProductLineApproval.getActualByProductLineId(lineId),
      HttpProductLineApproval.getHistoricListByProductLineId(lineId),
    ])
      .then(([actual, history]) => {
        setActualApproval(actual);
        setApprovalResults(history || []);
      })
      .catch(() => setApprovalResults([]))
      .finally(() => setLoading(false));
  }, []);

  return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Card>
              <CardHeader title='Solicitud de Publicación'/>
            <CardContent sx={{ paddingTop: 4 }}>
              <ProductLineDetailApprovalAnalysis
                actualApproval={actualApproval}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {/*
                        (actualTab !== 0) &&
                            <ProductLineDetailApprovalHistoricList approvalResults={approvalResults} />
                            */}
          <ProductLineDetailApprovalHistoricList
            approvalResults={approvalResults}
          />
        </Grid>
      </Grid>
  );
}

export default ProductLineDetailApprovalPage;
