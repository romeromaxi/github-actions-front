import React from 'react';
import { Tooltip } from '@mui/material';
import {TypographyBase} from "../misc/TypographyBase";

function LoadPendingWarning() {
    return (
        <Tooltip title={'Pendiente de Carga'}>
            <TypographyBase variant={'labelForms'} color={'warning.main'}>
                Requerido
            </TypographyBase>
        </Tooltip>
    );
}
{/*<WarningAmberRounded
        sx={{ marginTop: '1px !important' }}
        fontSize={'small'}
        color={'warning'}
      />*/}


export { LoadPendingWarning };
