import {Card, CardContent, Stack} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Alert, Skeleton} from "@mui/lab";
import {SolicitationCommunicationView} from "../../../../types/solicitations/solicitationCommunicationData";
import {HttpSolicitationCommunication} from "../../../../http/solicitations/httpSolicitationCommunication";
import SolicitationCommunicationComponent from "../../../solicitations/components/SolicitationCommunicationComponent";


interface CompanySolicitationResultEvaluationProps {
    hideAlert?: boolean;    
}

const CompanySolicitationResultEvaluation = ({hideAlert}: CompanySolicitationResultEvaluationProps) => {
    const {solicitationId} = useParams();
    const parsedSolicitationId = parseInt(solicitationId ?? '0');
    
    const [communications, setCommunications] = useState<SolicitationCommunicationView[]>()

    useEffect(() => {
        if (parsedSolicitationId) {
            setCommunications(undefined);
            HttpSolicitationCommunication.getByIdSolicitation(parsedSolicitationId)
                .then(setCommunications)
        }
    }, [parsedSolicitationId]);
    
    return (
        !communications ?
            <Stack spacing={2}>
                <Skeleton height={50} sx={{width: '100%'}}/>
                <Skeleton height={50} sx={{width: '100%'}}/>
            </Stack>
            :
            <Stack spacing={2}>
                {
                    !!communications.length ?
                        communications.map((communication, index) => (
                            <SolicitationCommunicationComponent solicitationId={parsedSolicitationId}
                                                                communication={communication}
                            />
                        ))
                        :
                        !hideAlert &&
                        <Card>
                            <CardContent>
                                <Alert color={'info'} severity={'info'}>
                                    La solicitud se encuentra en espera de confirmación de recepción. Pronto podrás ver esta sección
                                </Alert>
                            </CardContent>
                        </Card>
                }
            </Stack>
    )
}


export default CompanySolicitationResultEvaluation