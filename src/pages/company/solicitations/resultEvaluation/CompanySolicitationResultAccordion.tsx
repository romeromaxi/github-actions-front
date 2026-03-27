import {
    SolicitationAnalysisResultViewDTO,
    SolicitationAnalysisViewDTOFields
} from "../../../../types/solicitations/solicitationAnalysisData";
import {ElementType, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Chip, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../../components/icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";


interface CompanySolicitationResultAccordionProps {
    result: SolicitationAnalysisResultViewDTO,
    title: string,
    icon: ElementType
}


const CompanySolicitationResultAccordion = ({result, title, icon} : CompanySolicitationResultAccordionProps) => {
    const [expanded, setExpanded] = useState<boolean>(false)

    return (
        <Stack sx={{padding: '12px', borderRadius: '32px', backgroundColor: 'white'}}>
            <Accordion sx={{ backgroundColor: 'white !important' }} expanded={expanded}>
                <AccordionSummary>
                    <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}} alignItems={'center'} onClick={() => setExpanded(!expanded)}>
                        <Stack direction='row' spacing={2} alignItems={'center'}>
                            <BaseIconWrapper Icon={icon} size={'md'} bg={'#F7FAFC'} />
                            <Typography variant={'h4'} fontWeight={500}>{title}</Typography>
                        </Stack>
                        <Stack spacing={2} alignItems={'center'} direction={'row'}>
                            <Chip label={result[SolicitationAnalysisViewDTOFields.IsSuitable] ? 'Apto' : 'No apto'}
                                  color={result[SolicitationAnalysisViewDTOFields.IsSuitable] ? 'success' : 'error'}
                            />
                            <Box onClick={() => setExpanded(!expanded)}>
                                <BaseIconWrapper Icon={expanded ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
                            </Box>
                        </Stack>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <div
                        dangerouslySetInnerHTML={{
                            __html:
                                result[SolicitationAnalysisViewDTOFields.AptitudeMessage] ??
                                '',
                        }}
                    />
                </AccordionDetails>
            </Accordion>
        </Stack>
    )
}


export default CompanySolicitationResultAccordion