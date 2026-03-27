import * as React from 'react';
import { ReactElement } from 'react';
import clsx from 'clsx';
import ShoppingBagListItemStyles from './ShoppingBagListItem.styles';
import {Checkbox, Grid, ListItemButton, Radio, Stack, Tooltip,} from '@mui/material';
import {CompanyLogoById} from "../../../../company/components/CompanyLogo";
import {PersonTypes} from "types/person/personEnums";
import {TypographyBase} from "components/misc/TypographyBase";

export interface ShoppingBagListItemProps {
  businessName: string;
  onClick: (selected: boolean | null) => void;
  selected: boolean;
  multiple?: boolean;
  hasPermissions: boolean;
  allowChoose: boolean;
  tooltip?: string;
  companyId?: number;
  companyPersonType?: PersonTypes;
  children?: ReactElement;
  statusMessage?: string;
  statusColor?: string;
  statusIcon?: ReactElement;
}

export function ShoppingBagListItem({
  businessName, companyId, companyPersonType,
  selected,
  hasPermissions,
  allowChoose,
  onClick,
  tooltip,
  children, multiple,
  statusMessage,
  statusColor,
  statusIcon,
}: ShoppingBagListItemProps) {
  const classes = ShoppingBagListItemStyles();
  const allowClick = hasPermissions && allowChoose;
  
  const finalTooltip = tooltip ?? undefined;

  const onClickItem = () => (allowClick ? (multiple ? onClick(!selected) : onClick(null)) : () => {});

  const componentRender = (
    <ListItemButton
      className={clsx(classes.listItem, {
        [classes.listItemActive]: selected,
        [classes.listItemDisabled]: !allowClick,
      })}
      selected={selected}
      onClick={onClickItem}
      disableRipple={!allowClick}
    >
      <Grid container spacing={2} width={1}>
        <Grid item xs={0.75} sx={{ display: 'flex', alignItems: 'center' }}>
          {multiple ? <Checkbox checked={selected} disabled={!allowClick} /> : <Radio checked={selected} /> }
        </Grid>
        <Grid item xs={11.25}>
          <Stack direction="column" spacing={0.5} sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, overflow: 'hidden' }}>
              <CompanyLogoById companyId={companyId}
                               isPhysicalPerson={companyPersonType === PersonTypes.Physical}
                               size={'md'}
              />
    
              <Stack direction="column" spacing={0.375} sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                <TypographyBase variant={'button1'}
                                maxLines={2}
                                tooltip
                >
                  {businessName}
                </TypographyBase>
                {statusMessage && (
                  <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ color: statusColor ?? 'text.lighter' }}>
                    {statusIcon}
                    <TypographyBase 
                      variant={'body4'}
                      maxLines={2}
                      sx={{ color: 'inherit' }}
                    >
                      {statusMessage}
                    </TypographyBase>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {(hasPermissions && !!children) && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            flexShrink: 1,
            minWidth: '36%',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {children}
        </Stack>
      )}
    </ListItemButton>
  );

  return !!finalTooltip ? (
    <Tooltip title={finalTooltip}>{componentRender}</Tooltip>
  ) : (
    componentRender
  );
}