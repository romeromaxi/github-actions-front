import React, { useEffect, useState } from 'react';
import { ProductLineView } from '../../../../types/lines/productLineData';
import { Alert, Grid } from '@mui/material';
import CardBaseLoading from '../../../../components/cards/CardBaseLoading';
import { EnumColors } from '../../../../types/general/generalEnums';
import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPaginationFields,
} from '../../../../types/baseEntities';
import { Pagination } from 'components/table';
import ProductLineCard from './ProductLineCard';
import { CompanyViewDTO } from '../../../../types/company/companyData';
import { HttpCompany } from '../../../../http';

interface productLineListGridProps {
  productLineList?: EntityListWithPagination<ProductLineView>;
  onPaging: (page: number) => void;
}

function productLineListGrid({
  productLineList,
  onPaging,
}: productLineListGridProps) {
  const [companies, setCompanies] = useState<CompanyViewDTO[]>([]);

  useEffect(() => {
    HttpCompany.getCompaniesByUser().then((response) => {
      setCompanies(response);
    });
  }, []);

  const mapLoading = () =>
    Array.from(Array(6).keys()).map((item) => (
      <Grid item xs={4} key={`keyProductLineCardBaseLoading_${item}`}>
        <CardBaseLoading baseColor={EnumColors.MARKET_BLUE} />
      </Grid>
    ));

  return (
    <Grid container spacing={1} item xs={9} alignContent="flex-start">
      {productLineList
        ? productLineList[EntityListWithPaginationFields.List].map(
            (line, index) => (
              <Grid item xs={4} key={index}>
                <ProductLineCard productLine={line} />
              </Grid>
            ),
          )
        : mapLoading()}

      <Grid item xs={12}>
        {productLineList ? (
          productLineList[EntityListWithPaginationFields.Pagination][
            EntityPaginationFields.CantRecords
          ] > 0 ? (
            <Pagination
              entityPagination={
                productLineList[EntityListWithPaginationFields.Pagination]
              }
              onPaging={onPaging}
              blocks
              isLoading={false}
            />
          ) : (
            <Alert severity={'info'}>
              No se han encontrado líneas para los parámetros ingresados
            </Alert>
          )
        ) : null}
      </Grid>
    </Grid>
  );
}

export default productLineListGrid;
