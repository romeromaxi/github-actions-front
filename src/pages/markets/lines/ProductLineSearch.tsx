import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid, Drawer, useMediaQuery, useTheme, Button, Stack, Chip } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import {
  FilterProductLineSearch,
  FilterProductLineSearchFields, ProductLineGondolaFilter, ProductLineGondolaViewFields,
  ProductLineView,
} from 'types/lines/productLineData';
import {
  EntityPaginationFields, EntityWithBooleanIdAndDescription,
} from 'types/baseEntities';

import { HttpProductLine } from 'http/index';
import ProductLineFilter from './ProductLineFilter';
import {
  useLocation,
} from 'react-router-dom';
import { marketFilterStorage } from 'util/sessionStorage/marketFiltersStorage';
import ProductLineFilterDropdown from "./filter/ProductLineFilterDropdown";
import ProductLinesGroupByService from "./components/ProductLinesGroupByService";
import { X } from 'phosphor-react';
import { WrapperIcons } from '../../../components/icons/Icons';

export const ProductLineFilterContext = React.createContext({
  productLines: undefined as ProductLineView[] | undefined,
  filters: {} as FilterProductLineSearch,
  filterOpts: undefined as ProductLineGondolaFilter[] | undefined,
  setFieldFilter: (
    entityList: EntityWithBooleanIdAndDescription[],
    field: FilterProductLineSearchFields,
    stack?: boolean, firstRender?: boolean
  ) => {},
  selectedValues: {} as SelectedFilters,
  setSelectedValues: (values: SelectedFilters) => {},
  clearFilters: () => {}
});

const pageSize: number = 5000;

export const defaultSearchValues: FilterProductLineSearch = {
  [FilterProductLineSearchFields.CodsProductInstrument]: undefined,
  [FilterProductLineSearchFields.CodsOfferer]: undefined,
  [FilterProductLineSearchFields.CodsProductRateType]: undefined,
  [FilterProductLineSearchFields.CodsProductAmortizationType]: undefined,
  [FilterProductLineSearchFields.CodsProvince]: undefined,
  [FilterProductLineSearchFields.CodsSector]: undefined,
  [FilterProductLineSearchFields.CodsProductNeed]: [], //eliminar cuando haya alguna categoria que filtre por necesidad
  // @ts-ignore
  [FilterProductLineSearchFields.Billing]: '',
  // @ts-ignore
  [FilterProductLineSearchFields.AmountToFinance]: undefined,
  [EntityPaginationFields.ActualPage]: 1,
  [EntityPaginationFields.PageSize]: pageSize,
};

export type SelectedFilters = {
  [key: string]: EntityWithBooleanIdAndDescription[]
}

