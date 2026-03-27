import React from 'react';
import {
  EntityAddress,
  EntityAddressFields,
} from '../../../../types/general/generalReferentialData';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { AddressFormatter } from '../../../../util/formatters/addressFormatter';
import addressListStyles from './AddressList.styles';

interface AddressBoxProps {
  address: EntityAddress;
}

function AddressBox({ address }: AddressBoxProps) {
  const classes = addressListStyles();

  return (
    <Box
      component="span"
      key={`addressList_${address[EntityWithIdFields.Id]}`}
      className={classes.root}
      width="100%"
    >
      <Stack direction="column">
        <Stack direction="row" spacing={2} alignItems="center">
          {!address[EntityAddressFields.StreetWithNumber] && (
            <Typography
              fontWeight={400}
              fontSize={'0.85rem'}
              color="dark"
              fontStyle="italic"
            >
              Pendiente de carga
            </Typography>
          )}

          <Chip
            color="info"
            size="small"
            label={AddressFormatter.getLabel(address)}
          />
        </Stack>

        <Typography
          fontWeight={500}
          fontSize={'1.075rem'}
          color={'text.disabled'}
        >
          {AddressFormatter.toFullAddress(address)}
        </Typography>
      </Stack>
    </Box>
  );
}

export default AddressBox;
