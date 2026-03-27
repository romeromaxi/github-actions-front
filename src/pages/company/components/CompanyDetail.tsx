import React, { useCallback, useEffect } from 'react';
import { Chip, Collapse, Grid, Stack, Tooltip } from '@mui/material';

import {
  CompanyAddressViewDTO,
  CompanyMailViewDTO,
  CompanyMailViewDTOFields,
  CompanyPhoneNumberFields,
  CompanyPhoneViewDTO,
} from 'types/company/companyReferentialData';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';

import AddressList from './addresses/AddressList';
import CompanyDetailSkeleton from './CompanyDetailSkeleton';

import { EntityWithIdFields } from 'types/baseEntities';

import {
  HttpCompany,
  HttpCompanyAddress,
  HttpCompanyMail,
  HttpCompanyPhoneNumber,
} from 'http/index';
import { PersonTypes } from 'types/person/personEnums';
import { boxSx } from '../activity/components/ActivityBox.styles';
import MarketTypography from '../../markets/components/MarketTypography';
import { ActivityLabelWithDataProps } from '../activity/components/ActivityLabelWithData';
import { ExpandIconButton } from '../../../components/buttons/Buttons';
import CompanyPersonalInformationDetailTaxSituation from '../../companyFile/company/components/CompanyPersonalInformationDetailTaxSituation';
import CompanyPersonalInformationDetailConstituveInformation from '../../companyFile/company/components/CompanyPersonalInformationDetailConstituveInformation';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import { DataWithLabel } from '../../../components/misc/DataWithLabel';
import { CompanyDetailFormFields } from './CompanyDetailCard';

interface CompanyDetailProps {
  company: CompanyViewDTO;
}

function CompanyDetail({ company }: CompanyDetailProps) {
  const isLegalPerson: boolean =
    company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;

  const [loading, setLoading] = React.useState(false);
  const [mail, setMail] = React.useState<CompanyMailViewDTO>();
  const [phone, setPhone] = React.useState<CompanyPhoneViewDTO>();
  const [addressList, setAddressList] = React.useState<CompanyAddressViewDTO[]>(
    [],
  );
  //State auxiliar para tomar cambios en web y red social.
  //Deberia haber un endpoint especifico para traer esos datos?
  const [companyAux, setCompanyAux] = React.useState<CompanyViewDTO>();

  const [constitutiveDatExpanded, setConstitutiveDataExpanded] =
    React.useState<boolean>(true);
  const [relationalDataExpanded, setRelationalDataExpanded] =
    React.useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      HttpCompanyMail.get(company[EntityWithIdFields.Id]),
      HttpCompanyPhoneNumber.get(company[EntityWithIdFields.Id]),
      HttpCompanyAddress.get(company[EntityWithIdFields.Id]),
      HttpCompany.getCompanyById(company[EntityWithIdFields.Id]),
    ])
      .then(([mails, phones, addresses, company]) => {
        setMail(mails);
        setPhone(phones);
        setAddressList(addresses);
        setCompanyAux(company);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const mapConstitutiveData = useCallback(() => {
    return (
      <>
        {companyAux && (
          <>
            <Grid item xs={12}>
              <DataWithLabel
                label={'Tipo Persona'}
                data={companyAux[CompanyDetailFormFields.PersonTypeDesc]}
                rowDirection
                fullWidth
              />
            </Grid>
            {isLegalPerson && (
              <Grid item xs={12}>
                <DataWithLabel
                  label={'Tipo Sociedad'}
                  data={
                    companyAux[
                      CompanyDetailFormFields.PersonClassificationTypeDesc
                    ]
                  }
                  rowDirection
                  fullWidth
                />
              </Grid>
            )}
          </>
        )}

        <CompanyPersonalInformationDetailConstituveInformation
          company={companyAux}
        />
        <CompanyPersonalInformationDetailTaxSituation company={companyAux} />
      </>
    );
  }, [company, companyAux]);

  const mapRelationalData = useCallback(() => {
    let phoneNumber: string = phone
      ? stringFormatter.phoneNumberWithAreaCode(
          phone[CompanyPhoneNumberFields.AreaCode],
          phone[CompanyPhoneNumberFields.PhoneNumber],
        ) || '-'
      : '-';

    const labelProps: ActivityLabelWithDataProps[] = [
      { label: 'Mail', data: mail?.[CompanyMailViewDTOFields.Mail] },
      { label: 'Teléfono', data: phoneNumber },
      {
        label: 'Web',
        data:
          companyAux?.[CompanyViewDTOFields.Web] ||
          company[CompanyViewDTOFields.Web],
      },
      {
        label: 'Red Social',
        data:
          companyAux?.[CompanyViewDTOFields.SocialNetwork] ||
          company[CompanyViewDTOFields.SocialNetwork],
      },
    ];
    return labelProps.map((props) => (
      <Grid item xs={12}>
        <DataWithLabel
          label={props.label}
          data={props.data}
          rowDirection
          fullWidth
        />
      </Grid>
    ));
  }, [company, companyAux, mail, phone]);

  return (
    <>
      {loading ? (
        <CompanyDetailSkeleton />
      ) : (
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={1} sx={{ ...boxSx, mt: 2 }}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              sx={{ width: 1 }}
            >
              <MarketTypography
                sx={{
                  fontSize: 'calc(1.26rem + .12vw)',
                }}
              >
                Información de Contacto
              </MarketTypography>
              <ExpandIconButton
                onClick={() =>
                  setRelationalDataExpanded(!relationalDataExpanded)
                }
                initialExpanded={'expandLess'}
                tooltipTitle={relationalDataExpanded ? 'Contraer' : 'Expandir'}
              />
            </Stack>

            <Collapse in={relationalDataExpanded}>
              <Grid container item xs={12} sx={{ mb: 1 }} spacing={1}>
                {mapRelationalData()}
              </Grid>

              <Grid container item xs={12}>
                <AddressList
                  list={addressList}
                  wrapperProps={{ gap: 1, width: '100%' }}
                  Wrapper={Stack}
                />
              </Grid>
            </Collapse>
          </Grid>

          <Grid container item xs={12} spacing={1} sx={{ ...boxSx, mt: 2 }}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              sx={{ width: 1 }}
            >
              <Stack
                direction={'row'}
                alignItems={'center'}
                spacing={2}
                sx={{ width: 1 }}
              >
                <MarketTypography
                  sx={{
                    fontSize: 'calc(1.26rem + .12vw)',
                  }}
                >
                  Información Constitutiva e Impositiva
                </MarketTypography>
                <Tooltip arrow title="CUIT" placement="top">
                  <Chip
                    color="info"
                    size="small"
                    label={stringFormatter.formatCuit(
                      companyAux?.[CompanyViewDTOFields.CUIT] ?? '',
                    )}
                  />
                </Tooltip>
              </Stack>
              <ExpandIconButton
                onClick={() =>
                  setConstitutiveDataExpanded(!constitutiveDatExpanded)
                }
                initialExpanded={'expandLess'}
                tooltipTitle={constitutiveDatExpanded ? 'Contraer' : 'Expandir'}
              />
            </Stack>

            <Collapse in={constitutiveDatExpanded}>
              <Grid container item xs={12} sx={{ mb: 1 }} spacing={1}>
                {mapConstitutiveData()}
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default CompanyDetail;
