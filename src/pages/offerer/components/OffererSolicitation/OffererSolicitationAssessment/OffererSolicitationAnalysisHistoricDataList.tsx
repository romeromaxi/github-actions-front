import {
  SolicitationAnalysisHistoricViewDTO,
  SolicitationAnalysisHistoricViewDTOFields,
} from '../../../../../types/solicitations/solicitationAnalysisData';
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
import OffererSolicitationAnalysisFormDialog from './OffererSolicitationAnalysisFormDialog';
import { SolicitationViewDTO } from '../../../../../types/solicitations/solicitationData';
import OffererSolicitationAnalysisHistoricDataDetail from './OffererSolicitationAnalyisisHistoricDataDetail';
import {TypographyBase} from "../../../../../components/misc/TypographyBase";

interface OffererSolicitationAnalysisHistoricDataListProps {
  solicitation: SolicitationViewDTO;
  dataList: SolicitationAnalysisHistoricViewDTO[];
  lastValidation: boolean;
}

const OffererSolicitationAnalysisHistoricDataList = ({
  solicitation,
  dataList,
  lastValidation,
}: OffererSolicitationAnalysisHistoricDataListProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>();

  const onOpen = (message: string) => {
    setMsg(message);
    setOpen(true);
  };

  const validHistoricAnalysis = (
    analysis: SolicitationAnalysisHistoricViewDTO,
    firstItem: boolean,
  ) => {
    if (
      analysis[
        SolicitationAnalysisHistoricViewDTOFields.SolicitationApprovalResultCode
      ] === SolicitationApprovalResultType.Pendant ||
      (firstItem && lastValidation)
    ) {
      return false;
    }

    return true;
  };

  return (
    <Grid container>
      {validHistoricAnalysis(dataList[0], dataList?.length === 1) && (
        <TypographyBase variant={'subtitle1'} fontWeight={500}>
          Historial de Aprobaciones
        </TypographyBase>
      )}
      {dataList?.map(
        (prevAnalysis, idx) =>
          validHistoricAnalysis(prevAnalysis, idx === 0) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <TypographyBase variant={'label'} fontWeight={500}>
                  {`Análisis del ${dateFormatter.toLongDate(prevAnalysis[SolicitationAnalysisHistoricViewDTOFields.ApprovalResultDate])}`}
                </TypographyBase>
              </AccordionSummary>
              <AccordionDetails>
                <OffererSolicitationAnalysisHistoricDataDetail
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

export default OffererSolicitationAnalysisHistoricDataList;
