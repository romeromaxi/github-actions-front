import {useContext, useMemo} from "react";
import {Card, Stack} from "@mui/material";
import {OffererSolicitationTabProgressContext} from "../OffererSolicitationTabProgress";
import {TypographyBase} from "components/misc/TypographyBase";
import {useUser} from "hooks/contexts/UserContext";
import {SolicitationAnalysisViewDTOFields} from "types/solicitations/solicitationAnalysisData";
import {WrapperIcons} from "components/icons/Icons";
import {LoaderIcon} from "lucide-react";

function OffererSolicitationProgressApprovalWithoutPermission() {
    const { user } = useUser();
    const {currentAnalysis} = useContext(OffererSolicitationTabProgressContext);
    
    const isAptitudeUser = useMemo(() => (
        user?.userId === currentAnalysis?.[SolicitationAnalysisViewDTOFields.AptitudeUserId]
    ), [user, currentAnalysis])
    
    if (!user || !currentAnalysis)
        return null;
    
    return (
        <Card sx={{ padding: '16px' }}>
            <Stack direction={'row'}
                   spacing={1.25}
                   alignItems={'center'}
            >
                {
                    isAptitudeUser &&
                        <WrapperIcons Icon={LoaderIcon} size={'md'} />
                }
                
                <TypographyBase variant={'button2'}>
                    {
                        isAptitudeUser ? 
                            "Tu recomendación está siendo revisada por un aprobador" 
                            : 
                            "La recomendación del analista está siendo revisada por un aprobador"
                    }
                </TypographyBase>
            </Stack>
        </Card>
    )
}

export default OffererSolicitationProgressApprovalWithoutPermission;