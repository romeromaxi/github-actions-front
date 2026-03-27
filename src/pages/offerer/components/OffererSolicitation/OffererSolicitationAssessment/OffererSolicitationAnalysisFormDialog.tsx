import { Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SolicitationViewDTO } from 'types/solicitations/solicitationData';
import { HttpSolicitationAnalysis } from 'http/solicitations/httpSolicitationAnalysis';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import OffererSolicitationAnalysisFormDialogSent from './OffererSolicitationAnalysisFormDialogSent';
import OffererSolicitationAnalysisFormDialogResponse from './OffererSolicitationAnalysisFormDialogResponse';
import { HttpSolicitationDocumentationAnalysis } from '../../../../../http/solicitations/httpSolicitationDocumentationAnalysis';
import {
  SolicitationAptitudeFormViewDTO,
  SolicitationDocumentationAnalysisViewDTO,
  SolicitationDocumentationAnalysisViewDTOFields,
} from '../../../../../types/solicitations/solicitationDocumentationAnalysisData';
import { OffererSolicitationAnalysisFormDataRequest } from '../../../../../types/offerer/offererSolicitationData';
import {
  SolicitationAnalysisViewDTO,
  SolicitationAnalysisViewDTOFields,
} from '../../../../../types/solicitations/solicitationAnalysisData';

interface OffererSolicitationAnalysisFormDialogProps {
  open: boolean;
  suitable?: boolean;
  solicitation: SolicitationViewDTO;
  justView: boolean;
  prevMessage?: string;
  onSave?: (messages: OffererSolicitationAnalysisFormDataRequest[]) => void;
  onClose: () => void;
  dataAnalysis?: SolicitationAnalysisViewDTO;
  docAnalysis?: SolicitationDocumentationAnalysisViewDTO;
  data?: boolean;
}

const OffererSolicitationAnalysisFormDialog = ({
  open,
  suitable,
  solicitation,
  justView,
  prevMessage,
  onSave,
  onClose,
  dataAnalysis,
  docAnalysis,
  data = false,
}: OffererSolicitationAnalysisFormDialogProps) => {
  const [formContent, setFormContent] =
    useState<SolicitationAptitudeFormViewDTO>();

  useEffect(() => {
    if (open) {
      if (suitable) {
        data
          ? HttpSolicitationAnalysis.getSuitableForm(
              solicitation[EntityWithIdAndDescriptionFields.Id],
            ).then((res) => setFormContent(res))
          : HttpSolicitationDocumentationAnalysis.getSuitableForm(
              solicitation[EntityWithIdAndDescriptionFields.Id],
            ).then((res) => setFormContent(res));
      } else {
        data
          ? HttpSolicitationAnalysis.getNotSuitableForm(
              solicitation[EntityWithIdAndDescriptionFields.Id],
            ).then((res) => setFormContent(res))
          : HttpSolicitationDocumentationAnalysis.getNotSuitableForm(
              solicitation[EntityWithIdAndDescriptionFields.Id],
            ).then((res) => setFormContent(res));
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) setFormContent(undefined);
  }, [open, suitable]);

  return (
    <Dialog open={open} maxWidth={'sm'} fullWidth onClose={onClose}>
      {justView && prevMessage ? (
        <OffererSolicitationAnalysisFormDialogSent
          message={prevMessage}
          onClose={onClose}
          sentDate={
            dataAnalysis
              ? dataAnalysis[SolicitationAnalysisViewDTOFields.AptitudeDate]
              : docAnalysis?.[
                  SolicitationDocumentationAnalysisViewDTOFields.AptitudeDate
                ]
          }
        />
      ) : (
        <OffererSolicitationAnalysisFormDialogResponse
          open={open}
          content={formContent}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};

export default OffererSolicitationAnalysisFormDialog;
