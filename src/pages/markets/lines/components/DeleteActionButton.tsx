import React from 'react';
import { DeleteIconButton } from '../../../../components/buttons/Buttons';
import { iconSx } from './lineCardActionIconSx';
import { Tooltip } from '@mui/material';

interface DeleteActionButtonProps {
  onDelete: () => void;
  fontSize?: 'small' | 'inherit' | 'medium' | 'large';
}

function DetailActionButton({ onDelete, ...rest }: DeleteActionButtonProps) {
  return (
    <Tooltip title={'Eliminar'}>
      <div>
        <DeleteIconButton onClick={onDelete} {...rest} />
      </div>
    </Tooltip>
  );
}

export default DetailActionButton;
