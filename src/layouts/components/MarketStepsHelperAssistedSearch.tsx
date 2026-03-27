import { Stack, Typography } from "@mui/material";
import { DiagonalArrowButton } from "../../components/buttons/Buttons";
import { OptimizedStepImage } from "./OptimizedStepImage";
import React from "react";
import {CenteredButtonWrapper} from "./CenteredButtonWrapper";
// @ts-ignore
import marketAssistedSearchStep from "assets/img/market/home/stepBusquedaAsistida.png"
import marketAssistedSearchStepMobile1 from "assets/img/market/home/stepBusquedaAsistida_mobile1.png"
import marketAssistedSearchStepMobile2 from "assets/img/market/home/stepBusquedaAsistida_mobile2.png"
import marketAssistedSearchStepMobile3 from "assets/img/market/home/stepBusquedaAsistida_mobile3.png"

interface MarketStepsHelperAssistedSearchProps {
  isSmallScreen: boolean;
  onClick: () => void;
}

export const MarketStepsHelperAssistedSearch = React.memo(({ 
  isSmallScreen, 
  onClick 
}: MarketStepsHelperAssistedSearchProps) => (
  <Stack spacing={3}>
    <Typography variant={'h3'} fontSize={30} fontWeight={500} textAlign={'center'}>
      Búsqueda Asistida
    </Typography>
    <OptimizedStepImage
      src={marketAssistedSearchStep}
      mobileSrcs={[
        marketAssistedSearchStepMobile1,
        marketAssistedSearchStepMobile2,
        marketAssistedSearchStepMobile3
      ]}
      isSmallScreen={isSmallScreen}
      alt="Búsqueda Asistida steps"
    />
    <CenteredButtonWrapper>
      <DiagonalArrowButton size={'small'} sx={{textAlign: 'center'}} onClick={onClick}>
        Ir a Búsqueda Asistida LUC
      </DiagonalArrowButton>
    </CenteredButtonWrapper>
  </Stack>
));