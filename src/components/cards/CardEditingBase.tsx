import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Stack,
} from '@mui/material';
import CardBaseStyles from './CardBase.styles';
import { useFormContext } from 'react-hook-form';
import { EditIconButton } from '../buttons/Buttons';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface CardBaseProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  detailContent: React.ReactNode;
  editContent: React.ReactNode;
  onCloseEdit: () => void;
  onSubmitEdit: (data: any) => void;
  subheader?: React.ReactNode;
  actions?: React.ReactNode;
  startEditing?: boolean;
  hideEditButton?: boolean;
}

function CardEditingBase(props: CardBaseProps) {
  const classes = CardBaseStyles();
  const methods = useFormContext();

  const [isEditing, setEditing] = useState<boolean>(!!props.startEditing);

  const onShowEditing = () => setEditing(true);

  const onCloseEditing = () => setEditing(false);

  const onSubmit = (data: any) => {
    props.onSubmitEdit(data);
    onCloseEditing();
  };

  const onClose = () => {
    props.onCloseEdit();
    onCloseEditing();
  };

  return (
    <Card className={classes.cardWithShadow}>
      <CardHeader
        title={props.title}
        avatar={props.icon}
        subheader={props.subheader}
        action={
          <Stack
            direction="row"
            gap={1}
            alignItems={'center'}
            id={'hideInPdf3'}
          >
            {!isEditing && props?.actions}
            {!isEditing && !props.hideEditButton && (
              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={onShowEditing}
              >
                Editar
              </Button>
            )}
          </Stack>
        }
        sx={{ flexWrap: 'nowrap' }}
      />

      <CardContent>
        <Collapse in={isEditing}>{isEditing && props.editContent}</Collapse>

        <Collapse in={!isEditing}>{!isEditing && props.detailContent}</Collapse>
      </CardContent>

      {isEditing && (
        <CardActions sx={{ marginTop: 2 }}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={methods.handleSubmit(onSubmit)}>
            Guardar
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default CardEditingBase;
