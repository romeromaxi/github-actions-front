import React from "react";
import { Skeleton } from '@mui/lab';
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {Calendar1Icon, HashIcon, MousePointerClickIcon} from "lucide-react";
import {themeColorDefinition} from "util/themes/definitions";
import {TypographyBase} from "components/misc/TypographyBase";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {EntityWithIdFields} from "types/baseEntities";
import {dateFormatter} from "util/formatters/dateFormatter";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";

function OffererSolicitationInfoSummaryCard() {
    const { solicitation, loadingSolicitation } = useSolicitation();
    
    return (
        <Card>
            <CardHeader title={'Información de la solicitud'} />

            <CardContent>
                <Stack direction={'column'} spacing={3}>
                    <OffererSolicitationInfoSummaryRow label={'ID'}
                                                       value={`${solicitation?.[EntityWithIdFields.Id]}`}
                                                       Icon={HashIcon}
                                                       loading={!solicitation || loadingSolicitation}
                    />

                    <OffererSolicitationInfoSummaryRow label={'Fecha de Inicio'}
                                                       value={dateFormatter.toShortDate(solicitation?.[SolicitationViewDTOFields.OffererIncomeDate])}
                                                       Icon={Calendar1Icon}
                                                       loading={!solicitation || loadingSolicitation}
                    />

                    <OffererSolicitationInfoSummaryRow label={'Último contacto'}
                                                       value={dateFormatter.formatTimeAgo(solicitation?.[SolicitationViewDTOFields.OffererLastModified])}
                                                       Icon={MousePointerClickIcon}
                                                       loading={!solicitation || loadingSolicitation}
                    />
                </Stack>
            </CardContent>
        </Card>
    )
}

interface OffererSolicitationInfoSummaryRowProps {
    label: string,
    value?: string,
    Icon: React.ElementType,
    loading: boolean
}

function OffererSolicitationInfoSummaryRow({ label, value, Icon, loading }: OffererSolicitationInfoSummaryRowProps) {
    return (
        <Stack direction={'row'}
               spacing={1.5}
               alignItems={'center'}
        >
            <WrapperIcons Icon={Icon} size={'md'} color={themeColorDefinition.UIElements.texts.lighter} />

            <Stack spacing={0.25} width={1}>
                <TypographyBase variant={'body2'} color={'text.lighter'}>
                    {label}
                </TypographyBase>

                {
                    loading ?
                        <Skeleton variant={'text'} width={'50%'} />
                        :
                        <TypographyBase variant={'body2'} fontWeight={600} color={'text.lighter'}>
                            {value || '-'}
                        </TypographyBase>
                }
            </Stack>
        </Stack>
    )
}

export default OffererSolicitationInfoSummaryCard;