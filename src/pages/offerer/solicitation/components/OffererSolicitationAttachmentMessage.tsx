import {Card, CardContent, CardHeader} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {TypographyBase} from "components/misc/TypographyBase";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";

function OffererSolicitationAttachmentMessage() {
    const { solicitation } = useSolicitation();
    
    if (!solicitation || !solicitation[SolicitationViewDTOFields.InitialMessage])
        return null;
    
    return (
        <Card>
            <CardHeader title={'Mensaje adjunto a la solicitud'} minPadding />
            
            <CardContent>
                <TypographyBase variant={'body2'} color={'text.lighter'} fontStyle={'italic'}>
                    {solicitation[SolicitationViewDTOFields.InitialMessage]}
                </TypographyBase>
            </CardContent>
        </Card>
    )
}

export default OffererSolicitationAttachmentMessage;