import useAxios from "../../../../hooks/useAxios";
import {useAction} from "../../../../hooks/useAction";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {SolicitationAllowAccess, SolicitationAllowAccessFields} from "../../../../types/solicitations/solicitationData";
import {EntityWithIdAndDescriptionFields} from "../../../../types/baseEntities";
import {HttpSolicitation} from "../../../../http";
import {Dialog, DialogActions, DialogContent, Stack, Typography} from "@mui/material";
import BaseDialogTitle from "../../../../components/dialog/BaseDialogTitle";
import {grey} from "@mui/material/colors";
import {ShareButton} from "../../../../components/buttons/Buttons";
import {ControlledAutocomplete} from "../../../../components/forms/ControlledAutocomplete";
import {HttpFinancialEntity} from "../../../../http/financialEntity/httpFinancialEntity";


interface OffererShareSolicitationBySelectedDialogProps {
    open: boolean;
    onClose: () => void;
    solicitationId: number;
    financialEntityId: number;
    onReload: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OffererShareSolicitationBySelectedDialog = ({open, onClose, solicitationId, financialEntityId, onReload} : OffererShareSolicitationBySelectedDialogProps) => {
    const { fetchData } = useAxios();
    const { snackbarSuccess, snackbarWarning, snackbarError, showLoader, hideLoader } = useAction();
    const [mails, setMails] = useState<SolicitationAllowAccess[]>([]);
    const methods = useForm<SolicitationAllowAccess[]>();

    const onShare = (data: any) => {
        showLoader();

        const transformedData : SolicitationAllowAccess[] = []

        // @ts-ignore
        data[SolicitationAllowAccessFields.InvitedAccessMail].forEach(mail => {
            // @ts-ignore
            if (!!mail) {
                // @ts-ignore
                let mailTransformed = mail
                if (!!mail[EntityWithIdAndDescriptionFields.Description]) {
                    mailTransformed = {
                        [SolicitationAllowAccessFields.InvitedAccessMail]: mail[EntityWithIdAndDescriptionFields.Description],
                        [SolicitationAllowAccessFields.InvitedAccessUserId]: null,
                        [SolicitationAllowAccessFields.FinancialEntityId]: financialEntityId
                    }
                }

                
                transformedData.push(mailTransformed);
            }
        });
        
        if (!transformedData.length) {
            snackbarWarning("Debe seleccionar algún mail para compartir la solicitud");
            hideLoader();
            return;
        }

        const validEmails = transformedData.every(inv => emailRegex.test(inv[SolicitationAllowAccessFields.InvitedAccessMail]))

        if (validEmails) {
            fetchData(
                () => HttpSolicitation.shareSolicitation(solicitationId, transformedData),
                true
            )
                .then(() => {
                    snackbarSuccess('Compartiste esta solicitud con éxito');
                    onClose();
                    onReload()
                });
        } else {
            hideLoader()
            snackbarError("Uno de los mails que agregaste no cumple con el formato apropiado")
        }
    };

    useEffect(() => {
        if (open)
            HttpFinancialEntity.getMailInvitations(financialEntityId).then(response => {
                const shareMails = response.map(mail => {
                    return {
                        [SolicitationAllowAccessFields.InvitedAccessMail]: mail,
                        [SolicitationAllowAccessFields.InvitedAccessUserId]: 0,
                        [SolicitationAllowAccessFields.FinancialEntityId]: financialEntityId
                    }
                });
                setMails(shareMails);
            });
        else methods.reset();
    }, [open]);

    const onAddOption = (value: string, prevValues: any[]) => { }

    const loadMails = async () => mails

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth>
            <BaseDialogTitle onClose={onClose} title={`Compartir solicitud`} />
            <DialogContent>
                <Stack spacing={3}>
                    <Typography fontSize={14} color={grey[600]} textAlign={"center"}>
                        Seleccioná el mail con el que querés compartir esta solicitud. Si no está en la lista, agrégalo.
                    </Typography>
                    <Stack spacing={1}>
                        <ControlledAutocomplete
                            label={'Seleccioná o ingresá los correos'}
                            control={methods.control}
                            optionField={SolicitationAllowAccessFields.InvitedAccessMail}
                            name={SolicitationAllowAccessFields.InvitedAccessMail}
                            loadOptions={loadMails}
                            onAddOption={onAddOption}
                            multiple
                        />
                    </Stack>
                    </Stack>
            </DialogContent>
            <DialogActions>
                <ShareButton
                    onClick={methods.handleSubmit(onShare)}
                    size={"small"}
                >
                    Compartir
                </ShareButton>
            </DialogActions>
        </Dialog>
    );
}


export default OffererShareSolicitationBySelectedDialog