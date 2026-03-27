import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { OffererContext } from '../OffererContextProvider';
import { useAction } from 'hooks/useAction';
import {BackButton, ButtonDropdown, ShareButton} from 'components/buttons/Buttons';
import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import { Stack } from '@mui/material';
import { NavsTabInsideHeader } from 'components/navs/NavsTab';
import OffererSolicitationHeader from './OffererSolicitationHeader';
import {
  HttpAction,
  HttpFilesSolicitation,
  HttpMessage,
  HttpSolicitation,
} from 'http/index';
import ComputerIcon from '@mui/icons-material/Computer';
import { EntityWithIdFields } from 'types/baseEntities';
import { userStorage } from 'util/localStorage/userStorage';
import useAxios from 'hooks/useAxios';
import { MessageFields, MessageView } from 'types/workflow/messageData';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { ActionFields, ActionView } from 'types/workflow/actionData';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import OffererSolicitationDialogRelateFile from './OffererSolicitationDialogRelateFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import OffererShareSolicitationDialog from "./OffererShareSolicitationDialog";
import OffererSolicitationTabsProvider, {
} from "../../../../components/solicitations/OffererSolicitationTabsProvider";

export const SolicitationNavHeaderContext = React.createContext({
  permissionWorkflowCode: 0 as number,
  stageMessage: 0 as number,
  isStageResponsible: false,
  isCommercialResponsible: false,
});

function OffererSolicitationNavHeader() {
  const { solicitationId } = useParams();
  const offerer = useContext(OffererContext);
  const { setTitle, snackbarError, snackbarWarning } = useAction();
  const { fetchData, fetchAndDownloadFile } = useAxios();
  const navigate = useNavigate();
  const userId = userStorage.getUserId() || 0;
  const [solicitation, setSolicitation] = useState<SolicitationViewDTO>();
  const [message, setMessage] = useState<MessageView>();
  const [openLink, setOpenLink] = useState<boolean>(false);
  const [openShare, setOpenShare] = useState<boolean>(false)
  const [actionsAsignedResponsible, setActionsAsignedResponsible] =
    useState<ActionView>();

  const tabData = OffererSolicitationTabsProvider({ solicitation })
  const onBack = () => {
    if (message) {
      let route: string = '/offerer/solicitations';

      fetchData(
        () => HttpMessage.closeMessage(message[EntityWithIdFields.Id]),
        true,
      ).then(() => navigate(route));
    }
  };

  const downloadReport = () => {
    const solicitationId = solicitation?.[EntityWithIdFields.Id];
    if (!!solicitationId) {
      fetchAndDownloadFile(() =>
        HttpFilesSolicitation.downloadReport(solicitationId),
      );
    }
  };

  const onClickLibrary = () => setOpenLink(true);

  const onClickCloseLibrary = () => setOpenLink(false);
  
  const onShareSolicitation = () => setOpenShare(true)
  
  const onCloseShareSolicitation = () => setOpenShare(false)

  const titleActions = () => {
    return (
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <ButtonDropdown
          label={'Descargar'}
          sx={{ p: 0 }}
          size="small"
          color={'primary'}
          icon={<FileDownloadOutlinedIcon fontSize={'small'} />}
          items={[
            {
              label: 'En mi PC',
              onClick: downloadReport,
              icon: <ComputerIcon fontSize="small" />,
            },
            {
              label: 'Guardar en Biblioteca',
              onClick: onClickLibrary,
              icon: <LibraryBooksIcon fontSize="small" />,
            },
          ]}
        />
        <BackButton size={'small'} color={'inherit'} onClick={onBack}>
          Mis Solicitudes
        </BackButton>
      </Stack>
    );
  };

  setTitle(
    `Solicitud de ${solicitation ? solicitation[SolicitationViewDTOFields.CompanyBusinessName] : ''} #${solicitationId}`,
    titleActions(),
    `CUIT: ${stringFormatter.formatCuit(solicitation?.[SolicitationViewDTOFields.CompanyCUIT])}`,
  );

  useEffect(() => {
    solicitationId &&
      HttpSolicitation.getById(parseInt(solicitationId)).then(
        (responseSolicitation) => {
          fetchData(() =>
            HttpMessage.readMessage(
              responseSolicitation[SolicitationViewDTOFields.MessageId] ?? 0,
            ),
          )
            .then((responseMessage: MessageView) => {
              setSolicitation(responseSolicitation);
              setMessage(responseMessage);
              if (
                responseMessage[MessageFields.Warning] &&
                responseMessage[MessageFields.Warning] !== ''
              ) {
                snackbarWarning(responseMessage[MessageFields.Warning]);
              }
            })
            .catch(() => navigate(-1));
        },
      );
  }, [solicitationId]);

  useEffect(() => {
    if (
      message &&
      message[MessageFields.CurrentStageId] &&
      !actionsAsignedResponsible
    ) {
      HttpAction.getActionsByCurrentStage(
        message[MessageFields.CurrentStageId],
      ).then((actions) => {
        const asigned = actions.filter((x) =>
          x[ActionFields.ActionName].toLowerCase().includes('asignar'),
        );
        if (asigned && !!asigned.length)
          setActionsAsignedResponsible(asigned[0]);
      });
    }
  }, [message]);

  return (
    <SolicitationNavHeaderContext.Provider
      value={{
        permissionWorkflowCode:
          message?.[MessageFields.PermissionTypeCode] ?? 0,
        stageMessage: message?.[MessageFields.CurrentStageId] ?? 0,
        isStageResponsible:
          solicitation?.[SolicitationViewDTOFields.StageResponsibleUserId] ===
          userId,
        isCommercialResponsible:
          solicitation?.[
            SolicitationViewDTOFields.CommercialResponsibleUserId
          ] === userId,
      }}
    >
      {tabData && solicitation && (
        <NavsTabInsideHeader
          lstTabs={tabData.tabList ?? []}
          action={tabData.action}
        >
          <OffererSolicitationHeader
            solicitationId={solicitation[EntityWithIdFields.Id]}
            actionId={actionsAsignedResponsible?.[EntityWithIdFields.Id]}
          />
        </NavsTabInsideHeader>
      )}
      {solicitation && (
        <OffererSolicitationDialogRelateFile
          open={openLink}
          onClose={onClickCloseLibrary}
          offererId={offerer[EntityWithIdFields.Id]}
          solicitationId={solicitation[EntityWithIdFields.Id]}
        />
      )}
      {solicitation && offerer &&
        <OffererShareSolicitationDialog open={openShare} onClose={onCloseShareSolicitation} 
                                        solicitationId={solicitation[EntityWithIdFields.Id]}
                                        offererId={offerer[EntityWithIdFields.Id]}
        />
      }
    </SolicitationNavHeaderContext.Provider>
  );
}

export default OffererSolicitationNavHeader;
