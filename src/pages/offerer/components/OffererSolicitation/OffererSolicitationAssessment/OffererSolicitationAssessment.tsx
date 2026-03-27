import {Grid} from '@mui/material';
import OffererSolicitationAssessmentSectionNavs from './OffererSolicitationAssessmentSectionNavs';
import {SolicitationViewDTO} from '../../../../../types/solicitations/solicitationData';
import SolicitationLeftPanelComponent
    from "../../../../../components/solicitations/leftPanel/SolicitationLeftPanelComponent";
import {ProfilePersonTypes} from "../../../../../types/person/personData";
import SolicitationRightPanelComponent
    from "../../../../../components/solicitations/rightPanel/SolicitationRightPanelComponent";

interface OffererSolicitationAssessmentProps {
  solicitation: SolicitationViewDTO;
  data?: boolean;
}

const OffererSolicitationAssessment = ({
  solicitation,
  data,
}: OffererSolicitationAssessmentProps) => {
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={3}>
        <SolicitationLeftPanelComponent variant={ProfilePersonTypes.Offerer} solicitation={solicitation} />
      </Grid>
      <Grid item xs={6}>
        <OffererSolicitationAssessmentSectionNavs
          solicitation={solicitation}
          data={data}
        />
      </Grid>
      <Grid item xs={3}>
        <SolicitationRightPanelComponent variant={ProfilePersonTypes.Offerer} solicitation={solicitation} />
      </Grid>
    </Grid>
  );
};

export default OffererSolicitationAssessment;
