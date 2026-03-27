import React from 'react';
import {Box, Card, CardContent, Stack, Typography} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

import { DefaultStylesButton } from 'components/buttons/Buttons';
import { DataWithLabelPrimary } from 'components/misc/DataWithLabel';

import {
    MainDataToConfirmedDataProps,
    MainDataToConfirmedLabelProps,
} from './ConfirmationCuit.styles';
import { stringFormatter } from 'util/formatters/stringFormatter';
import {WrapperIcons} from "../icons/Icons";
import {TypographyBase} from "../misc/TypographyBase";
import {User} from "@phosphor-icons/react";

interface ConfirmationCuitProps {
  cuit: string;
  legalName: string;
  onCuitIncorrect: () => void;
  onCuitCorrect: () => void;
}


const ConfirmationCuit = (props: ConfirmationCuitProps) => {
    return (
        <Box
            sx={{
                borderWidth: '1px',
                borderStyle: 'dashed',
                borderColor: 'grey.300',
                borderRadius: '0.475rem',
                padding: '0.95rem 1.75rem !important',
            }}
        >
            <Stack spacing={1} alignItems={'flex-start'}>
                <Typography
                    variant="h4"
                    fontWeight={500}
                    fontSize={'1.15rem'}
                    color={'grey.900'}
                >
                    Confirmación de CUIT:
                </Typography>

                <Typography component="span" {...MainDataToConfirmedLabelProps}>
                    El CUIT
                    <Typography component="span" {...MainDataToConfirmedDataProps}>
                        {` ${stringFormatter.formatCuit(props.cuit)} `}
                    </Typography>
                    pertenece a:
                </Typography>

                <DataWithLabelPrimary
                    label="Razón Social"
                    data={props.legalName}
                    rowDirection
                    labelProps={MainDataToConfirmedLabelProps}
                    dataProps={MainDataToConfirmedDataProps}
                />
            </Stack>

            <Stack direction="row" justifyContent="space-around" spacing={7} mt={3}>
                <DefaultStylesButton
                    startIcon={<MarkEmailReadOutlinedIcon />}
                    onClick={props.onCuitCorrect}
                    size={'small'}
                >
                    Confirmar CUIT
                </DefaultStylesButton>

                <DefaultStylesButton
                    startIcon={<EditOutlinedIcon />}
                    onClick={props.onCuitIncorrect}
                    size={'small'}
                >
                    CUIT Incorrecto
                </DefaultStylesButton>
            </Stack>
        </Box>
    )
}

interface NewConfirmationCuitProps {
    cuit: string;
    legalName: string;
}

export const NewConfirmationCuit = ({cuit, legalName} : NewConfirmationCuitProps) => {
   
  return (
       <Card>
          <CardContent>
            <Stack spacing={1} overflow={'hidden'}>
              <Stack spacing={2} direction={'row'} alignItems={'center'}>
                <WrapperIcons Icon={User} size={'sm'}/>
                <Typography fontWeight={600}>Datos del CUIT</Typography>
              </Stack>
              <TypographyBase variant={'caption'} color={'text.lighter'}>
                {`El CUIT ${stringFormatter.formatCuit(cuit)} pertenece a ${legalName}`}
              </TypographyBase>
            </Stack>
          </CardContent>
       </Card>
   )
}

export default ConfirmationCuit;
