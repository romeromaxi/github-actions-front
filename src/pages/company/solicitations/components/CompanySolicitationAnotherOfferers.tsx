import {useState, useEffect} from "react";
import {Stack, Skeleton} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {HttpSolicitation} from "http/index";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import SolicitationCard from "pages/markets/solicitations/components/SolicitationCard";

interface CompanySolicitationAnotherOfferersProps {
    solicitationId: number;
}


const CompanySolicitationAnotherOfferers = ({ solicitationId }: CompanySolicitationAnotherOfferersProps) => {
    const [relatedSolicitations, setRelatedSolicitations] = useState<SolicitationViewDTO[]>();
    
    useEffect(() => {
        HttpSolicitation.getAssociates(solicitationId).then(setRelatedSolicitations);
    }, [solicitationId]);
    
    
    if (!relatedSolicitations || relatedSolicitations.length === 0) return null;
    
    return (
        <Stack spacing={4}>
            <TypographyBase variant="h3">
                Oferentes que encontramos para vos
            </TypographyBase>
            <Stack spacing={2}>
                {
                    relatedSolicitations ?
                        relatedSolicitations.length !== 0 && relatedSolicitations.map((solicitation) => (
                            <SolicitationCard key={`card_solicitation_related_${solicitation.id}`}
                                              solicitation={solicitation}
                                              selectedIds={[]}
                                              onReloadSolicitations={() => {}}
                            />
                        
                        ))
                        :
                        Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={`skeleton_card_solicitation_related_${index}`} width={'100%'} height={50}/>
                        ))
                }
            </Stack>
        </Stack>
    );
}


export default CompanySolicitationAnotherOfferers