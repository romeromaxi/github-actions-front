import React, {useContext} from "react";
import {Stack, Tooltip} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {TypographyBase} from "components/misc/TypographyBase";
import SolicitationFollowUpStepsDots from "pages/solicitations/components/SolicitationFollowUpStepsDots";
import AvatarUserOfferer from "../../components/avatar/AvatarUserOfferer";
import OffererSolicitationLogo from "./OffererSolicitationLogo";
import {OffererContext} from "../../components/OffererContextProvider";
import {EntityWithIdFields} from "types/baseEntities";

function OffererSolicitationHeader() {
    const { solicitation, loadingSolicitation } = useSolicitation();
    const offerer = useContext(OffererContext);


    return (
        <Stack direction={{ xs: 'column', md: 'row' }}
               justifyContent={'space-between'}
               alignItems={'center'}
               spacing={2}
        >
            <Stack direction={'column'} spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <OffererSolicitationLogo solicitation={solicitation} 
                                             isLoading={loadingSolicitation}
                                             userOffererId={offerer[EntityWithIdFields.Id]}
                                             size={53}
                                             badgeSize={33}
                    />
                    
                    <Stack spacing={.75}>
                        <TypographyBase variant={'body1'}>
                            {solicitation?.[SolicitationViewDTOFields.LineDesc]}
                        </TypographyBase>

                        <TypographyBase variant={'h4'}>
                            {solicitation?.[SolicitationViewDTOFields.CompanyBusinessName]}
                        </TypographyBase>
                    </Stack>
                </Stack>
                
                <TypographyBase variant={'body2'} 
                                color={'text.lighter'}
                                display={'flex'}
                                alignItems={'center'}
                                gap={'6px'}
                >
                    {
                        (loadingSolicitation || !solicitation) ?
                            <React.Fragment />
                            :
                            (!solicitation[SolicitationViewDTOFields.StageResponsibleUserId] && !solicitation[SolicitationViewDTOFields.CommercialResponsibleUserId]) ?
                                    "Solicitud sin asignación"
                                :
                                (
                                    solicitation[SolicitationViewDTOFields.StageResponsibleUserId] === solicitation[SolicitationViewDTOFields.CommercialResponsibleUserId] ||
                                    !solicitation[SolicitationViewDTOFields.CommercialResponsibleUserId]
                                ) ?
                                        <React.Fragment>
                                            Asignado a

                                            <AvatarUserOfferer size={'sm'}
                                                               userName={solicitation[SolicitationViewDTOFields.StageResponsibleUserName]}
                                                               tooltip={'Responsable asignado'}
                                                               includeName
                                            />
                                        </React.Fragment>
                                    :
                                    (
                                        !solicitation[SolicitationViewDTOFields.StageResponsibleUserId]
                                    ) ?
                                        <React.Fragment>
                                            Asignado a

                                            <AvatarUserOfferer size={'sm'}
                                                               userName={solicitation[SolicitationViewDTOFields.CommercialResponsibleUserName]}
                                                               tooltip={'Responsable comercial'}
                                                               includeName
                                            />
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            Asignado a
                                            
                                            <AvatarUserOfferer size={'sm'}
                                                               userName={solicitation[SolicitationViewDTOFields.CommercialResponsibleUserName]}
                                                               tooltip={'Responsable comercial'}
                                                               includeName
                                            />
                                            
                                            y a
    
                                            <Tooltip title={'Analista'}>
                                                <AvatarUserOfferer size={'sm'}
                                                                   userName={solicitation[SolicitationViewDTOFields.StageResponsibleUserName]}
                                                                   tooltip={'Responsable asignado'}
                                                                   includeName
                                                />
                                            </Tooltip>
                                        </React.Fragment>
                    }
                </TypographyBase>
                
            </Stack>
            
            <SolicitationFollowUpStepsDots solicitationId={solicitation?.id} />
        </Stack>
    )
}

export default OffererSolicitationHeader;