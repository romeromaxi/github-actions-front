import { Grid, Stack } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import {
  HttpCompany,
  HttpCompanyAddress,
  HttpCompanyMail,
  HttpCompanyPhoneNumber,
} from 'http/index';
import ConversationContextProvider from 'hooks/contexts/ConversationContext';
import {
  CompanyMailFields,
  CompanyPhoneNumberFields,
} from 'types/company/companyReferentialData';
import OffererPymeInformationCard from './OffererPymeInformationCard';
import {
  SolicitationFlagsFields,
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import {
  CompanyDetailFormFields,
  CompanyFields,
  CompanyForm,
} from 'types/company/companyData';
import ChatCard from 'components/chat/ChatCard';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  OffererSolicitationActivitySecObjects,
  SecurityComponents,
} from 'types/security';
import { SolicitationNavHeaderContext } from '../OffererSolicitationNavHeader';
import {useSolicitation} from "../../../../../hooks/contexts/SolicitationsContext";
import OffererLogo from 'pages/offerer/components/OffererLogo';
import {CompanyLogoById} from 'pages/company/components/CompanyLogo';

interface OffererSolicitationActivityProps {
  solicitation: SolicitationViewDTO | undefined;
}

const OffererSolicitationActivity = ({
  solicitation,
}: OffererSolicitationActivityProps) => {
  const { flags } = useSolicitation();
  const { isCommercialResponsible } = useContext(SolicitationNavHeaderContext);
  const [company, setCompany] = useState<CompanyForm>();

  useEffect(() => {
    solicitation &&
      Promise.all([
        HttpCompany.getCompanyById(
          solicitation[SolicitationViewDTOFields.CompanyId],
        ),
        HttpCompanyPhoneNumber.getMain(
          solicitation[SolicitationViewDTOFields.CompanyId],
        ),
        HttpCompanyMail.get(solicitation[SolicitationViewDTOFields.CompanyId]),
        HttpCompanyAddress.get(
          solicitation[SolicitationViewDTOFields.CompanyId],
        ),
      ]).then(([company, phone, mail, addresses]) => {
        setCompany({
          ...company,
          [CompanyFields.AreaCode]: phone[CompanyPhoneNumberFields.AreaCode],
          [CompanyDetailFormFields.Phone]: [phone],
          [CompanyDetailFormFields.Mail]: mail[CompanyMailFields.Mail],
          [CompanyDetailFormFields.Address]: addresses,
        });
      });
  }, [solicitation]);

  return (
    <>
      {company && solicitation && (
        <Grid container spacing={2} mb={2}>
          <Grid item xs={9}>
            <ConversationContextProvider
                SentLogoComponent={<OffererLogo offererUrlLogo={solicitation[SolicitationViewDTOFields.OffererUrlLogo]} size={'md'} />}
                ReceivedLogoComponent={<CompanyLogoById companyId={solicitation[SolicitationViewDTOFields.CompanyId]} size={'md'} />}
            >
              <ChatCard
                solicitationId={solicitation[EntityWithIdFields.Id]}
                title={'Chat con la Pyme'}
                securityComponent={
                  SecurityComponents.OffererSolicitationActivity
                }
                securityObject={
                  OffererSolicitationActivitySecObjects.SendChatOffererButton
                }
                editNotAllowed={
                  !flags?.[
                    SolicitationFlagsFields.SolicitationChatEditionAllowed
                  ] || !isCommercialResponsible
                }
              />
            </ConversationContextProvider>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={2}>
              <OffererPymeInformationCard company={company} />
            </Stack>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default OffererSolicitationActivity;
