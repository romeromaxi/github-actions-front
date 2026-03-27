import {Chip, Dialog, DialogContent, Stack} from "@mui/material";
import BaseDialogTitle from "../../../components/dialog/BaseDialogTitle";
import React from "react";
import {TypographyBase} from "../../../components/misc/TypographyBase";


interface InternalCompaniesDialogProps {
    open: boolean,
    onClose: () => void,
    companies: string[],
    businessName: string
}



const InternalCompaniesDialog = ({open, onClose, companies, businessName} : InternalCompaniesDialogProps) => {
    
    return (
        <Dialog open={open}
                onClose={onClose}
                fullWidth
                maxWidth={'sm'}
        >
            <BaseDialogTitle onClose={onClose} title={`Empresas relacionadas a ${businessName}`}/>
            <DialogContent>
                <Stack spacing={2}>
                    {companies.map((company, idx) => (
                        <Chip variant={'outlined'} label={
                            <TypographyBase tooltip maxLines={1} fontWeight={600}>
                                {company}
                            </TypographyBase>
                        } key={`companyRelated_${idx}_ByUser`} size={'small'} />
                    ))}
                </Stack>
            </DialogContent>
        </Dialog>
    )
}


export default InternalCompaniesDialog