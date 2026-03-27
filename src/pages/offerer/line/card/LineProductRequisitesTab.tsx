import React from 'react';

import {Alert, Box, Card, CardContent, CardHeader, Grid} from '@mui/material';
import {ProductLineRequisiteFields, ProductLineRequisiteView,} from 'types/lines/productLineData';
import {
    LineProductRequisiteActivitySector,
    LineProductRequisiteAmount,
    LineProductRequisiteClassificationSepyme,
    LineProductRequisiteDebtSituationMaximum,
    LineProductRequisiteGender,
    LineProductRequisiteProvinces,
    LineProductRequisiteScoringMinimum,
    LineProductRequisiteSeniority,
    LineProductRequisiteSocialOrEnvironmentalImpact,
    LineProductRequisiteTaxCondition,
} from './LineProductRequisiteForm';
import {ProductLineRequisiteType} from 'types/lines/productLineEnums';
import {useProductLineDetail} from "../../../lines/ProductLineDetailContext";

const sortRequisites = (a: ProductLineRequisiteView, b: ProductLineRequisiteView): number =>
    a[ProductLineRequisiteFields.Order] < b[ProductLineRequisiteFields.Order] ? -1 : 1;

function LineProductRequisitesTab() {
    const {requisites} = useProductLineDetail()

    return (
        <Card>
            <CardHeader title='PyMEs destinatarias'/>
            <CardContent>
                <Box>
                    {requisites ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Alert color='info' severity='info'>
                                    Seleccionar las opciones adecuadas para la línea, para que la PyME pueda
                                    eficientizar su búsqueda de financiamiento
                                </Alert>
                            </Grid>
                            {requisites.sort(sortRequisites).map((requisite, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    container
                                    spacing={1}
                                    key={`formRequisite_${index}`}
                                    alignItems={'flex-end'}
                                >
                                    {(() => {
                                        switch (
                                            requisite[
                                                ProductLineRequisiteFields.ProductLineRequisiteTypeCode
                                                ]
                                            ) {
                                            case ProductLineRequisiteType.Province:
                                                return (
                                                    <LineProductRequisiteProvinces requisite={requisite}
                                                                                   allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.Amount:
                                                return (
                                                    <LineProductRequisiteAmount requisite={requisite}
                                                                                allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.ClassificationSepyme:
                                                return (
                                                    <LineProductRequisiteClassificationSepyme
                                                        requisite={requisite}
                                                        allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.ActivitySector:
                                                return (
                                                    <LineProductRequisiteActivitySector
                                                        requisite={requisite}
                                                        allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.Seniority:
                                                return (
                                                    <LineProductRequisiteSeniority requisite={requisite}
                                                                                   allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.Gender:
                                                return (
                                                    <LineProductRequisiteGender requisite={requisite}
                                                                                allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.TaxCondition:
                                                return (
                                                    <LineProductRequisiteTaxCondition requisite={requisite}
                                                                                      allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.SocialOrEnvironmentalImpact:
                                                return (
                                                    <LineProductRequisiteSocialOrEnvironmentalImpact requisite={requisite}
                                                                                                     allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.Scoring:
                                                return (
                                                    <LineProductRequisiteScoringMinimum requisite={requisite}
                                                                                        allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                );

                                            case ProductLineRequisiteType.DebtSituation:
                                                return (
                                                    <LineProductRequisiteDebtSituationMaximum requisite={requisite}
                                                                                              allowsRestrictivePolicy={requisite[ProductLineRequisiteFields.AllowsRestrictivePolicy]}
                                                    />
                                                )
                                        }
                                    })()}
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <div>Cargando...</div>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default LineProductRequisitesTab;
