import React from 'react';
import {SolicitationViewDTO} from '../../../types/solicitations/solicitationData';
import {Grid} from '@mui/material';
import CompanySolicitationAssessmentCenterPanel from './CompanySolicitationAssessmentCenterPanel';
import SolicitationLeftPanelComponent from "../../../components/solicitations/leftPanel/SolicitationLeftPanelComponent";
import {ProfilePersonTypes} from "../../../types/person/personData";
import SolicitationRightPanelComponent
    from "../../../components/solicitations/rightPanel/SolicitationRightPanelComponent";

interface CompanySolicitationAssessmentProps {
  solicitation: SolicitationViewDTO;
}

function CompanySolicitationAssessment({
  solicitation,
}: CompanySolicitationAssessmentProps) {
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={3}>
        <SolicitationLeftPanelComponent variant={ProfilePersonTypes.Company} solicitation={solicitation} />
      </Grid>
      <Grid item xs={6}>
        <CompanySolicitationAssessmentCenterPanel solicitation={solicitation} />
      </Grid>
      <Grid item xs={3}>
        <SolicitationRightPanelComponent variant={ProfilePersonTypes.Company} solicitation={solicitation} />
      </Grid>
    </Grid>
  );
}

export default CompanySolicitationAssessment;
