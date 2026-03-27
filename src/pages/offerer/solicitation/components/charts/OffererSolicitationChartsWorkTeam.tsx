import {Box, Card, CardContent, CardHeader, Stack} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {SolicitationTotalsView} from "../../../../../types/solicitations/solicitationData";
import {OffererContext} from "../../../components/OffererContextProvider";
import {HttpSolicitation} from "../../../../../http";
import {EntityWithIdFields} from "../../../../../types/baseEntities";
import OffererSolicitationChartComponent from "./OffererSolicitationChartComponent";

function OffererSolicitationChartsWorkTeam() {
    const [assignationsData, setAssignationsData] = useState<SolicitationTotalsView[]>()
    const [statesData, setStatesData] = useState<SolicitationTotalsView[]>()
    const offerer = useContext(OffererContext)

    useEffect(() => {
        if (offerer){
            Promise.all([
                HttpSolicitation.getTotalSolicitationsByWorkTeamAssignments(offerer[EntityWithIdFields.Id]),
                HttpSolicitation.getTotalSolicitationsByWorkTeamStates(offerer[EntityWithIdFields.Id])
            ]).then((values) => {
                setAssignationsData(values[0])
                setStatesData(values[1])
            }) 
        }
    }, [offerer])
    
    
  return (
    <Card>
      <CardHeader title={"Mi equipo de trabajo"} sx={{ textAlign: 'center' }} />
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }}>
          <Box flex={1} width={{ xs: '100%', md: '50%' }}>
              <OffererSolicitationChartComponent textWithoutData={'Acá podrás visualizar como se distribuyen las solicitudes en las distintas asignaciones'}
                                                 data={assignationsData}
              />
          </Box>
          <Box flex={1} width={{ xs: '100%', md: '50%' }}>
              <OffererSolicitationChartComponent textWithoutData={'Acá podrás visualizar como se distribuyen las solicitudes en los distintos estados'}
                                                 data={statesData}
              />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default OffererSolicitationChartsWorkTeam;