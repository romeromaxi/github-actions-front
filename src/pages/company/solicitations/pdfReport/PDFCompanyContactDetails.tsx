import React from 'react';
import { Style } from '@react-pdf/types';
import { PDFDataWithLabel, PDFSubTitle } from 'components/pdf';

import { AddressTypes } from 'types/general/generalEnums';
import { EntityAddressFields } from 'types/general/generalReferentialData';
import {
  CompanyFields,
  CompanyForm,
  CompanyViewDTOFields,
} from 'types/company/companyData';

import { dateFormatter } from 'util/formatters/dateFormatter';
import { AddressFormatter } from 'util/formatters/addressFormatter';
import { stringFormatter } from '../../../../util/formatters/stringFormatter';

interface PDFCompanyContactDetailsProps {
  company: CompanyForm;
  isPhysicalPerson: boolean;
}

function PDFCompanyContactDetails({
  company,
  isPhysicalPerson,
}: PDFCompanyContactDetailsProps) {
  const contentDataStyle: Style = { justifyContent: 'space-between' };
  const activityAddress = company[CompanyViewDTOFields.Address].find(
    (x) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity,
  );
  const completeAddress: string = activityAddress
    ? AddressFormatter.toFullAddress(activityAddress)
    : '-';

  return (
    <>
      <PDFSubTitle title={'Datos de Contacto'} />

      <PDFDataWithLabel
        label={'Razón Social'}
        data={company[CompanyViewDTOFields.BusinessName]}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'CUIT'}
        data={company[CompanyViewDTOFields.CUIT]}
        contentStyle={contentDataStyle}
      />

      {isPhysicalPerson && (
        <>
          <PDFDataWithLabel
            label={'Tipo Documento'}
            data={company[CompanyViewDTOFields.DocumentTypeDesc] || '-'}
            contentStyle={contentDataStyle}
          />
          <PDFDataWithLabel
            label={'Nro. Documento'}
            data={company[CompanyViewDTOFields.DocumentNumber] || '-'}
            contentStyle={contentDataStyle}
          />
          <PDFDataWithLabel
            label={'Fecha de Nacimiento'}
            data={dateFormatter.toShortDate(
              company[CompanyViewDTOFields.BirthdayDate],
            )}
            contentStyle={contentDataStyle}
          />
        </>
      )}

      <PDFDataWithLabel
        label={'Domicilio de Actividad'}
        data={completeAddress}
        contentStyle={contentDataStyle}
        mediumWidth
      />
      <PDFDataWithLabel
        label={'Mail'}
        data={company[CompanyViewDTOFields.Mail]}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'Teléfono'}
        data={stringFormatter.phoneNumberWithAreaCode(
          company[CompanyFields.AreaCode],
          company[CompanyViewDTOFields.Phone] as string,
        )}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'Sitio Web'}
        data={company[CompanyFields.Web] || '-'}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'Red Social'}
        data={company[CompanyFields.SocialNetwork] || '-'}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'¿Es liderada por mujeres?'}
        data={company[CompanyViewDTOFields.IsLeadByWoman] ? 'Si' : 'No'}
        contentStyle={contentDataStyle}
      />
    </>
  );
}

export default PDFCompanyContactDetails;
