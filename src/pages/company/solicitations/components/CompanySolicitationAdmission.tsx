import {Button, Card, CardActions, CardContent, CardHeader, Stack} from "@mui/material";
import {useCompanySolicitation} from "../CompanySolicitationContext";
import {TypographyBase} from "components/misc/TypographyBase";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import useAxios from "hooks/useAxios";
import {HttpSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {useAction} from "../../../../hooks/useAction";

function CompanySolicitationAdmission() {
    const { solicitation, loadSolicitation } = useCompanySolicitation();
    const { fetchData } = useAxios();
    const { snackbarSuccess } = useAction();
    
    const cancelAdmission = () => {
        if (solicitation)
            fetchData(
                () => HttpSolicitation.cancelSolicitation(solicitation[EntityWithIdFields.Id]),
                true,
            ).then(() => {
                loadSolicitation(solicitation[EntityWithIdFields.Id])
                snackbarSuccess('Solicitud cancelada con éxito');
            });
    }
    
    const confirmAdmission = () => {
        if (solicitation)
            fetchData(
                () => HttpSolicitation.confirmCompanyAdmissionApproval(solicitation[EntityWithIdFields.Id]),
                true
            )
                .then(() => {
                    loadSolicitation(solicitation[EntityWithIdFields.Id])
                })
    }
    
    return (
        <Card>
            <CardHeader title={'Admitir Solicitud'} />
            
            <CardContent>
                <Stack>
                    <TypographyBase>
                        Se ha generado una solicitud con 
                        <TypographyBase variant="inherit" component="span" display={'inline'} fontWeight={600}>
                            {` ${solicitation?.[SolicitationViewDTOFields.OffererBusinessName]} `}
                        </TypographyBase>
                            {`como resultado de la Búsqueda Asistida que iniciaste con ${solicitation?.[SolicitationViewDTOFields.IntermediaryOffererBusinessName]}. `}
                             ¿Deseás continuar con la solicitud y comunicarte con la entidad oferente?
                    </TypographyBase>
                </Stack>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button variant={'outlined'} color={'secondary'} size={'small'}
                        onClick={cancelAdmission}
                >
                    Cancelar
                </Button>
                <Button variant={'contained'} color={'primary'} size={'small'}
                        onClick={confirmAdmission}>
                    Aceptar
                </Button>
            </CardActions>
        </Card>
    )
}

export default CompanySolicitationAdmission