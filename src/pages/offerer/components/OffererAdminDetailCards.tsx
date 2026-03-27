import {Button} from '@mui/material';
import React, {useContext} from "react";
import {NavsTabVertical} from "../../../components/navs/NavsTab";
import HomeOffererSummary from "../summary/HomeOffererSummary";
import HomeOffererLine from '../home/HomeOffererLine';
import HomeOffererReports from "../reports/HomeOffererReports";
import HomeOffererSolicitations from "../home/HomeOffererSolicitations";
import {HomeOffererClientPortfolio, HomeOffererTemplates, OffererIntegration} from "../../../routes/OffererComponents";
import HomeOffererDocumentation from "../home/HomeOffererDocumentation";
import {useNavigate} from "react-router-dom";
import {OffererContext} from "./OffererContextProvider";
import {EntityWithIdFields} from "../../../types/baseEntities";
import OffererTabVerticalHeader from "./OffererTabVerticalHeader";

function OffererAdminDetailCards() {
    const navigate = useNavigate();
    const offerer = useContext(OffererContext);
    const offererId = offerer[EntityWithIdFields.Id];

    return (
    <React.Fragment>
        <NavsTabVertical
            tabSize={3}
            lstTabs={[
                {tabList: [
                        {
                            label: 'ABM de usuarios',
                            content: <HomeOffererSummary/>,
                            default: true,
                            queryParam: 'usersSummary'
                        },
                        {
                            label: 'ABM de líneas',
                            content: <HomeOffererLine />,
                            queryParam: 'lines'
                        },
                        {
                            label: 'Reportes',
                            content: <HomeOffererReports />,
                            queryParam: 'reports'
                        },
                        {
                            label: 'Solicitudes',
                            content: <HomeOffererSolicitations />,
                            queryParam: 'solicitations'
                        },
                        {
                            label: 'Base por CUITs',
                            content: <HomeOffererClientPortfolio />,
                            queryParam: 'clientPortfolio'
                        },
                        {
                            label: 'Biblioteca de Archivos',
                            content: <HomeOffererDocumentation />,
                            queryParam: 'documentation'
                        },
                        {
                            label: 'Integración',
                            content: <OffererIntegration />,
                            queryParam: 'integration'
                        },
                        {
                            label: 'Listado de Documentos',
                            content: <HomeOffererTemplates />,
                            queryParam: 'templates'
                        }
                    ]}
            ]}
            header={<OffererTabVerticalHeader offererId={offererId} />}
        >
            <Button
                variant={'outlined'}
                color={'secondary'}
                size={'small'}
                onClick={() => navigate('/market/landing')}
            >
                Ingresá a la tienda
            </Button>
        </NavsTabVertical>
    </React.Fragment>
  );
}


export default OffererAdminDetailCards;
