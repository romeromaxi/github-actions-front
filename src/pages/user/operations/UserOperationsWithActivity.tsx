import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import UserOperationCard from "./UserOperationCard";
// @ts-ignore
import person from "assets/img/luc/person-operation.svg"
// @ts-ignore
import building from "assets/img/luc/building-operation.svg"


const UserOperationsWithActivity = (props : UserOperationWithActivityDetailProps) => {
    
    return (
        <Box sx={{width: '100%' , justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <Card variant={'onboarding'}>
                <CardContent sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <UserOperationWithActivityDetail {...props} />
                </CardContent>
            </Card>
        </Box>
    )
}


interface UserOperationWithActivityDetailProps {
    onClickMonotax?: () => void;
    onClickPyme?: () => void;
    onClickReturn?: () => void;
}

const UserOperationWithActivityDetail = ({onClickMonotax, onClickPyme, onClickReturn} : UserOperationWithActivityDetailProps) => {

    return (
        <Stack spacing={4}>
            <Stack spacing={0.75}>
                <TypographyBase variant="eyebrow2" color="primary">¡TU USUARIO FUE CREADO!</TypographyBase>
                <Typography variant="h4">Elegí como querés operar dentro de la plataforma</Typography>
                <Typography variant="body2" color="text.lighter">Para acceder a todas las funcionalidades de LUC necesitás vincular tu usuario a una negocio</Typography>
            </Stack>
            <Stack spacing={2}>
                <UserOperationCard logoUrl={person}
                                   onClick={onClickMonotax}
                                   title="Operar como Autónomo o Monotributista"
                                   description={"Opción ideal si sos autónomo o monotributista"}
                />
                <UserOperationCard logoUrl={building}
                                   onClick={onClickPyme}
                                   title="Operar como una PyME"
                                   description={"Opción perfecta si tenés o gestionás una PyME"}
                />
            </Stack>
            <Button variant="text" fullWidth onClick={onClickReturn}>Hacerlo más tarde</Button>
        </Stack>
    )
}

export default UserOperationsWithActivity;