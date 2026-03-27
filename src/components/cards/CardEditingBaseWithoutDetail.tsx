import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material';
import CardBaseStyles from './CardBase.styles';
import { useFormContext } from 'react-hook-form';
import { SaveButton } from '../buttons/Buttons';

interface CardEditingBaseWithoutDetailProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  editContent: React.ReactNode;
  onSubmitEdit: (data: any) => void;
  subheader?: React.ReactNode;
  actions?: React.ReactNode;
  spacedActions?: React.ReactNode;
  disableActions?: boolean;
}

function CardEditingBaseWithoutDetail(
  props: CardEditingBaseWithoutDetailProps,
) {
  const classes = CardBaseStyles();
  const methods = useFormContext();

  const onSubmit = (data: any) => {
    props.onSubmitEdit(data);
  };

  return (
    <Card className={classes.cardWithShadow}>
        {
            !props.spacedActions &&
            <CardHeader
              className={classes.cardHeader}
              title={props.title}
              subheader={props.subheader}
              action={
                <Stack direction="row" spacing={2}>
                  {props?.actions}
                  {props?.icon}
                </Stack>
              }
              sx={{ flexWrap: 'nowrap', alignItems: 'center' }}
            />
        }
      <CardContent>
          <Stack spacing={2}>
              {props.spacedActions && props.spacedActions}
              {props.editContent}
          </Stack>
      </CardContent>
      <CardActions>
        <SaveButton
          variant="contained"
          onClick={methods.handleSubmit(onSubmit)}
          size={'small'}
          disabled={props.disableActions}
        >
          Guardar
        </SaveButton>
      </CardActions>
    </Card>
  );
}

export default CardEditingBaseWithoutDetail;
