import React from 'react';
import {Chip, Stack, Theme} from '@mui/material';
import {
    SolicitationOffererStatusColorMap,
    SolicitationStatusColorMap
} from '../../../../util/typification/solicitationStatesColor';
import {
    SolicitationAlertType,
    SolicitationOffererStatusType,
    SolicitationStatusType
} from '../../../../types/solicitations/solicitationEnums';
import {SxProps} from '@mui/system';
import {BellRinging} from "phosphor-react";
import {WrapperIcons} from "../../../../components/icons/Icons";

interface SolicitationChipProps {
    label: React.ReactNode;
    alertType?: SolicitationAlertType;
    small?: boolean;
    sx?: SxProps<Theme>;
}


interface SolicitationOffererStatusChipProps extends SolicitationChipProps {
  statusCode: SolicitationOffererStatusType;
}

function SolicitationOffererStatusChip({
  label,
  statusCode,
  alertType,
  small,
  sx
}: SolicitationOffererStatusChipProps) {
  const color =
      SolicitationOffererStatusColorMap?.[statusCode] || SolicitationOffererStatusColorMap[1];
  
  const hasAlert = !!alertType
    
  const renderTitleByAlertType = () => {
      if (alertType) {
          if (alertType === SolicitationAlertType.NewMessage) return 'Tenés un nuevo mensaje'
          if (alertType === SolicitationAlertType.NewDocument) return 'Se adjuntó documentación'
          return 'Tenés una nueva notificación'
      }
  }

  return (
      <Stack direction="row" justifyContent="center !important" alignItems="center" spacing={1}>
          {hasAlert &&
              <WrapperIcons className={'bell-ringing-shake'}
                            Icon={BellRinging} size={'sm'} color={'error'}
                            tooltip={renderTitleByAlertType()}
              />
          }
          <Chip
              label={label}
              sx={{
                  color: color?.dark || 'black',
                  backgroundColor: color?.light || 'grey',
                  ...sx,
              }}
              size={small ? 'small' : 'medium'}
          />
      </Stack>
  );
}


interface SolicitationCompanyStatusChipProps extends SolicitationChipProps{
    statusCode: SolicitationStatusType;
}

export const SolicitationCompanyStatusChip = ({
                                                  label,
                                                  statusCode,
                                                  alertType,
                                                  small,
                                                  sx
                                              }: SolicitationCompanyStatusChipProps
) => {
    const color =
        SolicitationStatusColorMap?.[statusCode] || SolicitationStatusColorMap[1];

    const hasAlert = !!alertType

    const renderTitleByAlertType = () => {
        if (alertType) {
            if (alertType === SolicitationAlertType.NewMessage) return 'Tenés un nuevo mensaje'
            if (alertType === SolicitationAlertType.NewDocument) return 'Se adjuntó documentación'
            return 'Tenés una nueva notificación'
        }
    }

    return (
        <Stack direction="row" justifyContent="center !important" alignItems="center" spacing={1}>
            {hasAlert &&
                <WrapperIcons className={'bell-ringing-shake'}
                              Icon={BellRinging} size={'sm'} color={'error'}
                              tooltip={renderTitleByAlertType()}
                />
            }
            <Chip
                label={label}
                sx={{
                    color: color?.dark || 'black',
                    backgroundColor: color?.light || 'grey',
                    ...sx,
                }}
                size={small ? 'small' : 'medium'}
            />
        </Stack>
    );
}

export default SolicitationOffererStatusChip;
