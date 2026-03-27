import {useEffect, useState} from "react";
import {Skeleton} from "@mui/lab";
import {Card, CardContent, CardHeader, IconButton, Stack} from "@mui/material";
import {EntityWithIdFields} from "types/baseEntities";
import {SolicitationSummaryViewDTO} from "types/solicitations/solicitationData";
import {WrapperIcons} from "components/icons/Icons";
import {ArrowCounterClockwise} from "@phosphor-icons/react";
import SolicitationRelatedOffererCompanySummary from "./SolicitationRelatedOffererCompanySummary";

interface SolicitationRelatedOffererCompanyProps {
    solicitationIdBase?: number,
    promiseFn: () => Promise<SolicitationSummaryViewDTO[]>
}

function SolicitationRelatedOffererCompany({ solicitationIdBase, promiseFn }: SolicitationRelatedOffererCompanyProps) {
  const [solicitations, setSolicitations] = useState<SolicitationSummaryViewDTO[]>();
  
  const loadSolicitations = () => {
    setSolicitations(undefined);

    promiseFn().then((response) => {
          const filteredSolicitationList = response.filter(
            (s) => s[EntityWithIdFields.Id] !== solicitationIdBase,
          );
          setSolicitations(filteredSolicitationList);
        },
      );
  }
  
  const actionHeader =
    <IconButton size={'small'} onClick={loadSolicitations}>
      <WrapperIcons Icon={ArrowCounterClockwise} />
    </IconButton>;

  useEffect(() => {
    loadSolicitations();
  }, []);
  
  return (
    <Card>
      <CardHeader title={'Solicitudes vinculadas'}
                  subheader={solicitations && `${solicitations.length} solicitudes más fueron recibidas`}
                  action={actionHeader}
      />
      
      <CardContent>
        <Stack spacing={1}>
          {
            solicitations ? 
              solicitations.map((s, idx) => (
                <SolicitationRelatedOffererCompanySummary key={`solicitationRelatedOffererCompanySummary_${idx}`} 
                                                          solicitation={s} 
                />
              ))
              :
              Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={`solicitationRelatedOffererCompany_${idx}`} variant={'text'} />
              ))
          }
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SolicitationRelatedOffererCompany;