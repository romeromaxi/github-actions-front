import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { Box, Card, Stack, styled, Tooltip, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import CardBase from 'components/cards/CardBase';
import { TitleNameProps } from 'components/text/TitleCard.styles';
import FavoriteIconButton from '../../components/icons/FavoriteIconButton';

import { stringFormatter } from 'util/formatters/stringFormatter';

import { EnumColors } from 'types/general/generalEnums';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  ProductLineFields,
  ProductLineView,
} from 'types/lines/productLineData';

// root component interface
interface ProductLineCardProps {
  productLine: ProductLineView;
  onReload?: () => void;
  pageIsShoppingCart?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: '0rem 0rem',
  //display: "flex",
  display: 'flex-root',
  alignItems: 'center',
  height: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: '0rem',
    //flexDirection: "column",
    flexDirection: 'row',
    justifyContent: 'center',
    '& .MuiBox-root': {
      marginRight: 0,
      textAlign: 'center',
    },
  },
}));

const ProductLineCard: FC<ProductLineCardProps> = ({
  productLine,
  onReload,
  pageIsShoppingCart,
}) => {
  return (
    <CardBase
      baseColor={EnumColors.LIGHTBLUE}
      title={
        <Stack direction="column">
          <Typography {...TitleNameProps}>
            {productLine[ProductLineFields.Line]}
          </Typography>
          <Box display="flex" alignItems="center">
            <AccountBalanceIcon sx={{ fontSize: '14px' }} />
            <Typography marginLeft={1} sx={{ fontSize: '14px' }}>
              {productLine[ProductLineFields.OffererBusinessName]}
            </Typography>
          </Box>
        </Stack>
      }
      summaryContent={
        <ProductLineCardSummaryContent
          productLine={productLine}
          onReload={onReload}
          pageIsShoppingCart={pageIsShoppingCart}
        />
      }
      detailContent={
        <Navigate
          to={`/market/lines/${productLine[ProductLineFields.OffererId]}/${productLine[EntityWithIdFields.Id]}`}
        />
      }
    />
  );
};

function ProductLineCardSummaryContent({
  productLine,
  onReload,
  pageIsShoppingCart,
}: ProductLineCardProps) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Tooltip
        title={productLine[ProductLineFields.LineLarge]}
        inputMode="text"
        placement="top"
      >
        <div>
          <Typography
            sx={{
              fontStyle: 'normal',
              fontWeight: 300,
              fontSize: '14px',
              lineHeight: '22px',
              color: 'rgb(95, 116, 141)',
            }}
          >
            {stringFormatter.cutIfHaveMoreThan(
              productLine[ProductLineFields.LineLarge],
              100,
            )}
          </Typography>
        </div>
      </Tooltip>

      <FavoriteIconButton
        productLineId={productLine[ProductLineFields.Id]}
        isInShoppingCart={productLine[ProductLineFields.IsInShoppingCart]}
        pageIsShoppingCart={pageIsShoppingCart}
        onReload={onReload}
      />
    </Stack>
  );
}

export default ProductLineCard;
