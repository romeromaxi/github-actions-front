import DrawerBase from "../../../components/misc/DrawerBase";
import {
    AdDestinationType,
    AdDestinationTypeFields,
    AdDestinationTypes,
    AdHistoryView,
    AdInsert,
    AdInsertFields,
    AdViewDetail,
    AdViewFields
} from "../../../types/ad/adData";
import {SendButton} from "../../../components/buttons/Buttons";
import {useForm} from "react-hook-form";
import {Stack} from "@mui/material";
import {AsyncSelect, ControlledCheckBox, ControlledTextFieldFilled} from "../../../components/forms";
import {HttpCacheAd} from "../../../http/cache/httpCacheAd";
import {useCallback, useEffect, useMemo, useState} from "react";
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {RequiredSelectSchema, RequiredStringSchema} from "../../../util/validation/validationSchemas";
import useAxios from "../../../hooks/useAxios";
import {HttpAds} from "../../../http/ad/httpAds";
import {BaseResponseFields, EntityWithIdAndDescriptionFields} from "../../../types/baseEntities";
import {useAction} from "../../../hooks/useAction";
import AdHistoryDrawerContent from "./AdHistoryDrawerContent";
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {ClipboardText} from "phosphor-react";
import {HttpCacheMarketDynamic} from "http/cache/httpCacheMarketDynamic";
import {MarketIntermadiateDynamicSearchFields} from "../../../types/market/marketIntermediateData";


interface AdDrawerProps {
    open: boolean;
    onClose: () => void;
    onReload: () => void;
    adToEdit?: AdViewDetail;
}

