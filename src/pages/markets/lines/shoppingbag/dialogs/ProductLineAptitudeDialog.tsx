import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { ControlledTextFieldFilled } from 'components/forms';
import {
  SolicitationRequirementFields,
  SolicitationRequirementInsert,
} from 'types/solicitations/solicitationData';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { RequiredNotEmptyStringSchema } from 'util/validation/validationSchemas';
import { HttpSolicitation } from 'http/index';
import { BaseResponseFields } from 'types/baseEntities';
import { LoaderBlockUI } from 'components/loader';
import { CloseButton, SaveButton } from 'components/buttons/Buttons';

interface ProductLineAptitudeDialogProps {
  open: boolean;
  solicitationId: number;
  onClose: () => void;
  onSubmit: () => void;
  disableField?: boolean;
}

enum AptitudeFormFields {
  Requirements = 'requirements',
}

interface AptitudeForm {
  [AptitudeFormFields.Requirements]: SolicitationRequirementInsert[];
}

function ProductLineAptitudeDialog(props: ProductLineAptitudeDialogProps) {
  const [isLoading, setLoading] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    [AptitudeFormFields.Requirements]: yup.array().of(
      yup.object().shape({
        [SolicitationRequirementFields.RequirementResponse]:
          RequiredNotEmptyStringSchema,
      }),
    ),
  });

  const { control, handleSubmit, reset, watch } = useForm<AptitudeForm>({
    resolver: yupResolver(validationSchema),
  });
  const { fields } = useFieldArray({
    control: control,
    name: AptitudeFormFields.Requirements,
  });

  const onCloseDialog = () => {
    reset();
    props.onClose();
  };

  const onSave = (data: AptitudeForm) => {
    setLoading(true);
    HttpSolicitation.updateSolicitationRequirements(
      props.solicitationId,
      data[AptitudeFormFields.Requirements],
    )
      .then((response) => {
        if (!response[BaseResponseFields.HasError]) {
          props.onSubmit();
          reset();
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (props.open && props.solicitationId) {
      HttpSolicitation.getSolicitationRequirements(props.solicitationId).then(
        (response) => {
          reset({
            [AptitudeFormFields.Requirements]: response,
          });
        },
      );
    }
  }, [props.open, props.solicitationId]);

  return (
    <>
      <Dialog
        open={props.open}
        maxWidth={'sm'}
        fullWidth
        onClose={onCloseDialog}
      >
        <DialogTitle>Completar datos</DialogTitle>
        <form onSubmit={handleSubmit(onSave)}>
          <DialogContent>
            <DialogContentText>
              Complete los siguientes datos para poder solicitar la linea.
            </DialogContentText>
            <Stack
              direction={'column'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Grid container xs={12} spacing={2}>
                {fields.map((field, idx) => (
                  <Grid item xs={6} key={`requirementList_${field.id}`}>
                    <Stack direction={'row'}>
                      <ControlledTextFieldFilled
                        disabled={props.disableField}
                        margin="dense"
                        id={field.id}
                        name={`${AptitudeFormFields.Requirements}.${idx}.${[SolicitationRequirementFields.RequirementResponse]}`}
                        label={
                          watch(`${AptitudeFormFields.Requirements}.${idx}`)[
                            SolicitationRequirementFields.RequirementDesc
                          ]
                        }
                        type="text"
                        variant="standard"
                        control={control}
                        required
                      />
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <CloseButton onClick={onCloseDialog}>Cancelar</CloseButton>
            <SaveButton type={'submit'}>Guardar</SaveButton>
          </DialogActions>
        </form>
      </Dialog>

      {isLoading && <LoaderBlockUI />}
    </>
  );
}

export default ProductLineAptitudeDialog;
