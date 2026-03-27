import {Box, Card, CardContent, CardHeader, Stack} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {SolicitationTotalsView} from "../../../../../types/solicitations/solicitationData";
import {OffererContext} from "../../../components/OffererContextProvider";
import {HttpSolicitation} from "../../../../../http";
import {EntityWithIdFields} from "../../../../../types/baseEntities";
import OffererSolicitationChartComponent from "./OffererSolicitationChartComponent";

function OffererSolicitationChartsOwn() {
    const [statesData, setStatesData] = useState<SolicitationTotalsView[]>()
    const [productsData, setProductsData] = useState<SolicitationTotalsView[]>()
    const offerer = useContext(OffererContext)
    
    useEffect(() => {
        if (offerer) {
            Promise.all([
                HttpSolicitation.getTotalSolicitationsByUserStates(offerer[EntityWithIdFields.Id]),
                HttpSolicitation.getTotalSolicitationsByUserProducts(offerer[EntityWithIdFields.Id])
            ]).then((values) => {
                setStatesData(values[0])
                setProductsData(values[1])
            })
        }    
    }, [offerer])
    
  return (
    <Card>
      <CardHeader title={"Mis Solicitudes"} sx={{ textAlign: 'center' }} />
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }}>
          <Box flex={1} width={{ xs: '100%', md: '50%' }}>
              <OffererSolicitationChartComponent textWithoutData={'Acá podrás visualizar como se distribuyen las solicitudes en los distintos estados'}
                                                 data={statesData}
              />
          </Box>

          <Box flex={1} width={{ xs: '100%', md: '50%' }}>
              <OffererSolicitationChartComponent textWithoutData={'Acá podrás visualizar como se distribuyen las solicitudes en los distintos tipos de productos'}
                                                 data={productsData}
              />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default OffererSolicitationChartsOwn;