const AdDrawer = ({open, onClose, onReload, adToEdit} : AdDrawerProps) => {
    const [history, setHistory] = useState<AdHistoryView[]>()
    const {fetchData} = useAxios()
    const {snackbarSuccess} = useAction()
    
    const [adDestinations, setAdDestinations] = useState<AdDestinationType[]>();
    
    const adFormSchema = yup.object().shape({
        [AdInsertFields.ProposalDetail]: RequiredStringSchema,
        [AdInsertFields.AdLocationTypeCode]: RequiredSelectSchema,
        [AdInsertFields.AdDestinationTypeCode]: RequiredSelectSchema
    })
    
    const {control, handleSubmit, reset, setValue, watch} = useForm<AdInsert>({
        resolver: yupResolver(adFormSchema)
    });
    const watchAdDestination = watch(AdInsertFields.AdDestinationTypeCode);
    
    const adDestination : AdDestinationType | undefined = useMemo(() => (
        adDestinations?.find(x => x.id === watchAdDestination)
    ), [adDestinations, watchAdDestination])
    
    const loadAdDestinations = useCallback(() => {
        if (adDestinations) return Promise.resolve(adDestinations);
        
        return HttpCacheAd.getDestinations().then(setAdDestinations);
    }, [adDestinations]);
    
    const loadMarketDynamicBySection = useCallback(() => {
        if (!adDestinations || !adDestination?.[AdDestinationTypeFields.MarketSectionSearchCode])
            return Promise.resolve([]);
        
        return HttpCacheMarketDynamic.getTabsBySection(adDestination[AdDestinationTypeFields.MarketSectionSearchCode])
            .then(response => (
                response.map(x => ({
                    [EntityWithIdAndDescriptionFields.Id]: x[MarketIntermadiateDynamicSearchFields.GuiId],
                    [EntityWithIdAndDescriptionFields.Description]: x[MarketIntermadiateDynamicSearchFields.Title]
                }))
            ))
    }, [adDestination])
    
    const onSubmit = (data: AdInsert) =>  {
        fetchData(
            () => !!adToEdit ? HttpAds.update(adToEdit[AdViewFields.Id], data) : HttpAds.insert(data),
            true
        ).then((r) => {
            if (!r[BaseResponseFields.HasError]) {
                snackbarSuccess('La publicidad fue creada con éxito')
                onClose()
                onReload()
            }
        })
    }

    useEffect(() => {
        if (adToEdit) {
            reset(adToEdit);
            HttpAds.getHistoricData(adToEdit[AdViewFields.Id]).then(setHistory);
        }
    }, [adToEdit]);

    useEffect(() => {
        if (!open) {
            reset({
                [AdInsertFields.ProposalDetail]: '',
                [AdInsertFields.ProposalDescription]: '',
                [AdInsertFields.DestinationUrl]: '',
                [AdInsertFields.ImageUrl]: '',
                [AdInsertFields.AdDestinationTypeCode]: null,
                [AdInsertFields.AdLocationTypeCode]: null,
                [AdInsertFields.ProposalActive]: false,
                [AdInsertFields.ProposalOrder]: null,
                [AdInsertFields.ProposalHeader]: '',
                [AdInsertFields.ProposalButtonName]: ''
            });
            setHistory(undefined);
        }
    }, [open]);
        
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={!!adToEdit ? 'Editar publicidad' : 'Nueva publicidad'}
                    action={<SendButton onClick={handleSubmit(onSubmit)}>Guardar</SendButton>}
        >
            <Stack spacing={2}>
                <ControlledTextFieldFilled control={control}
                                           fullWidth
                                           label='Encabezado'
                                           name={AdInsertFields.ProposalHeader}
                />
                <ControlledTextFieldFilled control={control}
                                           fullWidth
                                           label='Título'
                                           name={AdInsertFields.ProposalDescription}
                />
                <ControlledTextFieldFilled control={control}
                                           fullWidth
                                           label='Detalle'
                                           multiline
                                           rows={3}
                                           name={AdInsertFields.ProposalDetail}
                />
                <ControlledTextFieldFilled control={control}
                                           fullWidth
                                           label='Nombre del botón'
                                           name={AdInsertFields.ProposalButtonName}
                />
                
                <AsyncSelect loadOptions={loadAdDestinations}
                             control={control}
                             fullWidth
                             label='Destino'
                             name={AdInsertFields.AdDestinationTypeCode}
                             onChange={() => setValue(AdInsertFields.DestinationUrl, '')}
                />

                {
                    watchAdDestination ?
                        watchAdDestination === AdDestinationTypes.MarketAdvancedSearch ?
                            <AsyncSelect loadOptions={loadMarketDynamicBySection}
                                         control={control}
                                         label={`${adDestination?.[EntityWithIdAndDescriptionFields.Description]} (Destino)`}
                                         name={AdInsertFields.DestinationUrl}
                                         fullWidth
                            />
                            :
                            watchAdDestination !== AdDestinationTypes.CompanyBureau ?
                                <ControlledTextFieldFilled control={control}
                                                           fullWidth
                                                           label='URL Destino'
                                                           name={AdInsertFields.DestinationUrl}
                                />
                                :
                                null
                        :
                        null
                }
                
                <AsyncSelect loadOptions={HttpCacheAd.getLocations}
                             control={control}
                             fullWidth
                             label='Ubicación'
                             name={AdInsertFields.AdLocationTypeCode}
                />
                <Stack justifyContent='space-between' direction='row' alignItems='center'>
                    <ControlledTextFieldFilled control={control}
                                               name={AdInsertFields.ProposalOrder}
                                               label={'Orden'}
                                               type={'number'}
                                               sx={{width: '30%'}}
                    />
                    {
                        !!adToEdit &&
                        <ControlledCheckBox label={'Activo'}
                                            name={AdInsertFields.ProposalActive}
                                            control={control}
                                            
                        />
                    }
                </Stack>

                {
                    history && !!history.length &&
                        <TabSectionCardHeader icon={ClipboardText}
                                              sectionTitle={'Historial'}
                                              size={'small'}
                                              defaultCollapsed
                        >
                            <AdHistoryDrawerContent history={history} />
                        </TabSectionCardHeader>
                }
            </Stack>
        </DrawerBase>
                    
    )
}


export default AdDrawer