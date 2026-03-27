import React from "react";
import {CaretDown, Folders, PresentationChart} from "@phosphor-icons/react";
import {Accordion, AccordionDetails, AccordionSummary, Card, Stack} from "@mui/material";
import {
    SolicitationSharedViewDTO,
    SolicitationSharedViewDTOFields
} from "types/solicitations/solicitationData";
import SharedSolicitationCompanyInfo from "../components/SharedSolicitationCompanyInfo";
import SolicitationSurveyDetailView from "../../solicitations/survey/SolicitationSurveyDetailView";
import {BaseIconWrapper} from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";


interface SharedSolicitationGuidCompanyFileProps {
    solicitation: SolicitationSharedViewDTO
}


const SharedSolicitationGuidCompanyFile = ({solicitation} : SharedSolicitationGuidCompanyFileProps) => {
    
    return (
        <Stack spacing={2}>
            <Card>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<BaseIconWrapper Icon={CaretDown} size={'md'} bg={'#F7FAFC'} />}>
                        <Stack direction='row' spacing={2} alignItems={'center'}>
                            <BaseIconWrapper Icon={Folders} size={'md'} bg={'#F7FAFC'} />
                            
                            <TypographyBase variant={'h4'} fontWeight={500}>
                                Solicitud
                            </TypographyBase>
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails>
                        <SolicitationSurveyDetailView answers={solicitation[SolicitationSharedViewDTOFields.SurveyQuestionAnswer]} />
                    </AccordionDetails>
                </Accordion>
            </Card>
            
            <SharedSolicitationCompanyInfo companyFile={solicitation[SolicitationSharedViewDTOFields.CompanyFile]} />
        </Stack>
    )
}


export default SharedSolicitationGuidCompanyFile