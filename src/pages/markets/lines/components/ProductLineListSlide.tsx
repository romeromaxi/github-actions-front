import React, { useEffect, useState } from 'react';
import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
} from '../../../../types/baseEntities';
import {
  ProductLineFields,
  ProductLineView,
} from '../../../../types/lines/productLineData';
import { groupBy } from '../../../../util/helpers';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductSlider from './ProductSlider';
import { CompanyViewDTO } from '../../../../types/company/companyData';
import { HttpCompany } from '../../../../http';

interface ProductLineListSlideProps {
  productLineList?: EntityListWithPagination<ProductLineView>;
  // onPaging: (page: number) => void,
}

function ProductLineListSlide({ productLineList }: ProductLineListSlideProps) {
  const [groupedLines, setGroupedLines] = useState<{
    [key: string]: ProductLineView[];
  }>({});
  const [companies, setCompanies] = useState<CompanyViewDTO[]>([]);

  useEffect(() => {
    productLineList &&
      setGroupedLines(
        groupBy(productLineList?.[EntityListWithPaginationFields.List], [
          ProductLineFields.ProductDesc,
        ]),
      );
    HttpCompany.getCompaniesByUser().then((response) => {
      setCompanies(response);
    });
  }, [productLineList]);

  return (
    <>
      {Object.entries(groupedLines).map((entry) => (
        <ProductSlider
          title={entry[0]}
          companies={companies}
          lineList={entry[1]}
        />
      ))}
    </>
  );
}

export default ProductLineListSlide;
