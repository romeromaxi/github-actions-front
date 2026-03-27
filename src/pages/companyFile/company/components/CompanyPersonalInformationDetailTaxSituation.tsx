import React from 'react';

import { Skeleton } from '@mui/lab';
import { Grid, Stack } from '@mui/material';
import {
  CompanyFields,
  CompanyForm,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { PersonTypes } from 'types/person/personEnums';
import {
  DataWithLabel,
  DataWithLabelProps,
} from 'components/misc/DataWithLabel';
import { dateFormatter } from 'util/formatters/dateFormatter';
import {PublicEntityEnums} from "../../../../util/typification/publicEntityEnums";

interface CompanyPersonalInformationDetailTaxSituationProps {
  company?: CompanyForm | CompanyViewDTO;
}

function CompanyPersonalInformationDetailTaxSituation(
  props: CompanyPersonalInformationDetailTaxSituationProps,
) {
  if (!props.company)
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );

  const isLegalPerson: boolean =
    !!props.company &&
    props.company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;

  let labelProps: DataWithLabelProps[] = [
    {
      label: `Fecha Inscripción ${PublicEntityEnums.ARCA}`,
      data: dateFormatter.toYearMonth(
        props.company?.[CompanyViewDTOFields.AfipRegistrationDate],
      ),
    },
    {
      label: 'Condición Frente IVA',
      data: props.company?.[CompanyViewDTOFields.PersonResponsibilityTypeDesc],
    },
    {
      label: 'Condición IIBB',
      data: props.company?.[CompanyViewDTOFields.RegisteredAtIIBB]
        ? 'Si'
        : 'No',
    },
    { label: 'Nro. IIBB', data: props.company?.[CompanyFields.CUIT] },
  ];

  if (!isLegalPerson) {
    labelProps.push({
      label: 'Monotributista',
      data: props.company?.[CompanyViewDTOFields.MonotaxTypeDesc],
    });
    labelProps.push({
      label: 'Autónomo',
      data: props.company?.[CompanyViewDTOFields.SelfEmployedTypeDesc],
    });
  } else {
    let hasCertificatePyme: boolean =
      props.company?.[CompanyViewDTOFields.HasCertificatePyme] || false;
    let dateCertificatePyme: string = hasCertificatePyme
      ? dateFormatter.toShortDate(
          props.company?.[CompanyViewDTOFields.CertificatePymeDate],
        )
      : '-';

    labelProps.push({
      label: 'Posee Convenio Multilateral',
      data: props.company?.[CompanyViewDTOFields.HasMultilateralAgreement]
        ? 'Si'
        : 'No',
    });
    labelProps.push({
      label: 'Posee Certificado Pyme',
      data: props.company?.[CompanyViewDTOFields.HasCertificatePyme]
        ? 'Si'
        : 'No',
    });
    labelProps.push({
      label: 'Vigencia Certificado Pyme',
      data: dateCertificatePyme,
    });
    labelProps.push({
      label: 'Pertenece a Grupo Económico',
      data: props.company?.[CompanyViewDTOFields.BelongsEconomicGroup]
        ? 'Si'
        : 'No',
    });
  }

  return (
    <Stack spacing={0.5}>
      {labelProps.map((labelProp, index) => (
        <Grid item xs={12} key={`activityLabelWithDataLabelProp_${index}`}>
          {
            <DataWithLabel
              label={labelProp.label}
              data={labelProp.data}
              rowDirection
              fullWidth
            />
          }
        </Grid>
      ))}
    </Stack>
  );
}

export default CompanyPersonalInformationDetailTaxSituation;
