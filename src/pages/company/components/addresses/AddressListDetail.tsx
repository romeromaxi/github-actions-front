import React, { ComponentType } from 'react';
import { GridProps } from '@mui/material';

import { EntityAddress } from 'types/general/generalReferentialData';
import { DataWithLabel } from 'components/misc/DataWithLabel';
import { AddressFormatter } from 'util/formatters/addressFormatter';

interface AddressListDetailProps {
  list: EntityAddress[];
  Wrapper?: ComponentType<GridProps>;
  wrapperProps?: GridProps;
}

function AddressListDetail({
  list,
  Wrapper,
  wrapperProps,
}: AddressListDetailProps) {
  const map = (address: EntityAddress) => (
    <DataWithLabel
      label={AddressFormatter.getLabel(address, true)}
      data={AddressFormatter.toFullAddress(address) || '-'}
      rowProps={{ marginTop: '8px' }}
      dataProps={{ paddingLeft: '5px', marginTop: '1px' }}
      labelProps={{ sx: { width: 1 / 5 } }}
    />
  );

  return (
    <>
      {!!Wrapper ? (
        <Wrapper item {...wrapperProps}>
          {list.map(map)}
        </Wrapper>
      ) : (
        <>{list.map(map)}</>
      )}
    </>
  );
}

export default AddressListDetail;
