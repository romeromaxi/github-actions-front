import React from 'react';
import {
  Grid,
} from '@mui/material';
import {NavsTabVertical} from "../../../components/navs/NavsTab";
import OffererWorkTeams from "../workTeams/OffererWorkTeams";
import OffererTabVerticalHeader from "../components/OffererTabVerticalHeader";
import {HomeOffererClientPortfolio} from "../../../routes/OffererComponents";
import HomeOffererSolicitations from "./HomeOffererSolicitations";

// @ts-ignore

//const listMenu = ListMenuTypeByLayoutType[MenuLayoutType.OffererHome].filter(x => x.code !== MenuCode.OffererHome);

interface HomeOffererUserProps {
  offererId: number;
}
function HomeOffererUser({ offererId }: HomeOffererUserProps) {
    
  return (
    <Grid container spacing={3}>
      <NavsTabVertical lstTabs={[
        {tabList: [
            {
              label: 'Mis Equipos de Trabajo',
              content: <OffererWorkTeams offererId={offererId}/>,
              default: true
            },
            {
                label: 'Solicitudes',
                content: <HomeOffererSolicitations />,
                queryParam: 'solicitations'
            },
            {
                label: 'Búsquedas por CUIT',
                content: <HomeOffererClientPortfolio />,
                queryParam: 'clientPortfolio'
            },
          ]}
      ]}
                       tabSize={3}
                       header={<OffererTabVerticalHeader offererId={offererId} />}
      />
    </Grid>
  );
}

export default HomeOffererUser;
