import React, {useMemo} from "react";
import {Card, CardContent, CardHeader} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {
    SolicitationOffererResultViewFields
} from "types/solicitations/solicitationData";
import {TextFieldBase} from "components/forms/TextFieldBase";
import {TypographyBase} from "components/misc/TypographyBase";
import {dateFormatter} from "util/formatters/dateFormatter";
import {stringFormatter} from "util/formatters/stringFormatter";

function OffererSolicitationResult() {
    const {solicitation, loadingSolicitation, offererResult} = useSolicitation();

    const resultColor = useMemo(() => {
        if (!offererResult) return '';

        return offererResult[SolicitationOffererResultViewFields.IsPositiveResult] ? '#26825A' : '#720800';
    }, [offererResult]);

    const actionText = useMemo(() => {
        if (!offererResult) return null;

        let label: string = '';

        if (!!offererResult[SolicitationOffererResultViewFields.UserAnalysisName])
            label = `Decisión tomada por ${stringFormatter.toTitleCase(offererResult[SolicitationOffererResultViewFields.UserAnalysisName])}`

        if (!!offererResult[SolicitationOffererResultViewFields.ResultDate]) {
            if (!!label)
                label += ` el ${dateFormatter.toShortDate(offererResult[SolicitationOffererResultViewFields.ResultDate])}`
            else
                label = `Decisión tomada el ${dateFormatter.toShortDate(offererResult[SolicitationOffererResultViewFields.ResultDate])}`
        }

        if (!!offererResult[SolicitationOffererResultViewFields.UserApprovalName] &&
            offererResult[SolicitationOffererResultViewFields.UserApprovalId] !== offererResult[SolicitationOffererResultViewFields.UserAnalysisId]
        )
            label += ` y aprobada por ${stringFormatter.toTitleCase(offererResult[SolicitationOffererResultViewFields.UserApprovalName])}`

        return label;
    }, [offererResult]);

    if (!solicitation || loadingSolicitation || !offererResult)
        return null;

    return (
        <Card sx={{border: `1px solid ${resultColor}`}}>
            <CardHeader title={offererResult[SolicitationOffererResultViewFields.ResultMessage]}
                        sx={{color: resultColor}}
                        action={(
                            <TypographyBase variant={'body2'} color={'text.lighter'}>
                                {actionText}
                            </TypographyBase>
                        )}
            />

            {
                !!offererResult[SolicitationOffererResultViewFields.MessageCompany] &&
                <CardContent>
                    <TextFieldBase
                        label={offererResult[SolicitationOffererResultViewFields.IsPositiveResult] ? 'Propuesta para la PyME' : 'Mensaje para la PyME'}
                        value={offererResult[SolicitationOffererResultViewFields.MessageCompany]}
                        disabled
                    />
                </CardContent>
            }
        </Card>
    )
}

export default OffererSolicitationResult;