import { Stack, Typography } from "@mui/material";
import { DiagonalArrowButton } from "../../components/buttons/Buttons";
import { OptimizedStepImage } from "./OptimizedStepImage";
import React from "react";
import {CenteredButtonWrapper} from "./CenteredButtonWrapper";
// @ts-ignore
import marketSearchByProductsStep from "assets/img/market/home/stepBusquedaPorProductos.png"
import marketSearchByProductsStepMobile1 from "assets/img/market/home/stepBusquedaPorProductos_mobile1.png"
import marketSearchByProductsStepMobile2 from "assets/img/market/home/stepBusquedaPorProductos_mobile2.png"
import marketSearchByProductsStepMobile3 from "assets/img/market/home/stepBusquedaPorProductos_mobile3.png"

interface MarketStepsHelperProductSearchProps {
  isSmallScreen: boolean;
  onClick: () => void;
}

export const MarketStepsHelperProductSearch = React.memo(({ 
  isSmallScreen, 
  onClick 
}: MarketStepsHelperProductSearchProps) => (
  <Stack spacing={3}>
    <Typography variant={'h3'} fontSize={30} fontWeight={500} textAlign={'center'}>
      Búsqueda por Productos
    </Typography>
    <OptimizedStepImage
      src={marketSearchByProductsStep}
      mobileSrcs={[
        marketSearchByProductsStepMobile1,
        marketSearchByProductsStepMobile2,
        marketSearchByProductsStepMobile3
      ]}
      isSmallScreen={isSmallScreen}
      alt="Búsqueda por Productos steps"
    />
    <CenteredButtonWrapper>
      <DiagonalArrowButton size={'small'} sx={{textAlign: 'center'}} onClick={onClick}>
        Ir a la góndola
      </DiagonalArrowButton>
    </CenteredButtonWrapper>
  </Stack>
));