import {
  SolicitationDocumentationAnalysisHistoricViewDTO,
  SolicitationDocumentationAnalysisHistoricViewDTOFields,
} from '../../../../../types/solicitations/solicitationDocumentationAnalysisData';
import { SolicitationApprovalResultType } from '../../../../../types/solicitations/solicitationEnums';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { dateFormatter } from '../../../../../util/formatters/dateFormatter';
import React, { useState } from 'react';
import { SolicitationViewDTO } from '../../../../../types/solicitations/solicitationData';
import OffererSolicitationAnalysisFormDialog from './OffererSolicitationAnalysisFormDialog';
import OffererSolicitationAnalysisHistoricDocDetail from './OffererSolicitationAnalysisHistoricDocDetail';
import {TypographyBase} from "../../../../../components/misc/TypographyBase";
import {SolicitationAnalysisHistoricViewDTOFields} from "../../../../../types/solicitations/solicitationAnalysisData";

interface OffererSolicitationAnalysisHistoricDocListProps {
  solicitation: SolicitationViewDTO;
  docList: SolicitationDocumentationAnalysisHistoricViewDTO[];
  lastValidation: boolean;
}

const OffererSolicitationAnalysisHistoricDocList = ({
  solicitation,
  docList,
  lastValidation,
}: OffererSolicitationAnalysisHistoricDocListProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>();

  const onOpen = (message: string) => {
    setMsg(message);
    setOpen(true);
  };

  const validHistoricAnalysis = (
    analysis: SolicitationDocumentationAnalysisHistoricViewDTO,
    firstItem: boolean,
  ) => {
    if (
      analysis[
        SolicitationDocumentationAnalysisHistoricViewDTOFields
          .SolicitationApprovalResultCode
      ] === SolicitationApprovalResultType.Pendant ||
      (firstItem && lastValidation)
    ) {
      return false;
    }

    return true;
  };

  return (
    <Grid item xs={12}>
      {validHistoricAnalysis(docList[0], docList?.length === 1) && (
        <TypographyBase variant={'subtitle1'} fontWeight={500}>
          Historial de Aprobaciones
        </TypographyBase>
      )}
      {docList?.map(
        (prevAnalysis, idx) =>
          validHistoricAnalysis(prevAnalysis, idx === 0) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <TypographyBase variant={'label'} fontWeight={500}>
                  {`Análisis del ${dateFormatter.toLongDate(prevAnalysis[SolicitationAnalysisHistoricViewDTOFields.ApprovalResultDate])}`}
                </TypographyBase>
              </AccordionSummary>
              <AccordionDetails>
                <OffererSolicitationAnalysisHistoricDocDetail
                  analysis={prevAnalysis}
                  handleOpen={onOpen}
                />
              </AccordionDetails>
            </Accordion>
          ),
      )}
      {msg && (
        <OffererSolicitationAnalysisFormDialog
          open={open}
          solicitation={solicitation}
          justView
          prevMessage={msg}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </Grid>
  );
};

export default OffererSolicitationAnalysisHistoricDocList;
