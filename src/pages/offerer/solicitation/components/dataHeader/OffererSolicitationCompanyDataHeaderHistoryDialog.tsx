import React, {useEffect, useState} from "react";
import {Box, Dialog, Skeleton, Stack,} from "@mui/material";
import {SolicitationCompanyDataHeaderContainer, SolicitationViewDTO} from "types/solicitations/solicitationData";
import OffererSolicitationCompanyDataHeaderComponent from "./OffererSolicitationCompanyDataHeaderComponent";
import {EntityWithIdFields} from "types/baseEntities";
import {HttpSolicitation} from "http/index";
import {TypographyBase} from "components/misc/TypographyBase";
import { dateFormatter } from "util/formatters/dateFormatter";
import {SolicitationCompanyDataHeaderContainerFields} from "types/solicitations/solicitationData";
import {themeColorDefinition} from "util/themes/definitions";

interface OffererSolicitationCompanyDataHeaderComponentProps {
    open: boolean,
    solicitation?: SolicitationViewDTO,
    currentHeaderContainer?: SolicitationCompanyDataHeaderContainer,
    onClose: () => void
}

function OffererSolicitationCompanyDataHeaderHistoryDialog({ open, solicitation, currentHeaderContainer, onClose }: OffererSolicitationCompanyDataHeaderComponentProps) {
    const [headerContainer, setHeaderContainer] = useState<SolicitationCompanyDataHeaderContainer>();
    
    useEffect(() => {
        if (!!solicitation && !!solicitation[EntityWithIdFields.Id]) {
            HttpSolicitation.getCompanyDataHeader(solicitation[EntityWithIdFields.Id])
                .then(setHeaderContainer)
        }
    }, [solicitation]);
    
    if (!solicitation)
        return null;
    
    return (
        <Dialog open={open}
                maxWidth={'md'}
                onClose={onClose}
                fullWidth
        >
            <Stack spacing={4.5}>
                <OffererSolicitationCompanyDataHeaderHistory title={'Situación de la PyME al momento de enviar la solicitud'}
                                                             solicitation={solicitation}
                                                             headerContainer={headerContainer}
                />
                
                <OffererSolicitationCompanyDataHeaderHistory title={'Situación actual de la PyME'}
                                                             solicitation={solicitation}
                                                             headerContainer={currentHeaderContainer}
                />
            </Stack>
        </Dialog>
    )
}

interface OffererSolicitationCompanyDataHeaderHistoryProps {
    title: string,
    solicitation: SolicitationViewDTO,
    headerContainer?: SolicitationCompanyDataHeaderContainer,
}

function OffererSolicitationCompanyDataHeaderHistory({title, solicitation, headerContainer}: OffererSolicitationCompanyDataHeaderHistoryProps) {
    return (
        <Stack spacing={2}>
            <Stack spacing={0.5}>
                <TypographyBase variant={'h5'}>
                    {title}
                </TypographyBase>

                {
                    !!headerContainer ?
                        <TypographyBase variant={'body3'} color={'text.lighter'}>
                            {dateFormatter.toShortDate(headerContainer[SolicitationCompanyDataHeaderContainerFields.InformationDate])}
                        </TypographyBase>
                        :
                        <Skeleton width={'10%'} />
                }
            </Stack>

            <Box p={3}
                 borderRadius={4}
                 border={`1px solid ${themeColorDefinition.UIElements.borders.primary}`}
            >
                <OffererSolicitationCompanyDataHeaderComponent solicitation={solicitation}
                                                               headerContainer={headerContainer}
                />
            </Box>
        </Stack>
    )
}

export default OffererSolicitationCompanyDataHeaderHistoryDialog;