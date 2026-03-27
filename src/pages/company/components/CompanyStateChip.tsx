import { Chip } from '@mui/material';
import React from 'react';
import { CompanyStateColorMap } from '../../../util/typification/companyStateColor';
import { ValidationStatesType } from '../../../types/person/personEnums';

interface CompanyStateChipProps {
  label: string;
  code: ValidationStatesType;
  small?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const CompanyStateChip = ({
  label,
  code,
  small,
  onClick,
  selected,
}: CompanyStateChipProps) => {
  const color = CompanyStateColorMap?.[code] || CompanyStateColorMap[1];

  return onClick ? (
    <Chip
      label={label}
      sx={{
        color: color.dark,
        backgroundColor: color.light,
        border: selected ? '2px solid grey' : '',
      }}
      size={small ? 'small' : 'medium'}
      onClick={onClick}
    />
  ) : (
    <Chip
      label={label}
      sx={{
        color: color.dark,
        backgroundColor: color.light,
      }}
      size={small ? 'small' : 'medium'}
    />
  );
};

export default CompanyStateChip;
