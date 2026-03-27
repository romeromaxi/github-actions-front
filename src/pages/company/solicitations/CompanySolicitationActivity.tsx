import React from 'react';
import {
  SolicitationFlagsFields,
} from 'types/solicitations/solicitationData';
import {Box, Stack} from '@mui/material';
import ConversationContextProvider from 'hooks/contexts/ConversationContext';
import ChatCard from 'components/chat/ChatCard';
import {
  CompanySolicitationActivitySecObjects,
  SecurityComponents,
} from 'types/security';
import { useCompanySolicitation } from './CompanySolicitationContext';
import OffererLogo from "../../offerer/components/OffererLogo";
import { CompanyLogo } from 'pages/company/components/CompanyLogo';
import {TypographyBase} from "../../../components/misc/TypographyBase";

interface CompanySolicitationActivityProps {
  solicitationId: number;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
}

function CompanySolicitationActivity({
  solicitationId, height, minHeight, maxHeight
}: CompanySolicitationActivityProps) {
  const { flags, reloadAlertCode, urlOffererLogo, urlCompanyLogo } = useCompanySolicitation();

  const renderEmptyComponent = () => {
    return (
        <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
          <Box component={'img'}
               sx={{
                 height: 150,
                 width: 150
               }}
               src={"/images/assets/chat-bubbles-solicitation.svg"}
          />
          <TypographyBase variant={"body1"} color={'text.lighter'}>
            Los mensajes se habilitarán cuando la entidad asigne tu caso a un ejecutivo.
          </TypographyBase>
        </Stack>
    )
  }
  
  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ConversationContextProvider onReadConversation={reloadAlertCode}
                                   SentLogoComponent={<CompanyLogo companyLogo={urlCompanyLogo} loading={false} size={'md'} />}
                                   ReceivedLogoComponent={<OffererLogo offererUrlLogo={urlOffererLogo} size={'md'} />}
      >
        <ChatCard
          title={'Mensajes'}
          solicitationId={solicitationId}
          securityComponent={SecurityComponents.CompanySolicitationActivity}
          securityObject={CompanySolicitationActivitySecObjects.SendChatCompanyButton}
          editNotAllowed={!flags?.[SolicitationFlagsFields.SolicitationChatEditionAllowed]}
          emptyComponent={renderEmptyComponent()}
          hiddenIcon
          height={'100%'}
          minHeight={minHeight}
          maxHeight={maxHeight}
        />
      </ConversationContextProvider>
    </Stack>
  );
}

export default CompanySolicitationActivity;
