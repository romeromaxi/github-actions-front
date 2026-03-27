import {Alert, Dialog, DialogContent, Grid} from "@mui/material";
import BaseDialogTitle from "../../../components/dialog/BaseDialogTitle";
import {FormProvider, useForm, useFormContext} from "react-hook-form";
import {AdInsertFields, AdLocationForm, AdLocationFormFields, AdView} from "../../../types/ad/adData";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {RequiredSelectSchema} from "../../../util/validation/validationSchemas";
import {useEffect, useState} from "react";
import {HttpCacheAd} from "../../../http/cache/httpCacheAd";
import {AsyncSelect} from "../../../components/forms";
import {HttpAds} from "../../../http/ad/httpAds";
import MarketAdBannerSwiper from "../../markets/components/misc/MarketAdBannerSwiper";


interface AdsPreviewDialogProps {
    open: boolean;
    onClose: () => void;
}


const AdsPreviewDialog = ({open, onClose} : AdsPreviewDialogProps) => {
    const [ads, setAds] = useState<AdView[]>()
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
        if (!!watchLocation) HttpAds.getActualPreviewByLocation(watchLocation).then(setAds)
        else setAds(undefined)
    }, [watchLocation]);
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth='lg'
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title={'Previsualización de publicidades'} />
            <DialogContent>
                <FormProvider {...methods}>
                    <AdsPreviewDialogContent ads={ads} />
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}


interface AdsPreviewDialogContentProps {
    ads?: AdView[]
}

export const AdsPreviewDialogContent = ({ads} : AdsPreviewDialogContentProps) => {
    const { control, watch } = useFormContext()

    const watchLocation = watch(AdLocationFormFields.AdLocationTypeCode)
    return (
        <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
                <AsyncSelect loadOptions={HttpCacheAd.getLocations}
                             control={control}
                             fullWidth
                             label='Ubicación'
                             name={AdInsertFields.AdLocationTypeCode}
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent={'center'} alignItems={'center'}>
                    <Grid item xs={12} sm={10.5}>
                        {
                            !!watchLocation ?
                                <MarketAdBannerSwiper ads={ads} disabledAction />
                                :
                                <Alert severity='info' sx={{justifyContent: 'center'}}>
                                    Selecciona una ubicación para ver las publicidades de la misma
                                </Alert>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default AdsPreviewDialog