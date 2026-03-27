import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Divider, Grid } from '@mui/material';

import { EditIconButton } from 'components/buttons/Buttons';
import DisabledTextField from 'components/forms/DisabledTextField';
import AddressForm from './AddressForm';

import { AddressTypes } from 'types/general/generalEnums';
import { EntityAddressFields } from 'types/general/generalReferentialData';

import { AddressFormatter } from 'util/formatters/addressFormatter';

interface AddressFormMangerProps {
  addressFieldName: string;
  onDelete: () => void;
  fixType?: boolean;
}

function AddressFormManager({
  addressFieldName,
  onDelete,
  fixType,
}: AddressFormMangerProps) {
  const { watch } = useFormContext();
  const watchAddress = watch(addressFieldName);

  const [showForm, setShowForm] = React.useState(
    !watchAddress[EntityAddressFields.AddressTypeCode],
  );

  const type: AddressTypes = watchAddress[EntityAddressFields.AddressTypeCode];
  return (
    <>
      {!showForm && watchAddress[EntityAddressFields.AddressTypeCode] ? (
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={11}>
            <DisabledTextField
              label={AddressFormatter.getLabel(watchAddress)}
              fullWidth
              value={AddressFormatter.toFullAddress(watchAddress)}
            />
          </Grid>
          <Grid item xs={1}>
            {type !== AddressTypes.Fiscal && (
              <EditIconButton onClick={() => setShowForm(!showForm)} />
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <AddressForm
              name={addressFieldName}
              onDelete={() => {
                setShowForm(!showForm);
                onDelete();
              }}
              onSave={() => setShowForm(!showForm)}
              fixType={fixType}
            />
            <Divider sx={{ mt: 2, mb: 2 }} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default AddressFormManager;
