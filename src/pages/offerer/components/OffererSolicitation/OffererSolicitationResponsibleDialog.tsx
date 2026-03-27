import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, Grid, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
} from 'types/baseEntities';
import { HttpSolicitation } from 'http/index';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { Skeleton } from '@mui/lab';

interface OffererSolicitationResponsibleDialogProps {
  open: boolean;
  solicitationId: number;
  offererId: number;
  onClose: () => void;
  onSubmit: (responsibleId: number) => void;
}

const OffererSolicitationResponsibleDialog = (
  props: OffererSolicitationResponsibleDialogProps,
) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [possibleResponsible, setPossibleResponsible] =
    useState<EntityWithIdAndDescription[]>();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  const handleAssign = () =>
    props.onSubmit(
      possibleResponsible?.[selectedIndex][
        EntityWithIdAndDescriptionFields.Id
      ] ?? 0,
    );

  useEffect(() => {
    if (props.open) {
      HttpSolicitation.getPossibleResponsibleUsersByOffererId(
        props.offererId,
      ).then(setPossibleResponsible);
    }
  }, [props.open]);

  return (
    <Dialog open={props.open} maxWidth={'sm'} fullWidth onClose={props.onClose}>
      <BaseDialogTitle
        onClose={props.onClose}
        title={`Asignar responsable comercial de la solicitud #${props.solicitationId}`}
      />
      <DialogContent>
        <Grid xs={12}>
          <Stack
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={4}
            mt={2}
          >
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <List component="nav" aria-label="secondary mailbox folder">
                {possibleResponsible ? (
                  possibleResponsible.map((user, idx) => (
                    <Grid item xs={12} key={`companyList_${idx}`}>
                      <ListItemButton
                        selected={selectedIndex === idx}
                        onClick={(event) => handleListItemClick(event, idx)}
                      >
                        <ListItemText
                          primary={`${user[EntityWithIdAndDescriptionFields.Description]}`}
                        />
                      </ListItemButton>
                    </Grid>
                  ))
                ) : (
                  <Skeleton />
                )}
              </List>
            </Box>
            <Button variant={'contained'} onClick={handleAssign}>
              Continuar
            </Button>
          </Stack>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OffererSolicitationResponsibleDialog;
