import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AlternateEmailTwoTone,
  EmailTwoTone,
  LanguageTwoTone,
  LocalPhoneTwoTone,
} from '@mui/icons-material';
import React, { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  CompanyFields,
  CompanyForm,
  CompanyViewDTOFields,
} from '../../../../../types/company/companyData';
import { DataWithIcon } from '../../../../../components/misc/DataWithIcon';
import { EntityAddressFields } from '../../../../../types/general/generalReferentialData';
import AddressBox from '../../../../company/components/addresses/AddressBox';
import CompanyAddressListDialog from '../../../../company/components/CompanyAddressListDialog';
import { AddressTypes } from '../../../../../types/general/generalEnums';
import { stringFormatter } from '../../../../../util/formatters/stringFormatter';
import { DefaultStylesButton } from '../../../../../components/buttons/Buttons';

interface OffererPymeInformationCardProps {
  company: CompanyForm;
}

const OffererPymeInformationCard = ({
  company,
}: OffererPymeInformationCardProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const fiscalAddress = company[CompanyViewDTOFields.Address].find(
    (x) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Fiscal,
  );

  return (
    <>
      <Card>
        <CardHeader title={'Datos de la Pyme'} />
        <CardContent>
          <Grid xs={12} container spacing={1}>
            <Grid item xs={12} textAlign={'center'}>
              <Tooltip title={'CUIT'} placement="top">
                <Chip
                  color="info"
                  label={stringFormatter.formatCuit(
                    company[CompanyViewDTOFields.CUIT],
                  )}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              <Stack justifyContent={'center'} spacing={0.5}>
                <DataWithIcon
                  icon={<EmailTwoTone sx={{ color: '#A1A5B7 !important' }} />}
                  data={company[CompanyViewDTOFields.Mail] ?? '-'}
                />
                <DataWithIcon
                  icon={
                    <LocalPhoneTwoTone sx={{ color: '#A1A5B7 !important' }} />
                  }
                  data={
                    stringFormatter.phoneNumberWithAreaCode(
                      company[CompanyFields.AreaCode] ?? '-',
                      company[CompanyFields.Phone],
                    ) ?? '-'
                  }
                />
                <DataWithIcon
                  icon={
                    <LanguageTwoTone sx={{ color: '#A1A5B7 !important' }} />
                  }
                  data={company[CompanyFields.Web] ?? '-'}
                />
                <DataWithIcon
                  icon={
                    <AlternateEmailTwoTone
                      sx={{ color: '#A1A5B7 !important' }}
                    />
                  }
                  data={company[CompanyFields.SocialNetwork] ?? '-'}
                />
              </Stack>
              <Divider sx={{ mt: 2 }} />
            </Grid>
            <Grid item xs={12}>
              {fiscalAddress ? (
                <>
                  <Stack direction={'column'} gap={1}>
                    <Typography fontWeight={500} fontSize={16}>
                      Domicilios
                    </Typography>
                    <AddressBox address={fiscalAddress} />
                    <DefaultStylesButton
                      sx={{ width: 1, height: 1 / 2 }}
                      onClick={() => setOpen(true)}
                    >
                      Ver todos
                    </DefaultStylesButton>
                  </Stack>
                </>
              ) : (
                <Stack
                  mt={1}
                  direction={'row'}
                  spacing={3}
                  justifyContent={'center'}
                  alignContent={'center'}
                >
                  <Typography fontWeight={500} fontSize={16}>
                    Domicilios
                  </Typography>
                  <IconButton
                    color={'inherit'}
                    sx={{ paddingTop: 0.5 }}
                    onClick={() => setOpen(true)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Stack>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <CompanyAddressListDialog
        open={open}
        company={company}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default OffererPymeInformationCard;
