import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Alert } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from 'types/solicitations/solicitationData';
import { HttpSolicitation } from 'http/index';
import { ProductServiceColorMap } from '../../../util/typification/productServiceColor';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { ProductServiceTypes } from '../../../types/product/productdestinyData';

interface CompanySolicitationByProductServiceProps {
  companyId: number;
}

const CompanySolicitationByProductService = ({
  companyId,
}: CompanySolicitationByProductServiceProps) => {
  const [serviceData, setServiceData] = useState<SolicitationTotalsView[]>();

  useEffect(() => {
    HttpSolicitation.getSolicitationsByProductService(companyId).then(
      setServiceData,
    );
  }, []);

  const getTotalQuantity = () => {
    let total: number = 0;

    if (serviceData && serviceData.length)
      serviceData.map(
        (t) => (total += t[SolicitationTotalsViewFields.SolicitationsQuantity]),
      );

    return total;
  };

  return (
    <Card sx={{ width: 1, height: 1, maxHeight: '400px' }}>
      <CardHeader
        title={
          <Typography fontSize={28} fontWeight={600} color={'rgb(0, 158, 247)'}>
            {getTotalQuantity()}
          </Typography>
        }
        subheader={'Cantidad de solicitudes por servicio'}
      />
      <CardContent sx={{ width: 1, height: 9 / 10 }}>
        {serviceData && serviceData.length !== 0 && getTotalQuantity() !== 0 ? (
          <ResponsiveContainer width="99%" height={'99%'}>
            <BarChart
              width={450}
              height={350}
              data={serviceData}
              margin={{
                top: 5,
                right: 25,
                left: 0,
                bottom: 5,
              }}
              layout={'vertical'}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type={'number'}
                dataKey={'cantidadSolicitudes'}
                allowDecimals={false}
              />
              <YAxis
                type={'category'}
                dataKey={'descripcion'}
                tick={{ strokeWidth: 2, fontWeight: 'bold', fontSize: 10 }}
                width={130}
              />
              <Tooltip />
              <Bar
                dataKey={'cantidadSolicitudes'}
                radius={[0, 10, 10, 0]}
                name={'Cantidad por servicios'}
                label={{
                  value: 'Servicio',
                  angle: -90,
                  position: 'insideLeft',
                }}
                barSize={30}
              >
                {serviceData.map((entry, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ProductServiceColorMap[
                          entry[EntityWithIdFields.Id] as ProductServiceTypes
                        ].light
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Alert severity={'info'}>
              Aún no se han registrado solicitudes
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySolicitationByProductService;
