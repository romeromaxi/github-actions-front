import React from 'react';
import { Stack } from '@mui/material';

import { DataWithLabel } from 'components/misc/DataWithLabel';

import { EnumColors } from 'types/general/generalEnums';
import { stringFormatter } from 'util/formatters/stringFormatter';

interface UserPersonalDataCardSummaryProps {
  cuit: string;
  mail: string;
  //phone: number
}

function UserPersonalDataCardSummary(props: UserPersonalDataCardSummaryProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack>
        <DataWithLabel
          label="CUIT"
          data={stringFormatter.formatCuit(props.cuit)}
          color={EnumColors.LIGHTBLUE}
          rowDirection
        />
      </Stack>
      <Stack>
        <DataWithLabel
          label="Mail"
          data={props.mail}
          color={EnumColors.LIGHTBLUE}
          rowDirection
        />
      </Stack>
    </Stack>
  );
}

export default UserPersonalDataCardSummary;
