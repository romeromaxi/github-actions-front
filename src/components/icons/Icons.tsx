import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Badge, SvgIconProps, Tooltip, useMediaQuery} from '@mui/material';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {themeIconsSizeDefinition} from "util/themes/definitions/ThemeIconsSizeDefinition";

interface CheckOrWarningIconProps extends SvgIconProps {
  value: boolean;
}

export function CheckOrWarningIcon({
  value,
  ...rest
}: CheckOrWarningIconProps) {
  return value ? (
    <CheckRoundedIcon fontSize={'small'} {...rest} />
  ) : (
    <WarningAmberRoundedIcon fontSize={'small'} {...rest} />
  );
}

type SizeWrapperIcon = number | 'xs' | 'xsm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | string;
type ColorWrapperIcon = 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'success.strong' | 'warning' | 'text.tertiary' | string;
type WeightWrapperIcon = number | 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export interface WrapperIconsProps {
  Icon: React.ElementType | string,
  size?: SizeWrapperIcon,
  color?: ColorWrapperIcon,
  className?: string,
  style?: React.CSSProperties
  sx?: React.CSSProperties,
  weight?: WeightWrapperIcon, // Por ahora solo soportado para Phosphor Icons
  tooltip?: string
}

const sizeMap: Record<string, string> = {
  xs: themeIconsSizeDefinition.xs,
  xsm: themeIconsSizeDefinition.xsm,
  sm: themeIconsSizeDefinition.sm,
  md: themeIconsSizeDefinition.md,
  lg: themeIconsSizeDefinition.lg,
  xl: themeIconsSizeDefinition.xl,
  xxl: themeIconsSizeDefinition.xxl,
};

export function WrapperIcons ({Icon, size = 'sm', color = 'inherit', weight = 'regular', style, sx, className, tooltip}: WrapperIconsProps){
  const theme = useTheme();
  const colorMap: Record<string, string> = {
    inherit: 'currentColor',
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    'success.strong': theme.palette.success.strong,
    warning: theme.palette.warning.main,
    'text.tertiary': theme.palette.text.tertiary,
  };
  
  const parseSize = (value: SizeWrapperIcon): string => 
      (typeof value === 'number') ? `${value}px` : sizeMap[value] || value;
  
  const parseColor = (value: ColorWrapperIcon): string => colorMap[value] || value;
  
  const parsedSize = parseSize(size);
  const parsedColor = parseColor(color);
  
  const stylesProperties : React.CSSProperties = { 
    ...style,
    ...sx,
    strokeWidth: weight === 'thin' ? '1px' : 'auto',  
    fontSize: `${parsedSize} !important`,
    minWidth: `${parsedSize}`,
    minHeight: `${parsedSize}`,
  };
  
  const component =
      (typeof Icon === "string") ?
          <i className={`${Icon} ${className || ''}`}
             style={{ fontSize: parsedSize }}></i>
          : 
          <Icon className={className} 
                size={`${parsedSize}`} 
                color={parsedColor}  
                weight={weight}
                style={{...stylesProperties}}
          />;
  
  return (
      tooltip ?
        <Tooltip title={tooltip}>
          {component}
        </Tooltip>
        :
        component
  )
}

interface BaseIconWrapperProps extends WrapperIconsProps {
  width?: string,
  height?: string,
  bg?: string,
  boxStyles?: React.CSSProperties,
  badge?: boolean;
}

export const BaseIconWrapper = ({width, height, bg, boxStyles, Icon, badge, ...props}: BaseIconWrapperProps) => {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  
  const ComponentIcon = () =>
      <div style={{
        width: width ?? '44px',
        height: height ? height : isMobileScreenSize ? '34px' : '44px',
        backgroundColor: bg ?? 'white',
        borderRadius: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...boxStyles
      }}>
        <WrapperIcons {...props} Icon={Icon}/>
      </div>;
  
  return (
      badge ?
          <Badge color="primary" overlap={'circular'} variant={'dot'} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}>
            <ComponentIcon />
          </Badge>
          :
          <ComponentIcon />
  )
}