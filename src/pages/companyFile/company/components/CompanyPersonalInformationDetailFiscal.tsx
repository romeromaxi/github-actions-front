import React from 'react';
import { Grid } from '@mui/material';
import SectionDivider from 'components/cards/SectionDivider';
import { DataWithLabel } from 'components/misc/DataWithLabel';
import { numberFormatter } from 'util/formatters/numberFormatter';
import { CompanyForm, CompanyViewDTOFields } from 'types/company/companyData';

interface CompanyPersonalInformationDetailFiscalProps {
  company: CompanyForm;
  isPhysical?: boolean;
}

const CompanyPersonalInformationDetailFiscal = ({
  company,
  isPhysical,
}: CompanyPersonalInformationDetailFiscalProps) => {
  const hasClosingDate: boolean =
    !!company[CompanyViewDTOFields.DayClosing] &&
    !!company[CompanyViewDTOFields.MonthClosing];
  const dateClosing: string = hasClosingDate
    ? `${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`
    : '';
  const hasRegisteredAtIIBB =
    company[CompanyViewDTOFields.RegisteredAtIIBB] !== null;
  const hasMultilateralAgreement =
    company[CompanyViewDTOFields.HasMultilateralAgreement] !== null;

  return (
    <Grid container>
      <Grid item xs={12} mb={2}>
        <SectionDivider title={'Información Fiscal'} />
      </Grid>
      <Grid item xs={12} md={3.5}>
        <DataWithLabel
          label="Condición IIBB"
          data={
            hasRegisteredAtIIBB
              ? company[CompanyViewDTOFields.RegisteredAtIIBB]
                ? 'Si'
                : 'No'
              : undefined
          }
          rowDirection
        />
      </Grid>
      <Grid item xs={12} md={isPhysical ? 4 : 5}>
        {!isPhysical && (
          <DataWithLabel
            label="Cierre de Ejercicio Económico"
            data={dateClosing}
            rowDirection
          />
        )}
      </Grid>
      <Grid item xs={12} md={3.5}>
        <DataWithLabel
          label="Convenio Multilateral"
          data={
            hasMultilateralAgreement
              ? company[CompanyViewDTOFields.HasMultilateralAgreement]
                ? 'Si'
                : 'No'
              : undefined
          }
          rowDirection
        />
      </Grid>
      <Grid item xs={12} md={7}>
        <DataWithLabel
          label="Condición frente al IVA"
          data={company[CompanyViewDTOFields.PersonResponsibilityTypeDesc]}
          rowDirection
        />
      </Grid>
      <Grid item md={5}>
        <DataWithLabel
          label={'Facturación último año'}
          data={
            (company[CompanyViewDTOFields.BillingAmount] != null)
              ? `${numberFormatter.toStringWithAmount(company[CompanyViewDTOFields.BillingAmount], '$')}`
              : null
          }
          rowDirection
        />
      </Grid>

      {isPhysical && (
        <>
          <Grid item xs={12} md={7.5}>
            <DataWithLabel
              label="Autónomo"
              data={company[CompanyViewDTOFields.SelfEmployedTypeDesc]}
              rowDirection
            />
          </Grid>
          <Grid item xs={12} md={4.5}>
            <DataWithLabel
              label="Monotributista"
              data={company[CompanyViewDTOFields.MonotaxTypeDesc]}
              rowDirection
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CompanyPersonalInformationDetailFiscal;
