import {
  CompanyActivityFields,
  CompanyActivityView,
  CompanyAfipActivityFields,
  CompanyAfipActivityView,
} from 'types/company/companyActivityData';
import { PDFDataWithLabel, PDFSubTitle } from '../../../../components/pdf';
import React from 'react';
import { Style } from '@react-pdf/types';

interface PDFCompanyActivityDataProps {
  activity: CompanyActivityView;
  afipActivity: CompanyAfipActivityView;
}

function PDFCompanyActivityData({
  activity,
  afipActivity,
}: PDFCompanyActivityDataProps) {
  const contentDataStyle: Style = { justifyContent: 'space-between' };

  return (
    <>
      <PDFSubTitle title={'Actividad'} />

      <PDFDataWithLabel
        label={'Sector / Rubro'}
        data={`${afipActivity[CompanyAfipActivityFields.AfipSectorDesc]} / ${afipActivity[CompanyAfipActivityFields.AfipAreaDesc]}`}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'Actividad'}
        data={afipActivity[CompanyAfipActivityFields.AfipActivityDesc]}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'¿Es exportadora?'}
        data={activity[CompanyActivityFields.IsExporter] ? 'Si' : 'No'}
        contentStyle={contentDataStyle}
      />
      <PDFDataWithLabel
        label={'¿Es empleadora?'}
        data={activity[CompanyActivityFields.IsEmployer] ? 'Si' : 'No'}
        contentStyle={contentDataStyle}
      />
      {/*overflowWrap: 'anywhere'*/}
      <PDFDataWithLabel
        label={'Descripción'}
        data={activity[CompanyActivityFields.ActivityDesc]}
        contentStyle={contentDataStyle}
      />
    </>
  );
}

export default PDFCompanyActivityData;
