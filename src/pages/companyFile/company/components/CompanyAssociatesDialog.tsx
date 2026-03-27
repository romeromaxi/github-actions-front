import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { DefaultStylesButton } from '../../../../components/buttons/Buttons';
import React from 'react';
import {
  CompanyPersonRelationship,
  CompanyPersonRelationshipFields,
} from '../../../../types/company/companySocietyData';
import { stringFormatter } from '../../../../util/formatters/stringFormatter';
import { CompanyViewDTOFields } from '../../../../types/company/companyData';

interface CompanyAssociatesDialogProps {
  open: boolean;
  data: CompanyPersonRelationship[];
  onClose: () => void;
}

const CompanyAssociatesDialog = (props: CompanyAssociatesDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <BaseDialogTitle title="Socios" onClose={props.onClose} />

      <DialogContent>
        <Grid container item xs={12}>
          <Grid item xs={3}>
            <Typography
              fontSize={16}
              fontWeight={600}
              textAlign={'center'}
              color={'#7e8299'}
            >
              CUIT
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              fontSize={16}
              fontWeight={600}
              textAlign={'center'}
              color={'#7e8299'}
            >
              Nombre y apellido
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              fontSize={16}
              fontWeight={600}
              textAlign={'center'}
              color={'#7e8299'}
            >
              Tipo de relación
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography
              fontSize={16}
              fontWeight={600}
              textAlign={'center'}
              color={'#7e8299'}
            >
              % Participación
            </Typography>
          </Grid>
          <Grid item xs={12} pt={1}>
            <Divider />
          </Grid>
          {props.data.map((associate) => (
            <Grid container spacing={2} alignItems={'center'} pt={1} pb={1}>
              <Grid item xs={3}>
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  {stringFormatter.formatCuit(
                    associate[CompanyViewDTOFields.CUIT],
                  )}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  {associate[CompanyPersonRelationshipFields.LegalName]}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  {
                    associate[
                      CompanyPersonRelationshipFields.PersonRelationshipTypeDesc
                    ]
                  }
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  {
                    associate[
                      CompanyPersonRelationshipFields.ParticipationPercent
                    ]
                  }{' '}
                  %
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <DefaultStylesButton color="secondary" onClick={props.onClose}>
          Cerrar
        </DefaultStylesButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyAssociatesDialog;
