import DrawerBase from "../../../../components/misc/DrawerBase";
import {SearchButton} from "../../../../components/buttons/Buttons";
import {Grid} from "@mui/material";
import {DataWithLabel} from "../../../../components/misc/DataWithLabel";
import {PersonRelationship, PersonRelationshipFields} from "../../../../types/person/personData";
import {PersonTypes} from "../../../../types/person/personEnums";
import {stringFormatter} from "../../../../util/formatters/stringFormatter";
import {useEffect, useMemo, useState} from "react";
import {
    AfipActivityFields, BouncedChequesFields, CurrentDebtFields, DebtHistoryDetailFields,
    MetricsFields,
    NosisDetailQuery,
    NosisDetailQueryFields
} from "../../../../types/nosis/nosisData";
import {HttpPublicBases} from "../../../../http";
import {Skeleton} from "@mui/lab";


interface RelatedPersonDetailMapDrawerProps {
    open: boolean;
    onClose: () => void;
    person: PersonRelationship
}


const RelatedPersonDetailMapDrawer = ({ open, onClose, person }: RelatedPersonDetailMapDrawerProps) => {
    const [nosisQuery, setNosisQuery] = useState<NosisDetailQuery>()

    useEffect(() => {
        if (person[PersonRelationshipFields.PublicBasesQueryId] && open)
            HttpPublicBases.getDetail(person[PersonRelationshipFields.PublicBasesQueryId] ?? 0).then(setNosisQuery)
    }, [open, person]);
    
    const handleNavigate = () => window.open(`/offerer/clientPortfolio/${person[PersonRelationshipFields.OriginEntityId]}`)

    const currentSituation = useMemo(() => {
        if (!nosisQuery) return undefined;

        const currentDebt = nosisQuery?.[NosisDetailQueryFields.CurrentDebt];

        if (!currentDebt) return undefined;
        else if (currentDebt[CurrentDebtFields.SitSixQuantity] > 0) return 6;
        else if (currentDebt[CurrentDebtFields.SitFiveQuantity] > 0) return 5;
        else if (currentDebt[CurrentDebtFields.SitFourQuantity] > 0) return 4;
        else if (currentDebt[CurrentDebtFields.SitThreeQuantity] > 0) return 3;
        else if (currentDebt[CurrentDebtFields.SitTwoQuantity] > 0) return 2;
        else if (currentDebt[CurrentDebtFields.SitOneQuantity] > 0) return 1;
        return 0;
    }, [nosisQuery]);

    const maxSituation = useMemo(() => {
        if (!nosisQuery) return undefined;

        const debtList = nosisQuery?.[NosisDetailQueryFields.CurrentDebtDetailList];

        if (!debtList || !debtList.length) return '-';

        return debtList?.reduce(
            (max, current) => {
                return current?.[DebtHistoryDetailFields.SituationCode] > max
                    ? current?.[DebtHistoryDetailFields.SituationCode]
                    : max;
            },
            0,
        );
    }, [nosisQuery]);
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={`Datos de ${person[PersonRelationshipFields.LegalName]}`}
                    action={!!person[PersonRelationshipFields.OriginEntityId] ? <SearchButton onClick={handleNavigate}>Navegar al detalle</SearchButton> : <></>}
        >
            <Grid container spacing={2}>
                <Grid item md={7} xs={12}>
                    <DataWithLabel label={'CUIT'}
                                   data={stringFormatter.formatCuit(person[PersonRelationshipFields.CUIT])}
                    />
                </Grid>
                <Grid item md={5} xs={12}>
                    <DataWithLabel label={'Tipo de persona'}
                                   data={person[PersonRelationshipFields.PersonTypeCode] === PersonTypes.Legal ? 'Jurídica' : 'Humana'}
                    />
                </Grid>
                {
                    person[PersonRelationshipFields.PublicBasesQueryId] &&
                    <Grid item xs={12} md={12}>
                        <DataWithLabel label={'Actividad principal'}
                                       data={nosisQuery ? nosisQuery?.[NosisDetailQueryFields.AfipActivityList]?.find(
                                           activity => activity?.[AfipActivityFields.MainActivity])?.[AfipActivityFields.ActivityDesc] ?? '-'
                                           :
                                           person[PersonRelationshipFields.PublicBasesQueryId] ? <Skeleton /> : '-'
                        }
                        />
                    </Grid>
                }
                {
                    person[PersonRelationshipFields.PublicBasesQueryId] &&
                    <Grid item xs={12} md={6}>
                        <DataWithLabel label={'Máxima Situación BCRA'}
                                           data={currentSituation || '-'}
                        />
                    </Grid>
                }
                {
                    person[PersonRelationshipFields.PublicBasesQueryId] &&
                    <Grid item xs={12} md={6}>
                        <DataWithLabel label={'Máx. informada (últ. 24M)'}
                                       data={maxSituation ? maxSituation : <Skeleton />}
                        />
                    </Grid>
                }
                {
                    person[PersonRelationshipFields.PublicBasesQueryId] &&
                    <Grid item xs={12} md={5}>
                        <DataWithLabel label={'Score Nosis'}
                                       data={nosisQuery ? nosisQuery?.[NosisDetailQueryFields.Metrics][MetricsFields.Scoring] ?? '-'
                                           :
                                           person[PersonRelationshipFields.PublicBasesQueryId] ? <Skeleton /> : '-'
                                       }
                        />
                    </Grid>
                }
                {
                    person[PersonRelationshipFields.PublicBasesQueryId] &&
                    <Grid item xs={12}>
                        <DataWithLabel label={'¿Tiene Cheques rechazados?'}
                                       data={nosisQuery ? 
                                           (nosisQuery?.[NosisDetailQueryFields.BouncedCheques]?.[BouncedChequesFields.OthersQuantity] === 0 && nosisQuery?.[NosisDetailQueryFields.BouncedCheques]?.[BouncedChequesFields.NoFundsPenaltyQuantity] === 0
                                           && nosisQuery?.[NosisDetailQueryFields.BouncedCheques]?.[BouncedChequesFields.NoFundsQuantity] === 0) ? 'No' : 'Sí' 
                                               ?? '-'
                                           :
                                           person[PersonRelationshipFields.PublicBasesQueryId] ? <Skeleton /> : '-'
                                       }
                        />
                    </Grid>
                }
            </Grid>
        </DrawerBase>
    )
}


export default RelatedPersonDetailMapDrawer