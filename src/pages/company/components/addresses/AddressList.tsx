import React, { ComponentType } from 'react';
import { GridProps } from '@mui/material';

import { EntityAddress } from 'types/general/generalReferentialData';
import AddressBox from './AddressBox';

interface AddressListProps {
  list: EntityAddress[];
  Wrapper?: ComponentType<GridProps>;
  wrapperProps?: GridProps;
}

function AddressList({ list, Wrapper, wrapperProps }: AddressListProps) {
  const map = (address: EntityAddress) => <AddressBox address={address} />;
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

export default AddressList;
