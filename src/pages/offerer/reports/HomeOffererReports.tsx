import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {OffererContext} from '../components/OffererContextProvider';
import {Alert, Box, Grid, Skeleton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {HttpOffererReports} from "../../../http/offerer/httpOffererReports";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {OffererReportSummary, OffererReportSummaryFields} from "../../../types/offerer/offererReports";
import {ReportTypes} from "../../../types/offerer/offererReportsEnums";
import {INavTab, NavsTabHorizontal} from "../../../components/navs/NavsTab";
import {ReportsEmbeddedWithOfferer} from './components/ReportsEmbedded';
import ReportsControlPanel from "./components/ReportsControlPanel";
import ReportsSituationByTeam from './components/ReportsSituationByTeam';
import ReportsSolicitations from './components/ReportsSolicitations';
import ReportsSolicitationAnalytics from "./components/ReportsSolicitationAnalytics";

const reportMap: Record<string, React.ReactElement> = {
  '/offerer/reports/control-panel': <ReportsControlPanel />,
  '/offerer/reports/solicitations': <ReportsSolicitations />,
  '/offerer/reports/solicitations-analysis': <ReportsSolicitationAnalytics />,
  '/offerer/reports/solicitations-by-team': <ReportsSituationByTeam />
}

function HomeOffererReports() {
  const offerer = useContext(OffererContext);
  const navigate = useNavigate()
  const [reports, setReports] = useState<OffererReportSummary[]>()
  
  useEffect(() => {
      HttpOffererReports.getSummaryReports(offerer[EntityWithIdFields.Id]).then(setReports)
  }, [offerer, navigate]);
  
  const lstTabsReports: INavTab[] | null = React.useMemo(() => {
    if (!reports) return null;
    
    if (reports.length === 0) return [];
    
    return reports.map((r, index) => {

      const content = r[OffererReportSummaryFields.ReportTypeCode] === ReportTypes.LookerStudio ?
          <ReportsEmbeddedWithOfferer reportId={r[EntityWithIdFields.Id]} />
          : reportMap[r[OffererReportSummaryFields.ReportUrl] || ''] || <Skeleton />;

      return {
        label: r[OffererReportSummaryFields.ReportTitle],
        content: content,
        default: index === 0
      }
    });
  }, [reports])
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {
          lstTabsReports ? 
              lstTabsReports.length > 0 ? 
                  <Box sx={{  width: '100%', 
                    '& > div > div ': { paddingLeft: '40px !important' }, 
                    '& > div > div > div': { width: '100% !important' },
                  }}>
                    <NavsTabHorizontal lstTabs={[{ tabList: lstTabsReports }]} />
                  </Box>
                  :
                  <Alert>No hay reportes gráficos para ver por el momento</Alert>
              :
              <Skeleton sx={{width: '100% !important', height: '20px !important'}}/>
        }
      </Grid>
    </Grid>
  );
}

export default HomeOffererReports;
