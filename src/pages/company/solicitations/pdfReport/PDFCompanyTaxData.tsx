import React from 'react';
import { Style } from '@react-pdf/types';
import { PDFDataWithLabel, PDFSubTitle } from 'components/pdf';

import { CompanyForm, CompanyViewDTOFields } from 'types/company/companyData';

interface PDFCompanyTaxDataProps {
  company: CompanyForm;
  isPhysicalPerson: boolean;
}

function PDFCompanyTaxData({
  company,
  isPhysicalPerson,
}: PDFCompanyTaxDataProps) {
  const contentDataStyle: Style = { justifyContent: 'space-between' };
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
    <>
      <PDFSubTitle title={'Información Fiscal'} />

      <PDFDataWithLabel
        label={'Condición IIBB'}
        data={
          hasRegisteredAtIIBB
            ? company[CompanyViewDTOFields.RegisteredAtIIBB]
              ? 'Si'
              : 'No'
            : '-'
        }
        contentStyle={contentDataStyle}
      />

      {!isPhysicalPerson && (
        <PDFDataWithLabel
          label={'Cierre de Ejercicio Económico'}
          data={dateClosing || '-'}
          contentStyle={contentDataStyle}
        />
      )}
      <PDFDataWithLabel
        label={'Convenio Multilateral'}
        data={
          hasMultilateralAgreement
            ? company[CompanyViewDTOFields.HasMultilateralAgreement]
              ? 'Si'
              : 'No'
            : '-'
        }
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'Condición frente al IVA'}
        data={company[CompanyViewDTOFields.PersonResponsibilityTypeDesc]}
        contentStyle={contentDataStyle}
      />
      {isPhysicalPerson && (
        <>
          <PDFDataWithLabel
            label={'Monotributista'}
            data={company[CompanyViewDTOFields.MonotaxTypeDesc] || '-'}
            contentStyle={contentDataStyle}
          />
          <PDFDataWithLabel
            label={'Autónomo'}
            data={company[CompanyViewDTOFields.SelfEmployedTypeDesc] || '-'}
            contentStyle={contentDataStyle}
          />
        </>
      )}
    </>
  );
}

export default PDFCompanyTaxData;
