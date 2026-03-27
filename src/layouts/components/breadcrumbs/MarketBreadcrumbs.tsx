import React from 'react';
import BreadcrumbStyles from './Breadcrumb.styles';
import { useNavigate } from 'react-router-dom';
import MarketTypography from '../../../pages/markets/components/MarketTypography';
import {
  Breadcrumbs,
  breadcrumbsClasses,
  BreadcrumbsProps,
  Link,
  TypographyProps,
} from '@mui/material';

export type MarketBreadcrumb = {
  label: React.ReactNode;
  to?: string;
};

interface MarketBreadcrumbsProps {
  breadcrumbs: MarketBreadcrumb[];
  labelProps?: TypographyProps;
  breadcrumbsProps?: BreadcrumbsProps;
}

function MarketBreadcrumbs({
  breadcrumbs,
  labelProps,
  breadcrumbsProps,
}: MarketBreadcrumbsProps) {
  const classes = BreadcrumbStyles();
  const navigate = useNavigate();

  const breadcrumbsMapper = () => {
    const map = breadcrumbs.map((breadcrumb, idx) => {
      const textElement: React.ReactElement = (
        <MarketTypography
          {...labelProps}
          sx={{ color: 'white', textDecoration: 'none', ...labelProps?.sx }}
        >
          {breadcrumb.label}
        </MarketTypography>
      );
      const linkElement = (
        <Link
          key={`market-link-${idx}`}
          sx={{ textDecoration: 'none' }}
          onClick={() => navigate(breadcrumb?.to || '#')}
        >
          {textElement}
        </Link>
      );
      const returnElement = breadcrumb?.to ? linkElement : textElement;
      return returnElement;
    });
    return map;
  };

  return (
    <Breadcrumbs
      {...breadcrumbsProps}
      aria-label="breadcrumb"
      sx={{
        [`& .${breadcrumbsClasses.separator}`]: {
          color: 'white',
        },
        ...breadcrumbsProps?.sx,
      }}
      className={classes.rootLeft}
    >
      {breadcrumbsMapper()}
    </Breadcrumbs>
  );
}

export default MarketBreadcrumbs;
