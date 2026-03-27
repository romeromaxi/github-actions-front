import {Box, Stack, useMediaQuery, useTheme} from "@mui/material";
import SolicitationRequestedDocumentation, {
    SolicitationRequestedDocumentationVariant
} from "pages/solicitations/components/SolicitationRequestedDocumentation";
import {TypographyBase} from "components/misc/TypographyBase";
import {useCompanySolicitation} from "../CompanySolicitationContext";
import {EntityWithIdFields} from "types/baseEntities";
import {SolicitationFlagsFields, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {useMemo} from "react";
import CompanySolicitationActivity from "../CompanySolicitationActivity";
import {SolicitationTypes} from "types/solicitations/solicitationEnums";

function CompanySolicitationCommunicationPanel() {
    const { solicitationId, solicitation, flags } = useCompanySolicitation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const titlePanel = useMemo(() => {
        if (!solicitation) return ''

        if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.Matcher) 
            return `Conversación con ${solicitation[SolicitationViewDTOFields.OffererBusinessName]}`
        
        return `Conversación con la entidad`
    }, [solicitation]);

    const canChatViewAllowed = useMemo(() => (
        (!!flags && flags[SolicitationFlagsFields.SolicitationChatViewAllowed])
    ), [flags]);
    
    return (
        <Stack spacing={4.5}>
            <TypographyBase variant={'h3'}>
                {titlePanel}
            </TypographyBase>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, position: 'relative' }}>
                <Box width={(!canChatViewAllowed || isMobile) ? 1 : 0.4} pr={(!canChatViewAllowed || isMobile) ? 0 : 2}>
                    <SolicitationRequestedDocumentation solicitationId={solicitation?.[EntityWithIdFields.Id]}
                                                        solicitation={solicitation}
                                                        variant={SolicitationRequestedDocumentationVariant.SendAndUpload}
                                                        companyId={solicitation?.[SolicitationViewDTOFields.CompanyId]}
                                                        includesCompanyFiles
                                                        minHeight={'415px'}
                                                        maxHeight={'630px'}
                    />
                </Box>

                {
                    canChatViewAllowed &&
                    <Box width={isMobile ? 1 : 0.6} sx={isMobile ? { mt: 2 } : { position: 'absolute', right: 0, top: 0, bottom: 0 }}>
                        <CompanySolicitationActivity solicitationId={solicitationId || 0} 
                                                     minHeight={'415px'}
                                                     maxHeight={'630px'}
                        />
                    </Box>
                }
            </Box>
        </Stack>
    )
}

export default CompanySolicitationCommunicationPanel;