function ProductLineSearch() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const location = useLocation();
  const [previousLocation, setPreviousLocation] = useState(location);
  const [productLines, setProductLines] =
    useState<ProductLineView[]>();
  const [filters, setFilters] = useState<FilterProductLineSearch>({
    ...defaultSearchValues,
    ...marketFilterStorage.getLandingFilter(),
    ...marketFilterStorage.getSearchFilter(),
  });
  const [filterOpts, setFilterOpts] = useState<ProductLineGondolaFilter[]>()
  
  const [selectedValues, setSelectedValues] = useState<SelectedFilters>({
    ...marketFilterStorage.getStackedFilters()
  });

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []);

  useEffect(() => {
    if (location.search !== previousLocation.search) {
      const newFilter = {
        ...defaultSearchValues,
        ...marketFilterStorage.getLandingFilter(),
        ...marketFilterStorage.getSearchFilter(),
      };
      
      setFilters(newFilter);
      searchProductLines(newFilter);
    }
    setPreviousLocation(location);
    setSelectedValues({...marketFilterStorage.getStackedFilters()})
  }, [location]);

  useEffect(() => {
    const newFilter = {
      ...filters,
      ...marketFilterStorage.getLandingFilter(),
      ...marketFilterStorage.getSearchFilter(),
    };
    searchProductLines(newFilter);
    setSelectedValues({...marketFilterStorage.getStackedFilters()})
  }, []);

  const searchProductLines = useCallback((filter: FilterProductLineSearch) => {
    setProductLines(undefined);
    marketFilterStorage.saveSearchFilter(filter);
    HttpProductLine.getProductLineGondolas(filter).then((r) => {
      setProductLines(r[ProductLineGondolaViewFields.Lines])
      setFilterOpts(r[ProductLineGondolaViewFields.Filters])
    });
  }, []);

  const setFieldFilter = useCallback(
    (
      entityList: EntityWithBooleanIdAndDescription[],
      field: FilterProductLineSearchFields,
      stack: boolean = true, firstRender?: boolean
    ) => {
      const newFilter = {
        ...filters,
        [EntityPaginationFields.ActualPage]: 1,
        [field]: entityList.map((v) => v.id),
      };
      setFilters(newFilter);
      if (stack) {
        const newStackedValues: SelectedFilters = {
          ...selectedValues,
          ...marketFilterStorage.getStackedFilters(),
          [field]: entityList
        }
        setSelectedValues(newStackedValues)
        marketFilterStorage.saveStackedFilters(newStackedValues)
      }
      if (!firstRender) searchProductLines(newFilter);
    },
    [filters, selectedValues, searchProductLines]
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultSearchValues);
    setSelectedValues({});
    marketFilterStorage.saveStackedFilters({});
    searchProductLines(defaultSearchValues);
  }, [searchProductLines]);

  const handleDelete = useCallback(
    (v: EntityWithBooleanIdAndDescription, filters: EntityWithBooleanIdAndDescription[], name: string) => {
      const currentValues = filters.filter((value) => value.id !== v.id);
      setFieldFilter(currentValues, name as FilterProductLineSearchFields);
      setSelectedValues(prev => ({
        ...prev,
        [name]: currentValues
      }));
    },
    [setFieldFilter]
  );

  const renderFilterChips = () => {
    return (
      <Stack spacing={1} direction={'row'} alignItems={'center'} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {selectedValues && Object.entries(selectedValues).map(([key, filters]) =>
          filters.length !== 0 && filters.map((v, index) => 
            v.id && v.id !== 0 ? (
              <Chip 
                key={`${key}-${v.id}-${index}`}
                size={'small'} 
                label={v.descripcion}
                deleteIcon={<div style={{paddingTop: '4px'}}><WrapperIcons Icon={X} size={'sm'} /></div>}
                onDelete={() => handleDelete(v, filters, key)}
                sx={{ mb: 1 }}
              />
            ) : null
          )
        )}
      </Stack>
    );
  };

  const renderMobileFilterComponents = () => {
    if (!sidebarOpen) return null;
    
    return (
      <Box sx={{ p: 2, width: '80vw' }}>
        <ProductLineFilterDropdown />
        <Box sx={{ mt: 3 }}>
          <ProductLineFilter />
        </Box>
      </Box>
    );
  };

  return (
    <Box pb={4}>
      <ProductLineFilterContext.Provider
        value={{
          filters: filters,
          setFieldFilter: setFieldFilter,
          productLines: productLines,
          filterOpts: filterOpts,
          selectedValues: selectedValues,
          setSelectedValues: setSelectedValues,
          clearFilters: clearFilters
        }}
      >
        <Box sx={{ display: 'none' }}>
          <ProductLineFilterDropdown />
        </Box>

        {isMobile && (
          <>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              mt={2}
              height="100%"
              width="100%"
            >
              {renderFilterChips()}
              <Box mt="auto" width="100%" display="flex" justifyContent="flex-end">
                <Button
                  onClick={handleToggleSidebar}
                  size="small"
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: "100px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                    width: "fit-content",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  <FilterAltIcon sx={{ ml: 1 }} />
                  Filtros
                </Button>
              </Box>
            </Box>

            <Drawer
              anchor="left"
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              ModalProps={{
                keepMounted: false,
              }}
            >
              {renderMobileFilterComponents()}
            </Drawer>
          </>
        )}

        <Grid container spacing={4}>
          {!isMobile && (
            <>
              <Grid item xs={12} alignItems="center">
                <ProductLineFilterDropdown />
              </Grid>
              <Grid item lg={3} md={5} xs={12}>
                <ProductLineFilter />
              </Grid>
            </>
          )}
          <Grid item lg={9} md={7} xs={12}
                sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", }}>
            <Box 
              width="100%" 
              maxWidth="1200px"
            >
              <ProductLinesGroupByService
                productLineList={
                  productLines &&
                  productLines
                }
              />
            </Box>
          </Grid>

        </Grid>
      </ProductLineFilterContext.Provider>
    </Box>
  );
}

export default ProductLineSearch;