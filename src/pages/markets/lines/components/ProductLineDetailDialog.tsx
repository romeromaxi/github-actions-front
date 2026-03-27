import React, { ReactElement, useEffect, useState } from 'react';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  Stack,
} from '@mui/material';
import MarketTypography from '../../components/MarketTypography';
import {
  ProductLineViewDetail,
  ProductLineDescriptionsFields,
  ProductLineFields,
  ProductLineView,
} from 'types/lines/productLineData';
import OffererLogo from '../../../offerer/components/OffererLogo';
import { CompanyViewDTO } from 'types/company/companyData';
import { HttpCompany } from 'http/index';
import ShoppingBagActionButton from '../shoppingbag/ShoppingBagActionButton';
import ProductBanner from './ProductBanner';
import ProductDetailSwiper from '../detail/ProductDetailSwiper';
import { ProductLineDetailTable } from '../detail/ProductLineDetailTable';
import ProductLineRequisiteCard from './ProductLineRequisiteCard';

export interface ProductLineDetailDialogProps extends DialogProps {
  onClose: () => void;
  line: ProductLineViewDetail;
}

function ProductLineDetailDialog(props: ProductLineDetailDialogProps) {
  const [companies, setCompanies] = useState<CompanyViewDTO[]>([]);

  const renderDesciptionField = (
    descriptionsFields: ProductLineDescriptionsFields,
  ): ReactElement => {
    const description: string | undefined =
      props.line[ProductLineFields.ProductLineDescriptions]?.[
        descriptionsFields
      ];

    const completeDescription =
      !!description && description !== '<p></p>' && description !== '<p></p>\n';

    return (
      <MarketTypography>
        {completeDescription ? (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <div style={{ fontStyle: 'italic' }}>Sin información.</div>
        )}
      </MarketTypography>
    );
  };

  const getCompanies = () =>
    HttpCompany.getCompaniesByUser().then((response) => {
      setCompanies(response);
    });

  useEffect(() => {
    getCompanies();
  }, [props.line]);

  return (
    <Dialog {...props} maxWidth={'lg'} fullWidth>
      <BaseDialogTitle onClose={props.onClose} title={'Detalle Línea'} />
      <DialogContent>
        <Grid container spacing={5} alignItems={'flex-start'}>
          <Grid item xs={12}>
            <ProductBanner product={props.line} />
          </Grid>
          <Grid item container xs={8} spacing={2}>
            <Grid item xs={12}>
              <Stack direction={'column'} gap={1}>
                <MarketTypography fontSize={16} fontWeight={700}>
                  Descripción de la línea
                </MarketTypography>
                <MarketTypography>
                  {props.line[ProductLineFields.LineLarge]}
                </MarketTypography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction={'column'} gap={1}>
                <MarketTypography fontSize={16} fontWeight={700}>
                  Información comercial
                </MarketTypography>

                {renderDesciptionField(
                  ProductLineDescriptionsFields.CommercialDescription,
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={
                    <MarketTypography fontSize={16} fontWeight={700}>
                      Información de la línea
                    </MarketTypography>
                  }
                  subheader={
                    <MarketTypography fontSize={13} fontWeight={500}>
                      Los datos principales
                    </MarketTypography>
                  }
                />
                <CardContent>
                  <ProductLineDetailTable productLine={props.line} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Stack direction={'column'} gap={1}>
                <MarketTypography fontSize={16} fontWeight={700}>
                  Disclaimer
                </MarketTypography>

                {renderDesciptionField(
                  ProductLineDescriptionsFields.Disclaimer,
                )}
              </Stack>
            </Grid>
          </Grid>
          <Grid item container xs={4}>
            <Grid item xs={6}>
              <OffererLogo
                offererId={props.line[ProductLineFields.OffererId]}
                sx={{ width: '10rem', height: '5.5rem' }}
              />
            </Grid>
            <Grid
              item
              container
              xs={6}
              justifyContent={'flex-end'}
              alignItems={'center'}
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <ShoppingBagActionButton
                  productLine={props.line as unknown as ProductLineView}
                  companies={companies}
                  basic={false}
                  reloadCompanies={getCompanies}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <ProductLineRequisiteCard
                productLineId={props.line[ProductLineFields.Id]}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                sx={{ textAlign: 'center' }}
                title={
                  <MarketTypography fontSize={16} fontWeight={700}>
                    ¿Cómo sigue el proceso para mi precalificación?
                  </MarketTypography>
                }
                subheader={
                  'Lo primero que tenés que hacer es agregar esta línea a la selección.'
                }
              />
              <CardContent>
                <ProductDetailSwiper line={props.line} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ProductLineDetailDialog;
