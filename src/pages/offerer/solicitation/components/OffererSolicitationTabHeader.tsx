import React, {useEffect, useState} from 'react';
import {Skeleton} from "@mui/lab";
import {Chip, Stack} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {TypographyBase} from "components/misc/TypographyBase";
import {ActionFields} from "types/workflow/actionData";
import {MessageFields} from "types/workflow/messageData";
import {HttpAction, HttpFilesSolicitation} from "http/index";
import {EntityWithIdFields} from "types/baseEntities";
import OffererSolicitationAssignmentButton from "./assignment/OffererSolicitationAssignmentButton";
import {ButtonIconDropdown} from "../../../../components/buttons/Buttons";
import useAxios from "../../../../hooks/useAxios";
import {WrapperIcons} from "../../../../components/icons/Icons";
import {File} from "phosphor-react";
import { SolicitationClassificationTypesStatusType } from 'types/solicitations/solicitationEnums';


interface OffererSolicitationTabHeaderProps {
    offererBase: boolean;
}

function OffererSolicitationTabHeader({offererBase} : OffererSolicitationTabHeaderProps) {
  const { solicitation, message } = useSolicitation();
  const cancelled = solicitation?.[SolicitationViewDTOFields.OffererSolicitationClassificationStatusTypeCode] === SolicitationClassificationTypesStatusType.Cancelled
  const [actionId, setActionId] = useState<number>();
  const { fetchAndDownloadFile } = useAxios()

  useEffect(() => {
    if (
      message &&
      message[MessageFields.CurrentStageId] &&
      !actionId
    ) {
      HttpAction.getActionsByCurrentStage(message[MessageFields.CurrentStageId])
        .then((actions) => {
          const asigned = actions.filter((x) =>
            x[ActionFields.ActionName].toLowerCase().includes('asignar'),
          );
          if (asigned && !!asigned.length) {
            setActionId(asigned[0][EntityWithIdFields.Id])
          }
            
        });
    }
  }, [message]);

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
              {
                  offererBase &&
                    <TypographyBase variant={'caption'} color={'text.disabled'} tooltip maxLines={2}>
                      {`Responsable comercial: ${solicitation[SolicitationViewDTOFields.CommercialResponsibleUserName] || '-'}`}
                    </TypographyBase>
              }
              {
                  offererBase &&
                    <TypographyBase variant={'caption'} color={'text.disabled'} tooltip maxLines={2}>
                      {`Responsable asignado: ${solicitation[SolicitationViewDTOFields.StageResponsibleUserName] || '-'}`}
                    </TypographyBase>
              }

            
            <OffererSolicitationAssignmentButton responsibleActionId={actionId} />
          </React.Fragment>
          :
          <Skeleton />
      }
    </Stack>
  )
}

export default OffererSolicitationTabHeader;