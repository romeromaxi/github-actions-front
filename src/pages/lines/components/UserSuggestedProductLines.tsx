import {Box, Card, CardHeader, Typography} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ProductLineView } from 'types/lines/productLineData';
import { HttpUserProductLine } from 'http/index';
import ProductLineCarousel from "../../markets/lines/components/ProductLineCarousel";
import {AppConfigFields, AppConfigLogosFields} from "../../../types/appConfigEntities";

const UserSuggestedProductLines = () => {
  const [productLines, setProductLines] = useState<ProductLineView[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    HttpUserProductLine.getSuggestions()
      .then(setProductLines)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
        <CardHeader title={'Productos recomendados para tus empresas'} />
        {loading ?
            <ProductLineCarousel productLines={undefined} />
            :
            productLines && productLines.length !== 0 ?
                <ProductLineCarousel productLines={productLines} />
                :
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <Box sx={{
                      gap: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '60%'
                  }}>
                      <Box component="img"
                           src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                           sx={{width: '350px', height: '200px'}}
                      />
                      <Typography variant={'h4'} fontWeight={500} textAlign={'center'}>
                          Todavía no encontramos líneas sugeridas para vos
                      </Typography>
                  </Box>
                </Box>
        }
    </Card>
  );
};

export default UserSuggestedProductLines;
