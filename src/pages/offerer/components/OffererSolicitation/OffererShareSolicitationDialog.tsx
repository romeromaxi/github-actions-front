import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Typography,
} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import { ShareButton } from "components/buttons/Buttons";
import { useAction } from "hooks/useAction";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import {HttpOfferer, HttpSolicitation} from "http/index";
import { OffererSummaryView } from "types/offerer/offererData";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import { Skeleton } from "@mui/lab";
import { useForm, FormProvider } from "react-hook-form";
import {SolicitationAllowAccess, SolicitationAllowAccessFields} from "types/solicitations/solicitationData";
import OffererShareSolicitationInvitation from "./OffererShareSolicitationInvitation";
import useAxios from "hooks/useAxios";
import {HttpSolicitationShareAccess} from "http/solicitations/httpSolicitationShareAccess";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
interface OffererShareSolicitationDialogProps {
    open: boolean;
    onClose: () => void;
    solicitationId: number;
    offererId: number;
    onReload?: () => void;
}

const OffererShareSolicitationDialog = ({
                                            open,
                                            onClose,
                                            solicitationId,
                                            offererId,
                                            onReload
                                        }: OffererShareSolicitationDialogProps) => {
    const { fetchData } = useAxios();
    const { snackbarSuccess, snackbarWarning, snackbarError, showLoader, hideLoader } = useAction();
    const [lstOfferers, setLstOfferers] = useState<OffererSummaryView[]>();
    const methods = useForm<{ [key: string]: SolicitationAllowAccess[] }>();

    const onShare = (data: any) => {
        showLoader();
        
        const transformedData : SolicitationAllowAccess[] = [];
        
        Object.entries(data[SolicitationAllowAccessFields.InvitedAccessMail]).forEach(([key, mails]) => {
            // @ts-ignore
            if (!!mails && mails.length) {
                // @ts-ignore
                const mailsTransformed = mails.map(x => {
                    if (!!x[SolicitationAllowAccessFields.InvitedAccessUserId]) return x;

                    return {
                        [SolicitationAllowAccessFields.InvitedAccessMail]: x[EntityWithIdAndDescriptionFields.Description],
                        [SolicitationAllowAccessFields.InvitedAccessUserId]: null,
                        [SolicitationAllowAccessFields.FinancialEntityId]: parseInt(key)
                    }
                })
                transformedData.push(...mailsTransformed);
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
                    onReload && onReload()
                });
        } else {
            hideLoader()
            snackbarError("Uno de los mails que agregaste no cumple con el formato apropiado")
        }
    };

    useEffect(() => {
        if (open) {
            HttpSolicitationShareAccess.getPotentialOfferers(solicitationId).then(setLstOfferers)
        } else {
            setLstOfferers(undefined);
            methods.reset();
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"md"} fullWidth>
            <BaseDialogTitle onClose={onClose} title={`Compartir solicitud`} />
            <DialogContent>
                <FormProvider {...methods}>
                    <Stack spacing={3}>
                        <Typography fontSize={14} color={grey[600]} textAlign={"center"}>
                            Seleccioná con quiénes querés compartir esta solicitud
                        </Typography>
                        <Stack spacing={1}>
                            {lstOfferers ? (
                                lstOfferers.length !== 0 ? (
                                    lstOfferers.map((o) => (
                                        <OffererShareSolicitationInvitation
                                            key={`offerer_${o[EntityWithIdFields.Id]}_solicitationShare`}
                                            offerer={o}
                                        />
                                    ))
                                ) : (
                                    <Alert severity={"info"}>
                                        No es posible compartir dado que no se han encontrado oferentes
                                    </Alert>
                                )
                            ) : (
                                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
                            )}
                        </Stack>
                    </Stack>
                </FormProvider>
            </DialogContent>
            <DialogActions>
                <ShareButton
                    onClick={methods.handleSubmit(onShare)}
                    size={"small"}
                >
                    Compartir solicitud
                </ShareButton>
            </DialogActions>
        </Dialog>
    );
};

export default OffererShareSolicitationDialog;