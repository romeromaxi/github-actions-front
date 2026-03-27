import React from 'react';
import {
  Chip,
  Link,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from '@mui/material';

import DataWithLabelStyles from './DataWithLabel.styles';
import { EnumColors } from 'types/general/generalEnums';

import { CheckRounded, CloseRounded } from '@mui/icons-material';
import {TypographyBase, TypographyBaseProps} from "./TypographyBase";

export interface DataWithLabelProps {
  label: React.ReactNode;
  data: React.ReactNode;
  labelProps?: TypographyProps;
  dataProps?: TypographyProps;
  rowDirection?: boolean;
  rowProps?: StackProps;
  color?: EnumColors;
  type?: 'string' | 'icon';
  fullWidth?: boolean;
  mediumWidth?: boolean;
  link?: boolean;
  onClick?: () => void;
  check?: boolean;
  pendantLabel?: string;
}

function DataWithLabel({
  label,
  data,
  color,
  type,
  labelProps,
  dataProps,
  rowDirection,
  rowProps,
  fullWidth,
  mediumWidth,
  link,
  onClick,
  pendantLabel,
}: DataWithLabelProps) {
  const classes = DataWithLabelStyles();
  const dataToRender =
    type !== 'icon' ? (
      data ? (
        data
      ) : (
        <Typography
          color={!pendantLabel ? '#eac276' : 'black'}
          fontStyle={'italic'}
          fontWeight={600}
        >
          {pendantLabel ? pendantLabel : 'Pendiente de carga'}
        </Typography>
      )
    ) : data ? (
      <Chip
        label="Sí"
        size="small"
        color="success"
        icon={<CheckRounded className={classes.iconChip} />}
      />
    ) : (
      <Chip
        label="No"
        size="small"
        color="error"
        icon={<CloseRounded className={classes.iconChip} />}
      />
    );

  const justifyContent =
    fullWidth || mediumWidth ? 'space-between' : rowProps?.justifyContent;
  const labelWidth = fullWidth ? 1 : mediumWidth ? 0.5 : undefined;

  return (
    <Stack
      justifyContent={justifyContent}
      direction={rowDirection ? 'row' : 'column'}
      alignItems={rowDirection ? 'center' : 'flex-start'}
      spacing={rowDirection ? 1 : 0}
      gap={fullWidth ? 8 : undefined}
      ml={fullWidth ? 1 : undefined}
      {...rowProps}
    >
      <Typography
        variant="caption"
        color="text.disabled"
        fontWeight={500}
        width={labelWidth}
        {...labelProps}
      >
        {rowDirection && !fullWidth && !mediumWidth ? `${label}: ` : label}
      </Typography>
      <Typography
        variant="label"
        fontWeight={500}
        className={classes.data}
        width={fullWidth || mediumWidth ? 1 : undefined}
        display={'grid'}
        {...dataProps}
      >
        {link && onClick ? (
          <Link
            component={'button'}
            onClick={onClick}
            underline={'none'}
            target={'_blank'}
          >
            {dataToRender}
          </Link>
        ) : (
          dataToRender
        )}
      </Typography>
    </Stack>
  );
}

function DataWithLabelColorEditableData({
  label,
  data,
  labelProps,
  dataProps,
  rowDirection,
  rowProps,
}: DataWithLabelProps) {
  const classes = DataWithLabelStyles();

  return rowDirection ? (
    <Stack direction="row" alignItems="center" {...rowProps}>
      <Typography variant="caption" className={classes.label} {...labelProps}>
        {label}:
      </Typography>
      <Typography
        variant="h6"
        className={classes.dataEditable}
        sx={{ marginLeft: '12px' }}
        {...dataProps}
      >
        {data}
      </Typography>
    </Stack>
  ) : (
    <Typography variant="caption" className={classes.label} {...labelProps}>
      {label}
      <Typography mt={-1} variant="h6" className={classes.data} {...dataProps}>
        {data}
      </Typography>
    </Typography>
  );
}

function DataWithLabelPrimary({
  label,
  data,
  labelProps,
  dataProps,
  rowDirection,
}: DataWithLabelProps) {
  const classes = DataWithLabelStyles();

  return rowDirection ? (
    <Stack direction="row" alignItems="center">
      <Typography variant="caption" className={classes.label} {...labelProps}>
        {label}:
      </Typography>
      <Typography
        variant="h6"
        className={classes.dataPrimary}
        sx={{ marginLeft: '12px' }}
        {...dataProps}
      >
        {data}
      </Typography>
    </Stack>
  ) : (
    <Typography variant="caption" className={classes.label} {...labelProps}>
      {label}
      <Typography variant="h6" className={classes.dataPrimary} {...dataProps}>
        {data}
      </Typography>
    </Typography>
  );
}

interface DataWithLabelCompanyFileProps {
  label: string;
  data?: any;
}

function DataWithLabelCompanyFile({
  label,
  data,
}: DataWithLabelCompanyFileProps) {
  const dataRender = data ? (
    <Typography fontWeight={600} fontSize={'1.1rem'}>
      {data}
    </Typography>
  ) : (
    <Typography
      fontStyle={'italic'}
      color={'#eac276 !important'}
      fontWeight={600}
    >
      Pendiente de carga
    </Typography>
  );

  return (
    <DataWithLabel label={label} data={dataRender} rowDirection mediumWidth />
  );
}

interface DataWithLabelTypographyBaseProps {
    label: string;
    data?: any;
    LabelProps?: TypographyBaseProps,
    DataProps?: TypographyBaseProps,
    StackProps?: StackProps;
}

function DataWithLabelTypographyBase(props: DataWithLabelTypographyBaseProps) {
    return (
        <Stack { ...props.StackProps } >
            <TypographyBase {...props.LabelProps}>
                {props.label}
            </TypographyBase>
            <TypographyBase {...props.DataProps}>
                {props.data}
            </TypographyBase>
        </Stack>
    )
}

export {
  DataWithLabel,
  DataWithLabelColorEditableData,
  DataWithLabelPrimary,
  DataWithLabelCompanyFile, 
  DataWithLabelTypographyBase
};
