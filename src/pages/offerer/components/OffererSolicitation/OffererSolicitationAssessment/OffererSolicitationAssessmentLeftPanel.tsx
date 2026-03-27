import { Alert, Badge, Stack } from '@mui/material';
import { BusinessTwoTone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import CompactCardActionButton from 'components/cards/CompactCardActionButton';
import OffererPymeCurrentSolicitations from '../OffererSolicitationActivity/OffererPymeCurrentSolicitations';
import { CompanyFileType } from '../../../../../types/company/companyEnums';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import OffererSolicitationCompanyFileUpdates from './OffererSolicitationCompanyFileUpdates';
import { dateFormatter } from '../../../../../util/formatters/dateFormatter';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

interface OffererSolicitationAssessmentLeftPanelProps {
  solicitation: SolicitationViewDTO;
  variant?: 'offerer' | 'company';
}

const OffererSolicitationAssessmentLeftPanel = ({
  solicitation,
  variant = 'offerer',
}: OffererSolicitationAssessmentLeftPanelProps) => {
  const navigate = useNavigate();
  const hasCreditFile =
    solicitation[SolicitationViewDTOFields.FileTypeCode] ===
    CompanyFileType.Long;
  const requiresUpdate =
    solicitation[SolicitationViewDTOFields.RequestEditCompanyFile];
  const isCompany = variant === 'company';

  return (
    <Stack spacing={1}>
      {isCompany && requiresUpdate && (
        <Alert
          severity={'info'}
        >{`El día ${dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.LastRequestEditCompanyFileDate])} se solicitó actualizar el legajo`}</Alert>
      )}
      <CompactCardActionButton
        title={`Legajo de Contacto`}
        subtitle={
          isCompany && requiresUpdate
            ? 'Hace click para actualizar el legajo'
            : `Hacé click para ver el Legajo enviado en esta solicitud`
        }
        icon={<BusinessTwoTone sx={{ fontSize: '30px' }} />}
        onClick={() => {
          variant === 'offerer'
            ? navigate({
                pathname: `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}/solicitationFile${hasCreditFile ? '?tipo=2' : '?tipo=1'}`,
              })
            : requiresUpdate
              ? navigate({
                  pathname: `/mis-presentaciones/solicitud/${solicitation?.[SolicitationViewDTOFields.CompanyId]}/${solicitation?.[EntityWithIdFields.Id]}/legajo/detalle?tipo=2`,
                })
              : navigate({
                  pathname: `/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}/solicitationFile${hasCreditFile ? '?tipo=2' : '?tipo=1'}`,
                });
        }}
        subtitleTooltip={
          isCompany && requiresUpdate
            ? 'Hace click para actualizar el legajo'
            : `Hacé click para ver el Legajo enviado en esta solicitud`
        }
        iconHeader={
          requiresUpdate && isCompany ? (
            <Badge
              variant={'dot'}
              color={'success'}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <NotificationsActiveOutlinedIcon
                color={'success'}
                fontSize={'small'}
              />
            </Badge>
          ) : undefined
        }
      />
      <OffererSolicitationCompanyFileUpdates variant={variant} />
      <OffererPymeCurrentSolicitations
        variant={variant}
        offererId={solicitation[SolicitationViewDTOFields.OffererId]}
        companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
      />
    </Stack>
  );
};

export default OffererSolicitationAssessmentLeftPanel;
