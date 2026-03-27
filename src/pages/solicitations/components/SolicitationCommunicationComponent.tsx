import {
    SolicitationCommunicationFields,
    SolicitationCommunicationView
} from "types/solicitations/solicitationCommunicationData";
import {Accordion, AccordionDetails, AccordionSummary, Box, Chip, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import {useState} from "react";
import SolicitationTrackingTableCompany from "../tracking/SolicitationTrackingTableCompany";

interface SolicitationCommunicationComponentProps {
    solicitationId: number,
    communication: SolicitationCommunicationView;
}

function SolicitationCommunicationComponent({ solicitationId, communication}: SolicitationCommunicationComponentProps) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const showTrackingTable = !!communication[SolicitationCommunicationFields.ShowTrackingTable];
    const showAptitudeStatus = !!communication[SolicitationCommunicationFields.ShowAptitudeStatus];
   
    return (
        <Stack sx={{padding: '12px', borderRadius: '32px', backgroundColor: 'white'}}>
            <Accordion sx={{ backgroundColor: 'white !important' }} expanded={expanded}>
                <AccordionSummary>
                    <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}} alignItems={'center'} onClick={() => setExpanded(!expanded)}>
                        <Stack direction='row' spacing={2} alignItems={'center'}>
                            <BaseIconWrapper Icon={communication[SolicitationCommunicationFields.CssIcon]} size={'md'} bg={'#F7FAFC'} />
                            <Typography variant={'h4'} fontWeight={500}>{communication[SolicitationCommunicationFields.Title]}</Typography>
                        </Stack>
                        <Stack spacing={2} alignItems={'center'} direction={'row'}>
                            {
                                showAptitudeStatus &&
                                    <Chip label={communication[SolicitationCommunicationFields.IsSuitable] ? 'Apto' : 'No apto'}
                                          color={communication[SolicitationCommunicationFields.IsSuitable] ? 'success' : 'error'}
                                    />
                            }
                            <Box onClick={() => setExpanded(!expanded)}>
                                <BaseIconWrapper Icon={expanded ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
                            </Box>
                        </Stack>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        showTrackingTable ?
                            <SolicitationTrackingTableCompany solicitationId={solicitationId} />
                            :
                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        communication[SolicitationCommunicationFields.AptitudeMessage] ??
                                        '',
                                }}
                            />
                    }
                </AccordionDetails>
            </Accordion>
        </Stack>
    )
}

export default SolicitationCommunicationComponent;