import React from 'react';
import { Style } from '@react-pdf/types';

import { PDFDataWithLabel, PDFSubTitle } from 'components/pdf';

import { dateFormatter } from 'util/formatters/dateFormatter';
import { CompanyForm, CompanyViewDTOFields } from 'types/company/companyData';

interface PDFCompanyCertificateDataProps {
  company: CompanyForm;
  isPhysicalPerson: boolean;
}

function PDFCompanyCertificateData({
  company,
  isPhysicalPerson,
}: PDFCompanyCertificateDataProps) {
  const contentDataStyle: Style = { justifyContent: 'space-between' };
  const hasCertificatePyme: boolean =
    !!company[CompanyViewDTOFields.HasCertificatePyme];
  const certificatePymeDate: string = !hasCertificatePyme
    ? '-'
    : dateFormatter.toShortDate(
          company[CompanyViewDTOFields.CertificatePymeDate],
        ) === '-'
      ? ''
      : dateFormatter.toShortDate(
          company[CompanyViewDTOFields.CertificatePymeDate],
        );

  return (
    <>
      <PDFSubTitle title={'Certificado MiPyME'} />

      <PDFDataWithLabel
        label={'Certificado MiPyME'}
        data={company[CompanyViewDTOFields.HasCertificatePyme] ? 'Si' : 'No'}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'Vigencia'}
        data={certificatePymeDate}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'Categoría MiPyME'}
        data={
          hasCertificatePyme
            ? company[CompanyViewDTOFields.AfipSectionDesc] || '-'
            : company[CompanyViewDTOFields.AfipSectionDesc] || '-'
        }
        contentStyle={contentDataStyle}
      />

      {!isPhysicalPerson && (
        <PDFDataWithLabel
          label={'Grupo Económico'}
          data={
            company[CompanyViewDTOFields.BelongsEconomicGroup] ? 'Si' : 'No'
          }
          contentStyle={contentDataStyle}
        />
      )}
    </>
  );
}

export default PDFCompanyCertificateData;
