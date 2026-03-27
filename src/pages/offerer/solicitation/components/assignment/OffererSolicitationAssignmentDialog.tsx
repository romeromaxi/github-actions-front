import React from "react";
import {useForm} from "react-hook-form";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, Stack} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {ControlledCheckBox} from "components/forms";

interface OffererSolicitationAssignmentDialogProps extends DialogProps {
  title: string,
  onClose: () => void,
  onConfirm: (stage: boolean, commercial: boolean) => void
}

enum OffererSolicitationAssignmentDialogFormFields {
  Stage = 'stage',
  Commercial = 'commercial',
}

interface OffererSolicitationAssignmentDialogForm {
  [OffererSolicitationAssignmentDialogFormFields.Stage]: boolean,
  [OffererSolicitationAssignmentDialogFormFields.Commercial]: boolean
}

function OffererSolicitationAssignmentDialog(props: OffererSolicitationAssignmentDialogProps) {
  const methods = useForm<OffererSolicitationAssignmentDialogForm>({
    defaultValues: {
      [OffererSolicitationAssignmentDialogFormFields.Stage]: false,
      [OffererSolicitationAssignmentDialogFormFields.Commercial]: false
    }
  });
  
  const onSubmit = (data: OffererSolicitationAssignmentDialogForm) => 
    props.onConfirm(
      data[OffererSolicitationAssignmentDialogFormFields.Stage], 
      data[OffererSolicitationAssignmentDialogFormFields.Commercial]
    );
  
  return (
    <Dialog {...props} fullWidth>
      <BaseDialogTitle onClose={props.onClose} title={props.title} />

      <DialogContent>
        <DialogContentText>¿Cómo te querés asignar la solicitud?</DialogContentText>
        
        <Stack pl={2} mt={2} spacing={3}>
          <ControlledCheckBox
            label={'Asignarme como responsable de la etapa'}
            name={OffererSolicitationAssignmentDialogFormFields.Stage}
            control={methods.control}
          />
          
          <ControlledCheckBox
            label={'Asignarme como responsable comercial'}
            name={OffererSolicitationAssignmentDialogFormFields.Commercial}
            control={methods.control}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{display: 'flex', flexDirection: 'row'}}>
        <Button size={'medium'} onClick={props.onClose}>
          Cancelar
        </Button>

        <Button size={'medium'} variant={'contained'} onClick={methods.handleSubmit(onSubmit)}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OffererSolicitationAssignmentDialog;