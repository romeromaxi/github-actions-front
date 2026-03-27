
import {Card, CardContent, CardHeader, Stack, Typography} from "@mui/material";
import UserSolicitationServicesChart from "./UserSolicitationServicesChart";
import UserSolicitationTotalsChart from "./UserSolicitationTotalsChart";
import UserSolicitationStatesChart from "./UserSolicitationStatesChart";


const UserSolicitationsSummary = () => {
    
    return (
        <Stack direction='row' spacing={2} sx={{width: '100%', height: '100%', alignItems: 'stretch'}}>
            <Card sx={{width: 1 / 3, display: 'flex', flexDirection: 'column'}}>
                <CardHeader title={'Estado de las solicitudes'}/>
                <CardContent sx={{flexGrow: 1}}>
                    <UserSolicitationStatesChart />
                </CardContent>
            </Card>
            <Card sx={{width: 1 / 3, display: 'flex', flexDirection: 'column'}}>
                <CardHeader title={'Bancos / Entidades contactadas'} />
                <CardContent sx={{flexGrow: 1}}>
                    <UserSolicitationTotalsChart />
                </CardContent>
            </Card>
            <Card sx={{width: 1 / 3, display: 'flex', flexDirection: 'column'}}>
                <CardHeader title={'Solicitudes por servicio'} />
                <CardContent sx={{flexGrow: 1}}>
                    <UserSolicitationServicesChart />
                </CardContent>
            </Card>
        </Stack>
    )
}


interface SolicitationWithoutDataChartProps {
    description: string
}

export const SolicitationWithoutDataChart = ({description} : SolicitationWithoutDataChartProps) => {
    //const appConfig : AppConfig = window.APP_CONFIG;
    
    return (
            <Stack spacing={4} justifyContent={'center'} alignItems={'center'} textAlign={'center'} sx={{height: '100%'}}>
                {/*
                    <Box component={'img'}
                     sx={{
                         height: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Height],
                         width: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Width],
                         margin: '0 auto'
                     }}
                     src={appConfig[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                />
                */}
                <Stack>
                    <Typography variant={'caption'} color={'text.lighter'}>No hay información disponible</Typography>
                    <Typography variant={'caption'} color={'text.lighter'} fontSize={'0.7rem'}>{description}</Typography>
                </Stack>
            </Stack>
        )
}


export default UserSolicitationsSummary