import { Box, Stack } from "@mui/material";
import OffererSolicitationChartsOwn from "./components/charts/OffererSolicitationChartsOwn";
import OffererSolicitationChartsWorkTeam from "./components/charts/OffererSolicitationChartsWorkTeam";

function OffererSolicitationCharts() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        <Box flex={1} width={{ xs: '100%', md: '50%' }}>
            <OffererSolicitationChartsOwn />
        </Box>
        
        <Box flex={1} width={{ xs: '100%', md: '50%' }}>
            <OffererSolicitationChartsWorkTeam />
        </Box>
    </Stack>
  )
}

export default OffererSolicitationCharts;