import BaseDialogTitle from '../../../../../components/dialog/BaseDialogTitle';
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ControlledTextFieldFilled } from '../../../../../components/forms';
import {
  SolicitationAptitudeFormViewDTO,
  SolicitationAptitudeFormViewDTOFields,
} from '../../../../../types/solicitations/solicitationDocumentationAnalysisData';
import {
  OffererSolicitationAnalysisFormData,
  OffererSolicitationAnalysisFormDataFields,
  OffererSolicitationAnalysisFormDataRequest,
  OffererSolicitationAnalysisFormDataRequestFields,
} from '../../../../../types/offerer/offererSolicitationData';
import {Skeleton} from "@mui/lab";

interface OffererSolicitationAnalysisFormDialogResponseProps {
  open: boolean;
  content: SolicitationAptitudeFormViewDTO | undefined;
  onSave?: (messages: OffererSolicitationAnalysisFormDataRequest[]) => void;
  onClose: () => void;
  initialValues?: OffererSolicitationAnalysisFormDataRequest[];
  textConfirm?: string
}

const OffererSolicitationAnalysisFormDialogResponse = ({
  open,
  content,
  onSave,
  onClose,
  initialValues, textConfirm
}: OffererSolicitationAnalysisFormDialogResponseProps) => {
  const { control, handleSubmit } =
    useForm<OffererSolicitationAnalysisFormData>({
      defaultValues: {
        [OffererSolicitationAnalysisFormDataFields.Messages]: initialValues ?? undefined,
      }
    });

  const { remove } = useFieldArray({
    control,
    name: OffererSolicitationAnalysisFormDataFields.Messages,
  });

  const onHandleSubmit = (data: OffererSolicitationAnalysisFormData) => {
    onSave && onSave(data[OffererSolicitationAnalysisFormDataFields.Messages]);
  };

  useEffect(() => {
    if (open) remove();
  }, [open]);

  return (
    <>
      <BaseDialogTitle title={'Comunicación de recepción'} onClose={onClose} />
      
      <DialogContent>
        <Grid container>
          <Grid item xs={12} container>
            {
              (!content) &&
                <Grid item xs={12}>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </Grid>
            }
            
            {content &&
              content[SolicitationAptitudeFormViewDTOFields.FormTexts]
                .length !== 0 &&
              content[SolicitationAptitudeFormViewDTOFields.FormTexts].map(
                (strContent, idx) => (
                  <Grid item xs={12} container key={idx}>
                    <Grid item xs={12}>
                      <div dangerouslySetInnerHTML={{ __html: strContent }} />
                    </Grid>
                    {idx !==
                      content[SolicitationAptitudeFormViewDTOFields.FormTexts]
                        .length -
                        1 && (
                      <Grid item xs={12}>
                        <Typography fontSize={10}>
                          Completar mensaje que será leído por la empresa:
                        </Typography>
                        <ControlledTextFieldFilled
                          control={control}
                          name={`${OffererSolicitationAnalysisFormDataFields.Messages}.${idx}.${OffererSolicitationAnalysisFormDataRequestFields.Message}`}
                          multiline
                          id="outlined-multiline-static"
                          rows={2}
                        />
                      </Grid>
                    )}
                    {content[
                      SolicitationAptitudeFormViewDTOFields
                        .HasFinalAdditionalField
                    ] &&
                      idx ===
                        content[
                          SolicitationAptitudeFormViewDTOFields.FormTexts
                        ].length -
                          1 && (
                        <Grid item xs={12}>
                          <Typography fontSize={10}>
                            Completar mensaje que será leído por la empresa:
                          </Typography>
                          <ControlledTextFieldFilled
                            control={control}
                            name={`${OffererSolicitationAnalysisFormDataFields.Messages}.${idx}.${OffererSolicitationAnalysisFormDataRequestFields.Message}`}
                            multiline
                            id="outlined-multiline-static"
                            rows={2}
                          />
                        </Grid>
                      )}
                  </Grid>
                ),
              )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'}
                color={'primary'}
                onClick={handleSubmit(onHandleSubmit)}
        >
          {textConfirm || "Enviar para aprobación"}
        </Button>
      </DialogActions>
    </>
  );
};

export default OffererSolicitationAnalysisFormDialogResponse;
