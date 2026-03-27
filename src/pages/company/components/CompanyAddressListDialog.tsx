import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import { Alert, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import { OffererFields } from '../../../types/offerer/offererData';
import React from 'react';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import AddressList from './addresses/AddressList';

interface CompanyAddressListDialogProps {
  open: boolean;
  company: CompanyViewDTO;
  onClose: () => void;
}

const CompanyAddressListDialog = ({
  open,
  company,
  onClose,
}: CompanyAddressListDialogProps) => {
  return (
    <Dialog fullWidth maxWidth={'sm'} open={open} onClose={onClose}>
      <BaseDialogTitle title="Direcciones de la Pyme" onClose={onClose} />
      <DialogContent>
        {company[CompanyViewDTOFields.Address] &&
        company[CompanyViewDTOFields.Address].length ? (
          <AddressList
            list={company[CompanyViewDTOFields.Address]}
            wrapperProps={{ gap: 1, width: '100%' }}
            Wrapper={Stack}
          />
        ) : (
          <Alert color={'info'} severity={'info'}>
            Al parecer no se han encontrado domicilios cargados.
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyAddressListDialog;
