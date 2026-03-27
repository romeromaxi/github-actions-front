import React from 'react';
import { Divider, Grid, Skeleton, Stack } from '@mui/material';
import {
  AlternateEmailTwoTone,
  EmailTwoTone,
  LanguageTwoTone,
  LocalPhoneTwoTone,
} from '@mui/icons-material';

import {
  CompanyFields,
  CompanyForm,
  CompanyViewDTOFields,
} from '../../../../types/company/companyData';
import { DataWithIcon } from '../../../../components/misc/DataWithIcon';
import { stringFormatter } from '../../../../util/formatters/stringFormatter';

interface CompanyPersonalInformationDetailContactInformationProps {
  company?: CompanyForm;
}

function CompanyPersonalInformationDetailContactInformation(
  props: CompanyPersonalInformationDetailContactInformationProps,
) {
  return (
    <Stack direction="column" spacing={1}>
      <Divider>Contacto</Divider>

      {props.company ? (
        <Grid container item xs={12} gap={1}>
          <Grid item xs={12}>
            <DataWithIcon
              icon={<EmailTwoTone sx={{ color: '#A1A5B7 !important' }} />}
              data={props.company[CompanyViewDTOFields.Mail] ?? '-'}
            />
          </Grid>
          <Grid item xs={12}>
            <DataWithIcon
              icon={<LocalPhoneTwoTone sx={{ color: '#A1A5B7 !important' }} />}
              data={
                stringFormatter.phoneNumberWithAreaCode(
                  props.company[CompanyFields.AreaCode],
                  props.company[CompanyFields.Phone],
                ) ?? '-'
              }
            />
          </Grid>
          <Grid item xs={12}>
            <DataWithIcon
              icon={<LanguageTwoTone sx={{ color: '#A1A5B7 !important' }} />}
              data={props.company[CompanyFields.Web] ?? '-'}
            />
          </Grid>
          <Grid item xs={12}>
            <DataWithIcon
              icon={
                <AlternateEmailTwoTone sx={{ color: '#A1A5B7 !important' }} />
              }
              data={props.company[CompanyFields.SocialNetwork] ?? '-'}
            />
          </Grid>
        </Grid>
      ) : (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      )}
    </Stack>
  );
}

export default CompanyPersonalInformationDetailContactInformation;
