import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import UserOperationCard from "./UserOperationCard";
// @ts-ignore
import buildingNext from "../../../assets/img/luc/building-operation-next.svg";
// @ts-ignore
import building from "../../../assets/img/luc/building-operation.svg";


const UserOperationsWithoutActivity = (props: UserOperationWithoutActivityDetailProps) => {
    
    
    return (
        <Box sx={{width: '100%' , justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <Card variant={'onboarding'}>
                <CardContent sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <UserOperationWithoutActivityDetail { ...props } />
                </CardContent>
            </Card>
        </Box>
    )
}


interface UserOperationWithoutActivityDetailProps {
    onClickCreate?: () => void;
    onClickJoin?: () => void;
    onClickReturn?: () => void;
    returnLabel?: string
}

export const UserOperationWithoutActivityDetail = ({
    onClickCreate,
    onClickJoin,
    onClickReturn,
    returnLabel = 'Hacerlo más tarde'
} : UserOperationWithoutActivityDetailProps) => {
    return (
        <Stack spacing={4}>
            <Stack spacing={0.75}>
                <TypographyBase variant="eyebrow2" color="primary">VINCULARME A UNA PYME</TypographyBase>
                <Typography variant="h4">Vinculá tu usuario a una PyME</Typography>
            </Stack>
            <Stack spacing={2}>
                <UserOperationCard logoUrl={building}
                                   onClick={onClickCreate}
                                   title="Crear una cuenta PyME"
                                   description={"Opción perfecta si tenés o gestionás una PyME"}
                />
                <UserOperationCard logoUrl={buildingNext}
                                   onClick={onClickJoin}
                                   title="Unirme a una cuenta PyME ya existente"
                                   description={"Si la PyME ya existe en LUC, podés solicitar unirte"}
                />
            </Stack>
            <Button variant="text" fullWidth onClick={onClickReturn}>
                {returnLabel}
            </Button>
        </Stack>
    )
}


export default UserOperationsWithoutActivity;