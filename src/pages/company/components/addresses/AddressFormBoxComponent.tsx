import React from 'react';

import { Box, Grid, Stack } from '@mui/material';

import { AddressFormatter } from 'util/formatters/addressFormatter';
import {
    EntityAddress,
    EntityAddressFields,
} from 'types/general/generalReferentialData';
import AddressFormBoxComponentStyles from './AddressFormBoxComponent.styles';
import { Skeleton } from '@mui/lab';
import { DeleteIconButton, EditIconButton } from 'components/buttons/Buttons';
import {TypographyBase} from "components/misc/TypographyBase";

interface AddressFormBoxComponentProps {
  address: EntityAddress;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

function AddressFormBoxComponent({
  address,
  onEdit,
  onDelete,
  disabled,
}: AddressFormBoxComponentProps) {
    const classes = AddressFormBoxComponentStyles();
    const fullAddress: string = AddressFormatter.toFullAddress(address);
    
    return (
        <Box>
            <Grid className={classes.root} container>
                <Grid item xs={7}>
                    <Stack spacing={0.25}>
                        <TypographyBase variant="body4" color="text.lighter">
                            {AddressFormatter.getLabel(address)}
                        </TypographyBase>

                        {
                            !address[EntityAddressFields.Street] ?
                                <TypographyBase variant={'body3'}
                                                color={'text.lighter'}
                                                fontWeight={500}
                                                fontStyle={'italic'}
                                >
                                    Pendiente de carga
                                </TypographyBase>
                                :
                                <TypographyBase fontFamily={'Poppins'} fontSize={'1rem'} fontWeight={600}>
                                    {AddressFormatter.toFullAddress(address)}
                                </TypographyBase>
                        }
                    </Stack>
                </Grid>

                <Grid item xs={5}>
                    <Stack direction={'row'}
                           justifyContent={'flex-end'}
                           alignItems={'center'}
                           spacing={1}
                    >
                        {
                            (onEdit && !disabled) && (
                                <EditIconButton id={"company-address-edit-btn"}
                                                size={'medium'}
                                                color={'primary'}
                                                tooltipTitle="Editar"
                                                onClick={onEdit}
                                                disabled={disabled}
                                />
                            )
                        }

                        {
                            (onDelete && !disabled && !!fullAddress) && (
                                <DeleteIconButton id={"company-address-delete-btn"}
                                                  size={'medium'}
                                                  color={'primary'}
                                                  tooltipTitle="Eliminar"
                                                  onClick={onDelete}
                                />
                            )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

export function AddressFormBoxComponentLoading() {
  const classes = AddressFormBoxComponentStyles();

  return (
    <Box className={classes.root}>
      <Grid container item xs={12} alignItems="center">
        <Stack direction="row" justifyContent={'space-between'} width={'100%'}>
          <Stack direction="column" width={'100%'}>
            <Skeleton width={'60%'} />

            <Skeleton width={'80%'} />
          </Stack>
        </Stack>
      </Grid>
    </Box>
  );
}

export default AddressFormBoxComponent;
