import React, {useMemo} from 'react';
import {FieldErrors, useFormContext } from 'react-hook-form';
import {Box, Button, Card, CardContent, Link, Stack, Typography} from '@mui/material';

import {
  ProductLineFields,
  ProductLineFormData,
} from 'types/lines/productLineData';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { useProductLineDetail } from './ProductLineDetailContext';
import { Skeleton } from '@mui/lab';
import ProductLineStateChip from "./components/ProductLineStateChip";
import {TypographyBase} from "../../components/misc/TypographyBase";
import ProductLinePreviewsDropdownButton from "./components/ProductLinePreviewsDropdownButton";
import {ProductLineStatesType} from "../../types/lines/productLineEnums";
import {Module} from "../../types/form/login/login-enum";
import {SafetyComponent} from "../../components/security";
import {OffererProductLineDetailPageSecObjects, SecurityComponents} from "../../types/security";
import ProductLineModifyButton from "./components/ProductLineModifyButton";
import ProductLineDeleteButton from "./components/ProductLineDeleteButton";
import { userStorage } from 'util/localStorage/userStorage';
import {DataWithLabel} from "../../components/misc/DataWithLabel";
import {SaveButton} from "../../components/buttons/Buttons";
import { useAction } from 'hooks/useAction';
import {useAppNavigation} from "../../hooks/navigation";
import {MarketRoute} from "../../routes/market/routeAppMarketData";

function ProductLineDetailHeader() {
  const { getPath } = useAppNavigation();
  const { loading, uniqueLineId } = useProductLineDetail();
  const { watch } = useFormContext<ProductLineFormData>();
  const lineName = watch(ProductLineFields.Line);
  const lineDescription = watch(ProductLineFields.LineLarge);
  const lineStateCode = watch(ProductLineFields.ProductLineStatusCode) || 0;
  const lineStateDesc = watch(ProductLineFields.ProductLineStatusDesc) || '';
  const lineDateLastModified = watch(ProductLineFields.DateLastModified) || '';
  
  const routeToPublishedLine = useMemo(() =>
      uniqueLineId ? getPath(MarketRoute.MarketDetailLine, { uniProductLineId: uniqueLineId }) : ""
  , [uniqueLineId]);
  
  return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: 'flex !important', flexDirection: 'column !important' }}
                  >
                    {loading ? (
                      <Skeleton />
                    ) : (
                      <TypographyBase variant={'h4'} fontWeight={500} tooltip maxLines={2}>
                        {lineName || '-'}
                      </TypographyBase>
                    )}
                      <TypographyBase variant={'subtitle1'} color='text.lighter' maxLines={2} tooltip>
                        {lineDescription}
                      </TypographyBase>
                  </Box>
                    <Stack direction='row' alignItems='center' spacing={6}>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='h5' fontWeight={500}>
                                Estado de la Línea:
                            </Typography>
                          <ProductLineStateChip code={lineStateCode}
                                                description={lineStateDesc}
                          />
                        </Stack>
                        <DataWithLabel label={'Última actualización'} data={dateFormatter.toShortDate(lineDateLastModified)} rowDirection />

                        {
                            (lineStateCode === ProductLineStatesType.Published) &&
                                <Button variant='outlined'
                                        color='primary' 
                                        size='small' 
                                        target="_blank"
                                        component={Link}
                                        href={routeToPublishedLine}
                                >
                                    Ver línea publicada
                                </Button>
                        }
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
  );
}

const fieldsBySection: Record<string, string> = {
    [ProductLineFields.Line]: 'Descripción comercial',
    [ProductLineFields.LineLarge]: 'Descripción comercial',
    [ProductLineFields.ProductCode]: 'Clasificación',
};

export const ProductLineEditActionButtons = () => {
    const {onRequestPublication, messageId, lineId, offerer, onSaveProductLine, allowEdit} = useProductLineDetail();
    const { snackbarWarning } = useAction();
    const { handleSubmit, watch } = useFormContext<ProductLineFormData>();
    const userType = userStorage.getUserType();
    const offererId = watch(ProductLineFields.OffererId);
    const lineStateCode = watch(ProductLineFields.ProductLineStatusCode) || 0;
    
    const editionState : boolean = (lineStateCode === ProductLineStatesType.Created || lineStateCode === ProductLineStatesType.PublishedInModification);
    const showDeleteButton: boolean =
        (editionState && offerer) ||
        lineStateCode === ProductLineStatesType.Published;

    const showModifyButton: boolean =
        !!messageId && offerer && lineStateCode === ProductLineStatesType.Published;

    const onInvalidForm = (errors: FieldErrors) => {
        const fieldsWithError = Object.keys(errors);
        const sectionsWithError = new Set(
            fieldsWithError.map(x => fieldsBySection[x]).filter(Boolean)
        );
        
        if (sectionsWithError.size > 0) {
            if (sectionsWithError.size === 1)
                snackbarWarning(`Verificá haber completado los campos obligatorios dentro de la sección "${sectionsWithError.values().next().value}"`);
            else {
                const stringSections = Array.from(sectionsWithError).map(x => `"${x}"`).join(', ');
                snackbarWarning(`Verificá haber completado los campos obligatorios dentro de las secciones: ${stringSections}`);
            }
        }
    }
    
    return (
        <Stack spacing={1} direction='row' alignItems='center' justifyContent='end'>
            {
                allowEdit &&
                <SaveButton
                    size={'small'}
                    onClick={handleSubmit(onSaveProductLine, onInvalidForm)}
                >
                    Guardar
                </SaveButton>
            }
            <ProductLinePreviewsDropdownButton lineId={lineId} />
            {editionState &&
                userType == Module.Offerer &&
                offerer && (
                    <SafetyComponent
                        componentName={SecurityComponents.OffererProductLineDetailPage}
                        objectName={
                            OffererProductLineDetailPageSecObjects.ProductLineOffererRequestPublicationButton
                        }
                    >
                        <Button
                            variant={'outlined'}
                            color={'secondary'}
                            size={'small'}
                            onClick={handleSubmit(onRequestPublication)}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Solicitar Publicación
                        </Button>
                    </SafetyComponent>
                )}

            {showModifyButton && (
                <SafetyComponent
                    componentName={SecurityComponents.OffererProductLineDetailPage}
                    objectName={
                        OffererProductLineDetailPageSecObjects.ProductLineOffererRequestModificationButton
                    }
                >
                    <ProductLineModifyButton lineId={lineId}
                                             messageId={messageId}
                    />
                </SafetyComponent>
            )}

            {showDeleteButton && (
                <SafetyComponent
                    componentName={SecurityComponents.OffererProductLineDetailPage}
                    objectName={
                        OffererProductLineDetailPageSecObjects.ProductLineOffererCancelPublicationButton
                    }
                >
                    <ProductLineDeleteButton lineId={lineId}
                                             offererId={offererId}
                    />
                </SafetyComponent>
            )}
        </Stack>
    )
}

export default ProductLineDetailHeader;
