import DrawerBase from "../../../../components/misc/DrawerBase";
import {UpdateButton} from "../../../../components/buttons/Buttons";
import {ControlledTextFieldFilled} from "../../../../components/forms";
import {useForm} from "react-hook-form";
import {
    OffererIntegrationUpdate,
    OffererIntegrationUpdateFields
} from "../../../../types/offerer/offererIntegrationData";
import useAxios from "../../../../hooks/useAxios";
import {HttpOffererIntegration} from "../../../../http/offerer/httpOffererIntegration";
import {BaseRequestFields, BaseResponseFields} from "../../../../types/baseEntities";
import {useAction} from "../../../../hooks/useAction";


interface OffererIntegrationEditDrawerProps {
    open: boolean,
    title?: string,
    offererId: number,
    onClose: () => void,
    onReload: () => void
}


const OffererIntegrationEditDrawer = ({open, title, offererId, onClose, onReload} : OffererIntegrationEditDrawerProps) => {
    const { fetchData } = useAxios()
    const { snackbarError, snackbarSuccess } = useAction()
    const { control, handleSubmit, watch, reset } = useForm<OffererIntegrationUpdate>({
        defaultValues: {
            [OffererIntegrationUpdateFields.LufeApiKey]: undefined
        }
    })
    const watchApiKey = watch(OffererIntegrationUpdateFields.LufeApiKey)
    const onSubmit = (data: OffererIntegrationUpdate) => {
        const submitData: OffererIntegrationUpdate = {
            ...data,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1
        }
        
        fetchData(
            () => HttpOffererIntegration.updateIntegration(offererId, submitData),
            true
        ).then((r) => {
            if (r[BaseResponseFields.HasError]) snackbarError('Ocurrió un error al cambiar la API Key')
            else {
                snackbarSuccess('La API Key se actualizó correctamente')
                onReload()
                handleClose()
            }
        })
    }
    
    const handleClose = () => {
        reset({
            [OffererIntegrationUpdateFields.LufeApiKey]: undefined
        })
        onClose()
    }
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={handleClose}
                    title={title ?? 'Carga de API Key'}
                    action={
                        <UpdateButton onClick={handleSubmit(onSubmit)} disabled={!watchApiKey}>
                            Cambiar API Key
                        </UpdateButton>
                    }
        >
            <ControlledTextFieldFilled control={control}
                                       name={OffererIntegrationUpdateFields.LufeApiKey}
                                       fullWidth
                                       label='Nueva API Key'
            />
        </DrawerBase>
    )
}


export default OffererIntegrationEditDrawer