import {
  ButtonDropdown,
  ButtonIconDropdown,
  MenuItemDropdown,
} from './Buttons';
import {
  DescriptionTwoTone,
  GridOnTwoTone,
  PictureAsPdfTwoTone,
} from '@mui/icons-material';
import React from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface ButtonExportDropdownProps {
  size?: 'small' | 'medium' | 'large';
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  tooltipTitle?: string;
  fullWidth?: boolean;
  id?: string;
}

export function ButtonExportDropdown({
  onExportPdf,
  onExportCsv,
  onExportExcel,
  size,
  fullWidth,
    id
}: ButtonExportDropdownProps) {
  let itemsDropdown: MenuItemDropdown[] = [];

  if (!!onExportPdf)
    itemsDropdown.push({
      label: 'Como PDF',
      onClick: onExportPdf,
      icon: <PictureAsPdfTwoTone />,
    });

  /*
  if (!!onExportCsv)
    itemsDropdown.push({
      label: 'Como CSV',
      onClick: onExportCsv,
      icon: <DescriptionTwoTone />,
    });
   */

  if (!!onExportExcel)
    itemsDropdown.push({
      label: 'Como Excel',
      onClick: onExportExcel,
      icon: <GridOnTwoTone />,
    });

  return (
    <ButtonDropdown
      label="Exportar"
      color={'primary'}
      startIcon={<FileDownloadOutlinedIcon />}
      items={itemsDropdown}
      size={size}
      fullWidth={fullWidth}
      id={id}
    />
  );
}

export function ButtonIconExportDropdown({
  onExportPdf,
  onExportCsv,
  onExportExcel,
}: ButtonExportDropdownProps) {
  let itemsDropdown: MenuItemDropdown[] = [];

  if (!!onExportPdf)
    itemsDropdown.push({
      label: 'Como PDF',
      onClick: onExportPdf,
      icon: <PictureAsPdfTwoTone />,
    });

  /*if (!!onExportCsv)
    itemsDropdown.push({
      label: 'Como CSV',
      onClick: onExportCsv,
      icon: <DescriptionTwoTone />,
    });
  */
  if (!!onExportExcel)
    itemsDropdown.push({
      label: 'Como Excel',
      onClick: onExportExcel,
      icon: <GridOnTwoTone />,
    });

  return (
    <ButtonIconDropdown
      label={''}
      items={itemsDropdown}
      sx={{ backgroundColor: 'transparent !important' }}
      icon={<FileDownloadOutlinedIcon color={'primary'} fontSize={'small'} />}
    />
  );
}
