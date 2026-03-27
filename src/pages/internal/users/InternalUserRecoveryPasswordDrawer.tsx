import DrawerBase from "../../../components/misc/DrawerBase";
import {SendButton} from "../../../components/buttons/Buttons";
import {UserSummary, UserSummaryFields} from "../../../types/user";
import {Box, Stack, Tooltip, Typography} from "@mui/material";
import {useState} from "react";
import useAxios from "../../../hooks/useAxios";
import {HttpUser} from "../../../http";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {useAction} from "../../../hooks/useAction";
import {WrapperIcons} from "../../../components/icons/Icons";
import {CopySimple} from "phosphor-react";
import {CryptoJSHelper} from "../../../util/helpers";
import {ConfigurationEconde, configurationEncoder} from "../../../util/configurations";


interface InternalUserRecoveryPasswordDrawerProps {
    open: boolean,
    onClose: (reload: boolean) => void,
    user: UserSummary
}


const InternalUserRecoveryPasswordDrawer = ({open, onClose, user} : InternalUserRecoveryPasswordDrawerProps) => {
    const [newPassGenerated, setNewPassGenerated] = useState<any>('')
    const [copied, setCopied] = useState<boolean>(false)
    const { snackbarSuccess } = useAction()
    const { fetchData } = useAxios()
    
    const onHandleClose = () => onClose(!!newPassGenerated);
    
    const handleDecryptPassword = async (password: string) => {
        let encoder: ConfigurationEconde =
            await configurationEncoder.getConfiguration();
        const decrypted = CryptoJSHelper.decrypt(encoder, password)
        setNewPassGenerated(decrypted);
    }
    const onGenerateNewPassword = () => {
        fetchData(
            () => HttpUser.recoverPassword(user[EntityWithIdFields.Id]),
            true
        ).then((r) => {
            handleDecryptPassword(r)
            snackbarSuccess('La clave fue generada con éxito')
        })
    }
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onHandleClose}
                    title='Recuperar contraseña'
                    action={<SendButton id="new-password-user" onClick={onGenerateNewPassword} disabled={newPassGenerated !== ''}>
                        Generar nueva clave
        </SendButton>}
        >
            <Stack spacing={2}>
                <Typography>
                    Estás a punto de cambiarle la contraseña al usuario{' '}
                    <Box component="span" fontWeight={600}>
                        {user[UserSummaryFields.Fullname]}
                    </Box>{' '}
                    cuyo correo es{' '}
                    <Box component="span" fontWeight={600}>
                        {user[UserSummaryFields.Mail]}
                    </Box>
                    . Si estás seguro, presiona el botón para generar una nueva clave.
                </Typography>
                {
                    newPassGenerated !== '' &&
                    <Box sx={{padding: 2, borderRadius: '24px !important', backgroundColor: 'rgba(76, 175, 80, 0.25)'}}>
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <Typography color={`rgb(76, 175, 80)`}>
                                La nueva contraseña del usuario es
                                <Typography variant={'caption'} fontSize={'1.15rem'} fontWeight={600}>{` ${newPassGenerated}`}</Typography>
                            </Typography>
                            <Tooltip title={copied ? 'Copiado ✓' : 'Copiar al portapapeles'}>
                                <Box onClick={() => {
                                    navigator.clipboard.writeText(newPassGenerated)
                                    setCopied(true)
                                }} sx={{cursor: 'pointer'}}>
                                    <WrapperIcons Icon={CopySimple} />
                                </Box>
                            </Tooltip>
                        </Stack>
                    </Box>
                }
            </Stack>
        </DrawerBase>
    )
}


export default InternalUserRecoveryPasswordDrawer