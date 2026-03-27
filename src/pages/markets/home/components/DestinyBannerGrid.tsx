import React from 'react';
// @ts-ignore
import avales from '../../../../assets/img/slides/avales.jpg';
// @ts-ignore
import apertura from '../../../../assets/img/slides/apertura.jpg';
// @ts-ignore
import capital from '../../../../assets/img/slides/capitaldetrabajo.jpg';
// @ts-ignore
import documentos from '../../../../assets/img/slides/documentos.jpg';
// @ts-ignore
import inversion from '../../../../assets/img/slides/inversion.jpg';
// @ts-ignore
import seguros from '../../../../assets/img/slides/seguros.jpg';
import DestinyBanner, { DestinyBannerProps } from './DestinyBanner';
import { Grid } from '@mui/material';
import {
  ProductDestinyTypes,
  ProductServiceTypes,
} from '../../../../types/product/productdestinyData';

function DestinyBannerGrid() {
  const bannerProps: DestinyBannerProps[] = [
    {
      src: capital,
      title: 'Capital de trabajo',
      to: `/market/landing?destiny=${ProductDestinyTypes.WorkingCapital}`,
    },
    {
      src: inversion,
      title: 'Inversión',
      to: `/market/landing?destiny=${ProductDestinyTypes.Investment}`,
    },
    {
      src: apertura,
      title: 'Apertura de cuentas',
      to: `/market/landing?destiny=${ProductDestinyTypes.AccountOpening}`,
    },
    {
      src: seguros,
      title: 'Seguros',
      to: `/market/landing?destiny=${ProductDestinyTypes.Insurance}`,
    },
    {
      src: avales,
      title: 'Avales',
      to: `/market/landing?service=${ProductServiceTypes.Endorsements}`,
    },
    {
      src: documentos,
      title: 'Documentos',
      to: `/market/landing?service=${ProductServiceTypes.DiscountDocuments}`,
    },
  ];

  return (
    <Grid container spacing={1}>
      {bannerProps.map((props: DestinyBannerProps) => {
        return (
          <Grid item xs={12} md={6} lg={4}>
            <DestinyBanner {...props} />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default DestinyBannerGrid;
