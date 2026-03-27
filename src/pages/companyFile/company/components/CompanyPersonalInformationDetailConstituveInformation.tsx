import React from 'react';

import { Grid, Skeleton } from '@mui/material';
import {
  CompanyForm,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { PersonTypes } from 'types/person/personEnums';
import {
  DataWithLabel,
  DataWithLabelProps,
} from 'components/misc/DataWithLabel';

interface CompanyPersonalInformationDetailConstituveInformationProps {
  company?: CompanyForm | CompanyViewDTO;
}

function CompanyPersonalInformationDetailConstituveInformation(
  props: CompanyPersonalInformationDetailConstituveInformationProps,
) {
  const hasClosingDate: boolean =
    !!props.company &&
    !!props.company[CompanyViewDTOFields.DayClosing] &&
    !!props.company[CompanyViewDTOFields.MonthClosing];
  const isLegalPerson: boolean =
    !!props.company &&
    props.company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;
  let labelProps: DataWithLabelProps[] = [];

  if (isLegalPerson)
    labelProps.push({
      label: 'Fecha Contrato Social',
      data: dateFormatter.toShortDate(
        props.company?.[CompanyViewDTOFields.SocialContractDate] || '',
      ),
    });

  labelProps.push({
    label: 'Cierre de Ejercicio Económico',
    data: hasClosingDate
      ? `${props.company?.[CompanyViewDTOFields.DayClosing]}/${props.company?.[CompanyViewDTOFields.MonthClosing]}`
      : '-',
  });

  if (isLegalPerson)
    labelProps.push({
      label: 'Pertenece a Grupo Económico',
      data: props.company?.[CompanyViewDTOFields.BelongsEconomicGroup]
        ? 'Si'
        : 'No',
    });

  return (
    <>
      {props.company ? (
        labelProps.map((labelProp, index) => (
          <Grid
            item
            xs={12}
            key={`companyPersonalInformationDetailConstituveInformation_${index}`}
          >
            <DataWithLabel
              label={labelProp.label}
              data={labelProp.data}
              type={labelProp.type}
              rowDirection
              fullWidth
            />
          </Grid>
        ))
      ) : (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      )}
    </>
  );
}

export default CompanyPersonalInformationDetailConstituveInformation;
