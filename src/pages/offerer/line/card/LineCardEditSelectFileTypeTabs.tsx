import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import {Alert, Box, Card, CardContent, CardHeader, Stack} from '@mui/material';
import {
  AddTwoTone,
  BusinessTwoTone,
  MonetizationOnTwoTone,
} from '@mui/icons-material';

import { ControlledOptionBox } from 'components/forms/ControlledOptionBox';
import { CompanyFileType } from 'types/company/companyEnums';
import { ProductLineFields } from 'types/lines/productLineData';
import { useProductLineDetail } from '../../../lines/ProductLineDetailContext';

function LineCardEditSelectFileTypeTabs() {
  const { allowEdit } = useProductLineDetail();
  const { control } = useFormContext();

  const iconLongFile = (
    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
      <BusinessTwoTone />
      <AddTwoTone sx={{ fontSize: '1rem !important' }} />
      <MonetizationOnTwoTone />
    </Stack>
  );

  
  
  return (
      <Card>
          <CardHeader title='Legajo solicitado'/>
          <CardContent>
            <Box>
              <Alert color={'info'} severity={'info'}>
                  Seleccionar qué tipo de legajo debe presentar la PyME para presentar una solicitud
              </Alert>  
        
              <ControlledOptionBox
                control={control}
                name={ProductLineFields.FileTypeCode}
                disabled={!allowEdit}
                row
                options={[
                  {
                    value: CompanyFileType.Short,
                    labelKey: 'Legajo de Contacto',
                    descriptionKey:
                      '',
                    icon: <BusinessTwoTone sx={{ fontSize: '80px' }} />,
                  },
                  /*{
                    value: CompanyFileType.Long,
                    labelKey: 'Legajo de Contacto +  Información Económica-Financiera',
                    descriptionKey:
                      '',
                    icon: iconLongFile,
                  },*/
                ]}
              />
            </Box>
          </CardContent>
      </Card>
  );
}

export default LineCardEditSelectFileTypeTabs;
