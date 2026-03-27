import React from "react";
import {Box, Stack} from "@mui/material";
import {
  SolicitationSummaryFields, SolicitationSummaryViewDTO, SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {TypographyBase} from "components/misc/TypographyBase";
import {EntityWithIdFields} from "types/baseEntities";
import SolicitationOffererStatusChip, {
  SolicitationCompanyStatusChip
} from "../../offerer/components/OffererSolicitation/SolicitationOffererStatusChip";

interface SolicitationRelatedOffererCompanySummaryProps {
  solicitation: SolicitationSummaryViewDTO,
  fromCompany?: boolean
}

function SolicitationRelatedOffererCompanySummary({ solicitation, fromCompany }: SolicitationRelatedOffererCompanySummaryProps) {
  
  const onHandleClick = () => {
    const to =
      !fromCompany
        ? `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}`
        : `/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}`;
    window.open(to, '_blank');
  }
  
  return (
    <Box
      sx={{
        padding: '16px', borderRadius: '24px',
        border: '1px solid #EDF2F7', backgroundColor: 'white',
        '&:hover': { 
          cursor: 'pointer',
          backgroundColor: '#EDF2F7',
        } 
      }}
      onClick={onHandleClick}
    >
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Stack direction={'column'} spacing={1}>
          <TypographyBase variant={'caption'} color={'text.lighter'}>
            {`Solicitud #${solicitation[EntityWithIdFields.Id]}`}
          </TypographyBase>
          
          <TypographyBase fontWeight={500}>
            {solicitation[SolicitationSummaryFields.LineDesc]}
          </TypographyBase>
        </Stack>
        {
          fromCompany ?
              <SolicitationCompanyStatusChip
                label={solicitation[SolicitationSummaryFields.SolicitationStatusTypeDesc]}
                statusCode={solicitation[SolicitationSummaryFields.SolicitationStatusTypeCode]}
                small
              />
              :
              <SolicitationOffererStatusChip
                  label={solicitation[SolicitationSummaryFields.SolicitationStatusTypeDesc]}
                  statusCode={solicitation[SolicitationSummaryFields.SolicitationStatusTypeCode]}
                  small
              />
        }
      </Stack>
    </Box>
  )
}

export default SolicitationRelatedOffererCompanySummary;