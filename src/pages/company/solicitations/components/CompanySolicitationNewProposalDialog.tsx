import React from "react";
import {Dialog, DialogContent, Divider, Stack} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {
    SolicitationCommunicationFields,
    SolicitationCommunicationView
} from "types/solicitations/solicitationCommunicationData";
import {TypographyBase} from "components/misc/TypographyBase";
import {OffererLogoWithName} from "../../../offerer/components/OffererLogo";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {EntityWithIdFields} from "types/baseEntities";


interface CompanySolicitationNewProposalDialogProps {
    open: boolean;
    onClose: () => void;
    communication: SolicitationCommunicationView;
    solicitation: SolicitationViewDTO;
}


const CompanySolicitationNewProposalDialog = ({
    open, onClose, communication, solicitation
}: CompanySolicitationNewProposalDialogProps) => {
    return (
        <Dialog open={open}
                onClose={onClose}
                fullWidth
                maxWidth={'md'}
        >
            <BaseDialogTitle onClose={onClose}
                             title={(
                                 <TypographyBase variant={'eyebrow1'}>
                                     {`${communication[SolicitationCommunicationFields.Title].toUpperCase()}`}
                                 </TypographyBase>
                             )} 
            />
            
            <DialogContent>
                <Stack spacing={3.125}>
                    <Stack direction={{ xs: 'column-reverse', md: 'row' }} 
                           justifyContent={'space-between'}
                    >
                        <Stack spacing={1.375}>
                            <OffererLogoWithName offererUrlLogo={solicitation[SolicitationViewDTOFields.OffererUrlLogo]}
                                                 offererBusinessName={solicitation[SolicitationViewDTOFields.OffererBusinessName]}
                                                 size={'md'}
                                                 NameProps={{ variant: 'h5', fontWeight: 600 }}
                            />
                            
                            <TypographyBase variant={'h4'}>
                                {solicitation[SolicitationViewDTOFields.LineDesc]}
                            </TypographyBase>
                        </Stack>
                        
                        <TypographyBase variant={'body2'} fontWeight={600} color={'text.lighter'}>
                            {`Solicitud #${solicitation[EntityWithIdFields.Id]}`}
                        </TypographyBase>
                    </Stack>
                    
                    <Divider />

                    <TypographyBase variant={'body2'} color={'text.lighter'}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html:
                                    communication[SolicitationCommunicationFields.AptitudeMessage] ??
                                    '',
                            }}
                        />
                    </TypographyBase>
                    
                </Stack>
            </DialogContent>
                        
        </Dialog>
    )
}


export default CompanySolicitationNewProposalDialog