import {useEffect, useState } from "react";
import { SolicitationViewDTO } from "types/solicitations/solicitationData";
import {HttpSolicitation} from "http/index";
import {Stack} from "@mui/material";
import SolicitationCard from "./SolicitationCard";
import SolicitationCardSkeleton from "./cards/SolicitationCardSkeleton";

interface SolicitationCardChildrenWrappedProps {
    solicitationId: number
}

function SolicitationCardChildrenWrapped({ solicitationId }: SolicitationCardChildrenWrappedProps) {
    const [childrenSolicitations, setChildrenSolicitations] = useState<SolicitationViewDTO[]>()
    const [error, setError] = useState<boolean>(false)
    
    useEffect(() => {
        HttpSolicitation.getAssociates(solicitationId)
            .then(setChildrenSolicitations)
            .catch(() => setError(true))
    }, []);
    
    return (
        <Stack spacing={2.5}>
            {
                childrenSolicitations ?
                    childrenSolicitations.map((solicitation, index) => (
                        <SolicitationCard key={`solicitationCardChildrenWrapped_${solicitationId}_${index}`}
                                          solicitation={solicitation}
                                          selectedIds={[]}
                                          onReloadSolicitations={() => {}}
                                          hideCompanyInfo
                        />
                    ))
                    :
                    !error ?
                        Array.from({length: 2}).map((_, index) => (
                            <SolicitationCardSkeleton key={`solicitationCardChildrenWrappedLoading_${solicitationId}_${index}`}
                                                      hideCompanyInfo
                            />
                        ))
                        :
                        null
            }
        </Stack>
    )
}

export default SolicitationCardChildrenWrapped;