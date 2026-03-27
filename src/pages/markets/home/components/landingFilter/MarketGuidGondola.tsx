import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Drawer,
  useMediaQuery,
  useTheme,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  FilterProductLineSearch,
  FilterProductLineSearchFields,
  ProductLineGondolaFilter,
  ProductLineGondolaViewFields,
  ProductLineView,
} from 'types/lines/productLineData';
import {
  EntityPaginationFields,
  EntityWithBooleanIdAndDescription,
} from 'types/baseEntities';
import { HttpProductLine } from 'http/index';
import ProductLineFilter from '../../../lines/ProductLineFilter';
import ProductLinesGroupByService from '../../../lines/components/ProductLinesGroupByService';
import { X } from 'phosphor-react';
import { WrapperIcons } from '../../../../../components/icons/Icons';
import { ProductLineFilterContext, SelectedFilters, defaultSearchValues } from '../../../lines/ProductLineSearch';
import ProductLineCardLoading from "../../../lines/components/ProductLineCardLoading";
import ProductLineFilterLoading from "../../../lines/ProductLineFilterLoading";

interface MarketGuidGondolaProps {
  guid: string;
}

const MarketGuidGondola: React.FC<MarketGuidGondolaProps> = ({ guid }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [productLines, setProductLines] = useState<ProductLineView[]>();
  const [filters, setFilters] = useState<FilterProductLineSearch>({
    ...defaultSearchValues,
  });
  const [filterOpts, setFilterOpts] = useState<ProductLineGondolaFilter[]>();
  const [selectedValues, setSelectedValues] = useState<SelectedFilters>({});
  const [loading, setLoading] = useState<boolean>(true);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []);

  useEffect(() => {
    setLoading(true);
    setProductLines(undefined);
    setFilterOpts(undefined);
    
    HttpProductLine.getProductLineGondolasSearch(guid, filters)
      .then((r) => {
        setProductLines(r[ProductLineGondolaViewFields.Lines]);
        setFilterOpts(r[ProductLineGondolaViewFields.Filters]);
      })
      .catch((err) => {
        console.error('Error loading gondola for guid', guid, err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [guid]);

  const searchProductLines = useCallback((filter: FilterProductLineSearch) => {
    setProductLines(undefined);
    HttpProductLine.getProductLineGondolasSearch(guid, filter)
      .then((r) => {
        setProductLines(r[ProductLineGondolaViewFields.Lines]);
        setFilterOpts(r[ProductLineGondolaViewFields.Filters]);
      })
      .catch((err) => {
        console.error('Error searching product lines', err);
      });
  }, [guid]);

  const setFieldFilter = useCallback(
    (
      entityList: EntityWithBooleanIdAndDescription[],
      field: FilterProductLineSearchFields,
      stack: boolean = true,
      firstRender?: boolean
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
          [field]: entityList,
        };
        setSelectedValues(newStackedValues);
      }
      
      if (!firstRender) searchProductLines(newFilter);
    },
    [filters, selectedValues, searchProductLines]
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultSearchValues);
    setSelectedValues({});
    searchProductLines(defaultSearchValues);
  }, [searchProductLines]);

  const handleDelete = useCallback(
    (v: EntityWithBooleanIdAndDescription, filters: EntityWithBooleanIdAndDescription[], name: string) => {
      const currentValues = filters.filter((value) => value.id !== v.id);
      setFieldFilter(currentValues, name as FilterProductLineSearchFields);
      setSelectedValues(prev => ({
        ...prev,
        [name]: currentValues,
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
        <ProductLineFilter />
      </Box>
    );
  };

  if (loading || !productLines) {
    return (
      <Box pb={4}>
        <Grid container spacing={4}>
          {!isMobile && (
            <Grid item lg={3} md={5} xs={12}>
              <ProductLineFilterLoading />
            </Grid>
          )}
          <Grid
            item
            lg={9}
            md={7}
            xs={12}
            sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}
          >
            <Box width="100%" maxWidth="1200px">
                <Grid container spacing={2}>
                    {[...Array(9)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={`product-skeleton-${index}`}>
                            <ProductLineCardLoading />
                        </Grid>
                    ))}
                </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

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
          clearFilters: clearFilters,
        }}
      >
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
            <Grid item lg={3} md={5} xs={12}>
              <ProductLineFilter />
            </Grid>
          )}
          <Grid
            item
            lg={9}
            md={7}
            xs={12}
            sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}
          >
            <Box width="100%" maxWidth="1200px">
              <ProductLinesGroupByService
                productLineList={productLines && productLines}
              />
            </Box>
          </Grid>
        </Grid>
      </ProductLineFilterContext.Provider>
    </Box>
  );
};

export default MarketGuidGondola;

