import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { HttpCacheConversation } from '../../../../../http/cache/httpCacheConversation';
import BaseDialogTitle from '../../../../../components/dialog/BaseDialogTitle';
import { EntityWithIdAndDescriptionFields } from '../../../../../types/baseEntities';
import { useForm } from 'react-hook-form';
import { ControlledTextFieldFilled } from '../../../../../components/forms';

interface OffererPymeNewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, type: number) => void;
}

enum OffererPymeNewChatDataFields {
  Title = 'chatTitle',
  ReasonTypeCode = 'chatReasonCode',
}

interface OffererPymeNewChatData {
  [OffererPymeNewChatDataFields.Title]: string;
  [OffererPymeNewChatDataFields.ReasonTypeCode]: number;
}

const OffererPymeNewChatDialog = ({
  open,
  onClose,
  onCreate,
}: OffererPymeNewChatDialogProps) => {
  const [possibleReasons, setPossibleReasons] =
    useState<EntityWithIdAndDescriptionFields[]>();

  const { control, reset, handleSubmit } = useForm<OffererPymeNewChatData>();

  useEffect(() => {
    HttpCacheConversation.getConversationReasons().then((res) =>
      setPossibleReasons(res),
    );
  }, []);

  useEffect(() => {
    reset({
      [OffererPymeNewChatDataFields.Title]: '',
      [OffererPymeNewChatDataFields.ReasonTypeCode]: 0,
    });
  }, [open]);

  const onSubmit = (data: OffererPymeNewChatData) => {
    const title = data[OffererPymeNewChatDataFields.Title];
    const reasonCode = data[OffererPymeNewChatDataFields.ReasonTypeCode];

    onCreate(title, reasonCode);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth={'xs'} fullWidth onClose={onClose}>
      <BaseDialogTitle title={'Iniciar nueva conversación'} onClose={onClose} />
      <DialogContent>
        <Stack spacing={3} alignItems={'center'} justifyContent={'center'}>
          <Typography
            fontSize={16}
            fontWeight={600}
            textAlign={'center'}
            color={'#A1A5B7 !important'}
          >
            Especifique el asunto y el tipo de su nueva conversación para
            continuar
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <Typography fontSize={12}>Tipo</Typography>
              <ControlledTextFieldFilled
                select
                control={control}
                options={possibleReasons}
                name={OffererPymeNewChatDataFields.ReasonTypeCode}
                disabled={!possibleReasons}
                fullWidth
              />
            </Stack>
            <Stack mt={1}>
              <Typography fontSize={12}>Asunto</Typography>
              <ControlledTextFieldFilled
                control={control}
                name={`${OffererPymeNewChatDataFields.Title}`}
                fullWidth
              />
            </Stack>
            <Stack direction={'row'} mt={2} justifyContent={'center'}>
              <Button
                variant={'contained'}
                type="submit"
                disabled={!possibleReasons}
              >
                Continuar
              </Button>
            </Stack>
          </form>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default OffererPymeNewChatDialog;
