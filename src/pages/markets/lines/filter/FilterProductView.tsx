import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ControlledMultipleSelect } from 'components/forms/ControlledMultipleSelect';
import { ProductLineFilterContext } from '../ProductLineSearch';
import { FilterProductLineSearchFields } from 'types/lines/productLineData';
import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../../types/baseEntities';
import { HttpMarketIntermediate } from '../../../../http/market';
import { IntermediateProductFields } from '../../../../types/market/marketIntermediateData';
import { marketFilterStorage } from '../../../../util/sessionStorage/marketFiltersStorage';
import { haveSameElements } from '../../../../util/helpers';

interface FilterProductViewProps {
  disabled?: boolean;
}

function FilterProductView({ disabled }: FilterProductViewProps) {
  const { filters, setFieldFilter } = useContext(ProductLineFilterContext);
  const codsProducts = filters[FilterProductLineSearchFields.CodsProduct] ?? [];

  const destinyCodeList = useMemo(
    () => filters[FilterProductLineSearchFields.CodsProductDestiny] ?? [],
    [filters[FilterProductLineSearchFields.CodsProductDestiny]],
  );
  const serviceCodeList = useMemo(
    () => filters[FilterProductLineSearchFields.CodsProductService] ?? [],
    [filters[FilterProductLineSearchFields.CodsProductService]],
  );
  const instrumentTypeCodeList = useMemo(
    () =>
      filters[FilterProductLineSearchFields.CodsProductInstrumentType] ?? [],
    [filters[FilterProductLineSearchFields.CodsProductInstrumentType]],
  );

  const storageDestinyCodeList =
    marketFilterStorage.getSearchFilter()?.[
      FilterProductLineSearchFields.CodsProductDestiny
    ] || [];
  const storageServiceCodeList =
    marketFilterStorage.getSearchFilter()?.[
      FilterProductLineSearchFields.CodsProductService
    ] || [];
  const storageInstrumentCodeList =
    marketFilterStorage.getSearchFilter()?.[
      FilterProductLineSearchFields.CodsProductInstrument
    ] || [];
  const storageProductList =
    marketFilterStorage.getSearchFilter()?.[
      FilterProductLineSearchFields.CodsProduct
    ] ||
    marketFilterStorage.getLandingFilter()?.[
      FilterProductLineSearchFields.CodsProduct
    ] ||
    [];

  const [products, setProducts] = useState<EntityWithIdAndDescription[]>();

  useEffect(() => {
    const unchangedFilter =
      haveSameElements(destinyCodeList, storageDestinyCodeList) &&
      haveSameElements(serviceCodeList, storageServiceCodeList) &&
      haveSameElements(instrumentTypeCodeList, storageInstrumentCodeList);
    HttpMarketIntermediate.getProducts(
      destinyCodeList,
      serviceCodeList,
      instrumentTypeCodeList,
    ).then((prods) => {
      const newList = prods.map((d) => ({
        [EntityWithIdAndDescriptionFields.Id]: d[EntityWithIdFields.Id],
        [EntityWithIdAndDescriptionFields.Description]:
          d[IntermediateProductFields.ProductDesc],
      }));
      const productIdList = newList.map(
        (p) => p[EntityWithIdAndDescriptionFields.Id],
      );
      setProducts([...newList]);
      if (!marketFilterStorage.hasLandingProduct()) {
        if (unchangedFilter) {
          setCodsProducts(
            [...productIdList] ||
              marketFilterStorage.getSearchFilter()?.[
                FilterProductLineSearchFields.CodsProduct
              ],
          );
        } else {
          setCodsProducts([...productIdList]);
        }
      } else {
        setCodsProducts([...storageProductList]);
      }
    });
  }, [destinyCodeList, serviceCodeList, instrumentTypeCodeList]);

  const setCodsProducts = (productListId: number[]) =>
    setFieldFilter(
      productListId,
      FilterProductLineSearchFields.CodsProduct,
      true,
    );

  const onSearch = () =>
    setFieldFilter(
      codsProducts,
      FilterProductLineSearchFields.CodsProduct,
      true,
    );

  const deleteProduct = (productListId: number[]) =>
    setFieldFilter(
      productListId,
      FilterProductLineSearchFields.CodsProduct,
      true,
    );

  return (
    <ControlledMultipleSelect
      id="selMulProductsLinesSearch"
      label="Productos"
      lstData={products}
      field={'Products'}
      hideRender
      valuesSelected={codsProducts}
      onClose={onSearch}
      onHandleChange={(_, value?: number[]) => setCodsProducts(value || [])}
      onHandleDelete={(_, value?: number[]) => deleteProduct(value || [])}
      sx={{ width: '100%', backgroundColor: 'white' }}
      fullWidth
      disabled={disabled}
    />
  );
}

export default FilterProductView;
