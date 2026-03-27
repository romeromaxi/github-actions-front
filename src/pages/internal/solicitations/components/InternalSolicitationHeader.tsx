import { Chip, Skeleton, Stack } from "@mui/material";
import React from "react";
import { ButtonIconDropdown } from "../../../../components/buttons/Buttons";
import { WrapperIcons } from "../../../../components/icons/Icons";
import { TypographyBase } from "../../../../components/misc/TypographyBase";
import { useSolicitation } from "../../../../hooks/contexts/SolicitationsContext";
import useAxios from "../../../../hooks/useAxios";
import { HttpFilesSolicitation } from "../../../../http";
import { EntityWithIdFields } from "../../../../types/baseEntities";
import { SolicitationViewDTOFields } from "../../../../types/solicitations/solicitationData";
import { SolicitationClassificationTypesStatusType } from "../../../../types/solicitations/solicitationEnums";
import {File} from "phosphor-react";


const InternalSolicitationHeader = () => {
    const { solicitation } = useSolicitation();
  const cancelled = solicitation?.[SolicitationViewDTOFields.OffererSolicitationClassificationStatusTypeCod] === SolicitationClassificationTypesStatusType.Cancelled
  const { fetchAndDownloadFile } = useAxios()
    
    const downloadReport = () => {
        const solicitationId = solicitation?.[EntityWithIdFields.Id];
        if (!!solicitationId) {
            fetchAndDownloadFile(() =>
                HttpFilesSolicitation.downloadReport(solicitationId),
            );
        }
    };
  
  return (
    <Stack spacing={1}>
      {
        solicitation ?
          <React.Fragment>
              {
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Chip label={solicitation[SolicitationViewDTOFields.ProductDesc]} color={'default'} size={'small'} />
                    
                    {cancelled && <Chip color={'error'} label={solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeDesc]} size={'small'} />}

                      <ButtonIconDropdown label={""}
                                          items={[{
                                              label: 'Descargar informe',
                                              onClick: downloadReport,
                                              icon: <WrapperIcons Icon={File} size='md'/>,
                                          }]}
                                          size={'small'}
                      />
                  </Stack>
              }

            <TypographyBase variant={'body2'} fontWeight={500} tooltip maxLines={2}>
              {solicitation[SolicitationViewDTOFields.LineDesc]}
            </TypographyBase>
          </React.Fragment>
          :
          <Skeleton />
      }
    </Stack>
  )
}


export default InternalSolicitationHeader;