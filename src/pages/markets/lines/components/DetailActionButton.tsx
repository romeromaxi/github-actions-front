import React from 'react';
import { DetailLineIconButton } from '../../../../components/buttons/Buttons';
import { iconSx } from './lineCardActionIconSx';
import { IconButtonProps, Tooltip } from '@mui/material';

interface DetailActionButtonProps extends IconButtonProps {
  onDetail: () => void;
  fontSize?: 'small' | 'inherit' | 'medium' | 'large';
}

function DetailActionButton({ onDetail, ...rest }: DetailActionButtonProps) {
  //const navigate = useNavigate();

  return (
    <DetailLineIconButton tooltipTitle={'Ver detalle'} onClick={onDetail} />
  );
}

export default DetailActionButton;
