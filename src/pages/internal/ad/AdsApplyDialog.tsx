import {useEffect, useState} from "react";
import {AdLocationForm, AdLocationFormFields, AdView} from "../../../types/ad/adData";
import * as yup from "yup";
import {RequiredSelectSchema} from "../../../util/validation/validationSchemas";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {HttpAds} from "../../../http/ad/httpAds";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import BaseDialogTitle from "../../../components/dialog/BaseDialogTitle";
import {SendButton} from "../../../components/buttons/Buttons";
import useAxios from "../../../hooks/useAxios";
import {useSnackbarActions} from "../../../hooks/useSnackbarActions";
import {AdsPreviewDialogContent} from "./AdsPreviewDialog";


interface AdsApplyDialogProps {
    open: boolean;
    onClose: () => void;
    onReload: () => void;
}


const AdsApplyDialog = ({open, onClose, onReload} : AdsApplyDialogProps) => {
    const [ads, setAds] = useState<AdView[]>()
    const { fetchData } = useAxios()
    const { addSnackbarSuccess } = useSnackbarActions()
    const adLocationFormSchema = yup.object().shape({
        [AdLocationFormFields.AdLocationTypeCode]: RequiredSelectSchema
    })

    const methods = useForm<AdLocationForm>({
        resolver: yupResolver(adLocationFormSchema)
    })

    const watchLocation = methods.watch(AdLocationFormFields.AdLocationTypeCode)

    useEffect(() => {
        if (open) methods.setValue(AdLocationFormFields.AdLocationTypeCode, null)
    }, [open])

    useEffect(() => {
        if (!!watchLocation) HttpAds.getProposalsByLocation(watchLocation).then(setAds)
        else setAds(undefined)
    }, [watchLocation]);

    const onSubmit = (data: AdLocationForm) => {
        fetchData(
            () => HttpAds.applyProposalByLocation(data[AdLocationFormFields.AdLocationTypeCode]),
            true
        ).then(() => {
            onReload()
            onClose()
            addSnackbarSuccess('Las publicidades fueron aplicadas correctamente')
        })
    }
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth='lg'
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title={'Aplicar publicidades propuestas'}
                             subtitle={'Si queres confirmar estas publicidades, presiona el botón'}
            />
            <DialogContent>
                <FormProvider {...methods}>
                    <AdsPreviewDialogContent ads={ads}/>
                </FormProvider>
            </DialogContent>
            <DialogActions>
                <SendButton onClick={methods.handleSubmit(onSubmit)} id="internal-ads-apply-proposal-btn" disabled={!watchLocation}>
                    Aplicar
                </SendButton>
            </DialogActions>
        </Dialog>
    )
}


export default AdsApplyDialog