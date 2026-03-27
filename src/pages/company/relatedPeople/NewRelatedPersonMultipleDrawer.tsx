import React, {useEffect, useState} from 'react';

import {Stack} from '@mui/material';
import { useAction } from 'hooks/useAction';
import NewRelatedPersonMultipleForm from './NewRelatedPersonMultipleForm';
import DrawerBase from "../../../components/misc/DrawerBase";
import {SendButton} from "../../../components/buttons/Buttons";

interface NewRelatedPersonMultipleDrawerProps {
  show: boolean;
  onCloseDrawer: () => void;
  onFinishProcess: (personId: number) => void;
  legalPerson?: boolean;
}

function NewRelatedPersonMultipleDrawer(
  props: NewRelatedPersonMultipleDrawerProps,
) {
  const [disabledSend, setDisabledSend] = useState<boolean>(true)
  const { snackbarSuccess } = useAction();

  const onHandleClose = () => {
    props.onCloseDrawer();
  };

  const onHandleSubmitClose = (personId: number) => {
    props.onFinishProcess(personId);

    snackbarSuccess('La relación se ha creado con éxito');
  };

    useEffect(() => {
        if (props.show) setDisabledSend(true)
    }, [props.show]);

  return (
        <DrawerBase show={props.show}
                    onCloseDrawer={onHandleClose}
                    title={'Nueva persona relacionada'}
                    aboveDialogs
                    action={
                        <SendButton type='submit' form='form-new-related-person'
                                    disabled={disabledSend} 
                                    onClick={(e) => e.stopPropagation()}>
                            Enviar
                        </SendButton>}
        >
            <Stack spacing={2}>
              {props.show && (
                <React.Fragment>
                  <NewRelatedPersonMultipleForm
                    legalPerson={props.legalPerson}
                    onChangeDisable={() => setDisabledSend(!disabledSend)}
                    onSubmit={onHandleSubmitClose}
                  />
                </React.Fragment>
              )}
            </Stack>
        </DrawerBase>
  );
}

export default NewRelatedPersonMultipleDrawer;
