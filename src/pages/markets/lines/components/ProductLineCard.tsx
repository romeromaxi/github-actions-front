import React from 'react';
import clsx from "clsx";
import {Box, Card, CardActions, CardContent, CardProps, Link, Stack} from '@mui/material';

import {ProductLineFields, ProductLineView,} from 'types/lines/productLineData';
import {OffererLogoWithName} from 'pages/offerer/components/OffererLogo';
import ProductLineCardActions from './ProductLineCardActions';
import ProductLineCardStyles from "./ProductLineCard.styles";
import {TypographyBase} from "components/misc/TypographyBase";
import {useAppNavigation} from "hooks/navigation";
import {MarketRoute} from "routes/market/routeAppMarketData";
import {CompanyLogoById} from 'pages/company/components/CompanyLogo';
import {PersonTypes} from "types/person/personEnums";

interface ProductLineCardProps extends CardProps {
  productLine: ProductLineView;
  onReload?: () => void;
  pageIsShoppingCart?: boolean;
  //este prop es para poder renderear los botones dentro del swiper, sino quedan afuera del card
  pushActionLeft?: boolean;
  viewMode?: boolean;
  inSwiper?: boolean;
  suggestedPage?: boolean;
  changeStyles?: boolean;
  fromLanding?: boolean;
  addBorder?: boolean
}

function ProductLineCard({
  productLine,
  pushActionLeft = false,
  viewMode = false,
  inSwiper = false,
  suggestedPage = false,
  changeStyles = false,
  fromLanding = false,
  addBorder = false,
  ...cardProps
}: ProductLineCardProps) {
  const { getPath } = useAppNavigation();
    
  const classes = ProductLineCardStyles();  
  const routeToPublishedLine =
      getPath(MarketRoute.MarketDetailLine, { uniProductLineId: productLine[ProductLineFields.UniqueId] });
    
  return (
      <Card className={clsx(classes.root, {
          [classes.withBorder]: addBorder
      })}
            {...cardProps}
      >
          {
              viewMode ?
                  <ProductLineCardContent productLine={productLine} />
                  :
                  <Link className={classes.link} href={routeToPublishedLine} underline="none">
                      <ProductLineCardContent productLine={productLine} />
                  </Link>
          }

          {(!changeStyles) && (
              <CardActions
                  sx={{width: 1, p: 0 }}
              >
                  <Stack
                      sx={{ width: 1 }}
                      direction={'row'}
                      alignItems={'center'}
                      justifyContent={'center'}
                  >
                      {
                          (!viewMode) &&
                          <ProductLineCardActions productLine={productLine} />
                      }
                  </Stack>
              </CardActions>
          )}
      </Card>
  );
}

interface ProductLineCardContentProps {
    productLine: ProductLineView;
}

function ProductLineCardContent({ productLine }: ProductLineCardContentProps) {
    return (
        <CardContent>
            <Stack spacing={1.25}>
                {
                    !!productLine[ProductLineFields.RecommendationDescription] && (
                        <Box>
                            <Stack direction={'row'} spacing={1.25} paddingY={0.75} paddingX={1}
                                   width={'fit-content'}
                                   sx={{ backgroundColor: '#F3F3F3', borderRadius: '27px' }}
                            >
                                {
                                    !!productLine[ProductLineFields.RecommendationCompanyId] && (
                                        <CompanyLogoById companyId={productLine[ProductLineFields.RecommendationCompanyId]}
                                                         isPhysicalPerson={productLine[ProductLineFields.RecommendationCompanyPersonTypeCode] === PersonTypes.Physical}
                                                         size={'xs'}
                                        />

                                    )
                                }
                                
                                <TypographyBase variant={'body4'} fontWeight={600} maxLines={1} tooltip>
                                    {productLine[ProductLineFields.RecommendationDescription]}
                                </TypographyBase>
                            </Stack>
                        </Box>
                    )
                }

                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}
                       width={1} spacing={1.25}>
                    <OffererLogoWithName offererId={productLine[ProductLineFields.OffererId]}
                                         offererUrlLogo={productLine[ProductLineFields.OffererUrlLogo]}
                                         offererBusinessName={productLine[ProductLineFields.OffererBusinessName]}
                                         StackProps={{ spacing: 1, width: '100%' }}
                                         NameProps={{ variant: 'body3', tooltip: true, maxLines: 1 }}
                                         withTooltip
                                         size={'sm'}
                    />

                    <TypographyBase variant={'body4'} color={'text.lighter'} 
                                    textAlign={'end'}
                                    sx={{ textWrapStyle: 'balance' }}
                    >
                        {productLine[ProductLineFields.ProductServiceDesc]}
                    </TypographyBase>
                </Stack>

                <TypographyBase variant={'h5'} maxLines={2} tooltip>
                    {productLine[ProductLineFields.Line]}
                </TypographyBase>
                <TypographyBase variant={'body3'} color={'text.lighter'}
                                maxLines={3} tooltip
                >
                    {productLine[ProductLineFields.LineLarge]}
                </TypographyBase>
            </Stack>
        </CardContent>
    )
}

export default ProductLineCard;
