import {Fragment, useContext, useEffect, useState} from "react";
import {OffererContext} from "../components/OffererContextProvider";
import {Button, Card, CardContent, Stack} from "@mui/material";
import {useForm} from "react-hook-form";
import {ControlledTextPasswordFieldFilled} from "components/forms";
import {DialogAlert} from "components/dialog";
import useAxios from "hooks/useAxios";
import {HttpOffererIntegration} from "http/offerer/httpOffererIntegration";
import {BaseRequestFields, BaseResponseFields, EntityWithIdFields} from "types/baseEntities";
import {
    OffererIntegrationDelete,
    OffererIntegrationDeleteFields,
    OffererIntegrationView, OffererIntegrationViewFields
} from "types/offerer/offererIntegrationData";
import {Skeleton} from "@mui/lab";
import OffererIntegrationEditDrawer from "./components/OffererIntegrationEditDrawer";
import {SafetyComponent} from "components/security";
import {OffererButtonSecObjects, SecurityComponents} from "types/security";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {TypographyBase} from "components/misc/TypographyBase";
import {LinkIcon, UnlinkIcon, CheckIcon} from "lucide-react";
import {WrapperIcons} from "components/icons/Icons";


const OffererIntegration = () => {
    const offerer = useContext(OffererContext);
    const { addSnackbarSuccess } = useSnackbarActions();
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [integration, setIntegration] = useState<OffererIntegrationView>()
    const { fetchData } = useAxios();
    
    const { control, setValue } = useForm()

    const getIntegrationData = () => {
        HttpOffererIntegration.getIntegration(offerer[EntityWithIdFields.Id]).then((r) => {
            setIntegration(r)
            //esto va a fines ilustrativos
            if (r[OffererIntegrationViewFields.HasLufeApiKey]) setValue('dummy', "*******************************************")
            else setValue('dummy', "") 
        })
    }
    
    useEffect(() => {
        getIntegrationData()
    }, [offerer]);
    
    const onOpenEdit = () => setOpenEdit(true)
    
    const onOpenDelete = () => setOpenDelete(true)
    
    const onCloseEdit = () => setOpenEdit(false)
    
    const onCloseDelete = () => setOpenDelete(false)
    
    const handleDelete = () => {
        const deleteBody: OffererIntegrationDelete = {
            [OffererIntegrationDeleteFields.CleanLufeApiKey]: true,
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1
        }
        fetchData(
            () => HttpOffererIntegration.cleanIntegration(offerer[EntityWithIdFields.Id], deleteBody),
            true
        ).then((r) => {
            if (!r[BaseResponseFields.HasError]) {
                addSnackbarSuccess('La API Key fue removida exitosamente')
                getIntegrationData()
                onCloseDelete()
            }
        })
    }
    
    return (
        <Fragment>
            <Card>
                <CardContent>
                    <Stack spacing={4}>
                        <Stack spacing={1}>
                            <TypographyBase variant='h4'>
                                {integration?.[OffererIntegrationViewFields.HasLufeApiKey] ? 'Estás conectado al servicio LUFE' : 'Vincular LUFE con API Key'}
                            </TypographyBase>
                            <TypographyBase variant='body2' color='text.lighter'>
                                {integration?.[OffererIntegrationViewFields.HasLufeApiKey] ? 'Te conectaste a través de una API Key' : 'Para acceder a las funcionalidades de LUFE, ingresá tu API Key y empezá a usar el servicio'}
                            </TypographyBase>
                        </Stack>
                        {
                            !integration ?
                                <Skeleton sx={{ width: '100%', height: '30px' }}/>
                                :
                                <Stack spacing={2}>
                                    <Stack direction='row' alignItems='center' spacing={2}>
                                        <ControlledTextPasswordFieldFilled control={control} 
                                                                           name={'dummy'} 
                                                                           label={''} 
                                                                           disabled
                                                                           sx={{flex: 1}}
                                                                           InputProps={{
                                                                               endAdornment: integration[OffererIntegrationViewFields.HasLufeApiKey] ? 
                                                                                   <WrapperIcons Icon={CheckIcon} size="md" color="primary"/> 
                                                                                   : undefined
                                                                           }}
                                                                           defaultValue={integration[OffererIntegrationViewFields.HasLufeApiKey] ? "**********************" : undefined}
                                                                           hideControl
                                        />
                                        <Stack direction='row' alignItems='center' spacing={2}>
                                            {
                                                !integration[OffererIntegrationViewFields.HasLufeApiKey] ?
                                                    <SafetyComponent componentName={SecurityComponents.OffererIntegration} objectName={OffererButtonSecObjects.OffererButtonIntegrationAdd}>
                                                        <Button variant='contained' startIcon={<WrapperIcons Icon={LinkIcon} size='sm' />} onClick={onOpenEdit}>
                                                            Conectar
                                                        </Button>
                                                    </SafetyComponent>
                                                    :
                                                integration[OffererIntegrationViewFields.HasLufeApiKey] &&
                                                <SafetyComponent componentName={SecurityComponents.OffererIntegration} objectName={OffererButtonSecObjects.OffererButtonIntegrationDelete}>
                                                    <Button variant='outlined' color='secondary' startIcon={<WrapperIcons Icon={UnlinkIcon} size='sm' />} onClick={onOpenDelete}>
                                                        Desvincular
                                                    </Button>
                                                </SafetyComponent>
                                            }
                                        </Stack>
                                    </Stack>
                                </Stack>
                        }
                    </Stack>
                </CardContent>
            </Card>
            <DialogAlert onClose={() => setOpenDelete(false)}
                         open={openDelete}
                         title='Eliminar API Key'
                         textContent='¿Estás seguro de eliminar la API Key actual?'
                         onConfirm={handleDelete}
                         textConfirm={'Sí, eliminar'}
                         severity={'error'}
            />
            <OffererIntegrationEditDrawer open={openEdit}
                                          title={'API Key LUFE'}
                                          onClose={onCloseEdit}
                                          offererId={offerer[EntityWithIdFields.Id]}
                                          onReload={getIntegrationData}
            />
        </Fragment>
    )
}


export default OffererIntegration