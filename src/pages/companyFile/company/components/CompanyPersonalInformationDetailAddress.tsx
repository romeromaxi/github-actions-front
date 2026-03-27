import React from 'react';
import { Divider, Grid, Skeleton, Stack } from '@mui/material';

import { EntityAddress } from 'types/general/generalReferentialData';
import AddressListDetail from 'pages/company/components/addresses/AddressListDetail';

interface CompanyPersonalInformationDetailAddressProps {
  address?: EntityAddress[];
}

function CompanyPersonalInformationDetailAddress(
  props: CompanyPersonalInformationDetailAddressProps,
) {
  return (
    <Stack direction="column">
      <Divider>Domicilios</Divider>
      {props.address ? (
        <AddressListDetail
          Wrapper={Grid}
          wrapperProps={{ padding: '0px 10px' }}
          list={props.address}
        />
      ) : (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}
    </Stack>
  );
}

export default CompanyPersonalInformationDetailAddress;
