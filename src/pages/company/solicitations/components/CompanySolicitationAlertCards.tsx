import {Button, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../../components/icons/Icons";
import {ChatTeardropDots, FolderOpen} from "phosphor-react";
import {useNavigate, useParams} from "react-router-dom";
import {SolicitationAlertType} from "../../../../types/solicitations/solicitationEnums";
import {ElementType} from "react";
import {useCompanySolicitation} from "../CompanySolicitationContext";
import {Skeleton} from "@mui/lab";


const CompanySolicitationAlertCards = () => {
    const {alertCode} = useCompanySolicitation()
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <CompanySolicitationAlertCardDetail icon={ChatTeardropDots}
                                                    isChat
                                                    pendant={alertCode === SolicitationAlertType.NewMessage || alertCode === SolicitationAlertType.NewMessageAndNewDocument}
                                                    loading={alertCode == undefined}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <CompanySolicitationAlertCardDetail icon={FolderOpen}
                                                    pendant={alertCode === SolicitationAlertType.NewDocument || alertCode === SolicitationAlertType.NewMessageAndNewDocument}
                                                    loading={alertCode == undefined}
                />
            </Grid>
        </Grid>
    )
}


interface CompanySolicitationAlertCardDetailProps {
    icon: ElementType,
    pendant: boolean,
    isChat?: boolean
    loading: boolean;
}

const CompanySolicitationAlertCardDetail = ({icon, pendant, isChat, loading} : CompanySolicitationAlertCardDetailProps) => {
    const navigate = useNavigate()
    const {companyId, solicitationId} = useParams()

    const onNavigateToChat = () => navigate(`/mis-solicitudes/${companyId}/${solicitationId}?tab=chat`)
    const onNavigateToDoc = () => navigate(`/mis-solicitudes/${companyId}/${solicitationId}?tab=docsExchange`)
    
    const handleNavigate = () => isChat ? onNavigateToChat() : onNavigateToDoc()
    
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack spacing={3} alignItems='center'>
                    <BaseIconWrapper Icon={icon} size='lg' width={'52px'} height={'52px'} bg={'#F7FAFC'} badge={pendant} />
                    <Stack spacing={1} alignItems='center'>
                        <Typography variant='h5' fontWeight={500}>{isChat ? 'Chat con la entidad' : 'Documentación'}</Typography>
                        {
                            loading ? <Skeleton width={'100%'}/> :
                            <Typography color={`${pendant ? '#e3891a' : undefined}`} variant='caption' fontSize={13.25} fontWeight={500}>
                                {pendant ? isChat ? 'Tenés mensajes sin leer ⚠️' : 'Tenés documentación pendiente️ ⚠️'
                                    : isChat ? 'No tenés mensajes sin leer 🎉' : 'No tenés documentación pendiente 🎉'
                                }
                            </Typography>
                        }   
                        {pendant && <Button size='extra-small' variant='outlined' onClick={handleNavigate}>Ver</Button>}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}


export default CompanySolicitationAlertCards