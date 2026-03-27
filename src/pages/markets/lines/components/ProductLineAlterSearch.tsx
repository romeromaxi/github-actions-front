import {useNavigate, useSearchParams} from 'react-router-dom';
import { useAction } from '../../../../hooks/useAction';
import React, { useEffect, useState } from 'react';
import {
  FilterProductLineSearch,
  FilterProductLineSearchFields,
  ProductLineFilterOption,
  ProductLineFilterOptionFields, ProductLineGondolaFilter, ProductLineGondolaViewFields,
  ProductLineView,
} from '../../../../types/lines/productLineData';
import { CompanyViewDTO } from '../../../../types/company/companyData';
import { userStorage } from '../../../../util/localStorage/userStorage';
import { HttpCompany, HttpProductLine } from '../../../../http';
import {Box, Button, Container, Grid, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import ProductLineCard from './ProductLineCard';
import FailRedirectMarketDialog from '../../home/components/FailRedirectMarketDialog';
import ProductLineFilter from '../ProductLineFilter';
import { EntityPaginationFields } from '../../../../types/baseEntities';
import {ProductLineFilterContext, SelectedFilters} from '../ProductLineSearch';
import { EditButton } from '../../../../components/buttons/Buttons';
import { HttpMarketDynamicSearch } from '../../../../http/market/httpMarketDynamicSearch';
import { DynamicSearchMarketViewFields } from '../../../../types/market/marketData';
import { marketAnswersStorage } from '../../../../util/sessionStorage/marketAnswersStorage';
import {
  MarketIntermadiateAnswersFields, MarketIntermadiateDynamicSearch, MarketIntermadiateDynamicSearchFields,
  MarketIntermediateAnswers,
} from '../../../../types/market/marketIntermediateData';
import { numberFormatter } from '../../../../util/formatters/numberFormatter';
import MarketAdvertisingAnswersEditDialog from '../../components/forms/MarketAdvertisingAnswersEditDialog';
import ProductLineUniquePage from "./ProductLineUniquePage";
import ProductLineCardLoading from "./ProductLineCardLoading";
import {AppBarBase} from "../../../../components/appbar/AppBarBase";
import {Undo2Icon} from "lucide-react";
import {useApplicationCommon} from "../../../../hooks/contexts/ApplicationCommonContext";
import FlyerAssistedSearchLuc from "../../../../components/flyers/FlyerAssistedSearchLuc";

const pageSize: number = 5000;

const defaultSearchValues: ProductLineFilterOption = {
  [FilterProductLineSearchFields.CodsProductInstrument]: undefined,
  [FilterProductLineSearchFields.CodsOfferer]: undefined,
  [FilterProductLineSearchFields.CodsProductRateType]: undefined,
  [FilterProductLineSearchFields.CodsProductAmortizationType]: undefined,
  [FilterProductLineSearchFields.CodsProvince]: undefined,
  [FilterProductLineSearchFields.CodsSector]: undefined,
  // @ts-ignore
  [FilterProductLineSearchFields.Billing]: '',
  // @ts-ignore
  [FilterProductLineSearchFields.AmountToFinance]: '',
  [EntityPaginationFields.ActualPage]: 1,
  [EntityPaginationFields.PageSize]: pageSize,
  // ...marketFilterStorage.getLandingFilter(),
  // ...marketFilterStorage.getSearchFilter()
};

function ProductLineAlterSearch() {
  let [searchParams] = useSearchParams();
  const guidWeb = searchParams.get('guid') || '';
  const theme = useTheme();
  const isSmallerThanLargeScreenSize = useMediaQuery(theme.breakpoints.down(1440));
  const { showLoader, hideLoader } = useAction();
  const { paddingTopContent } = useApplicationCommon();
  const [productLines, setProductLines] = useState<ProductLineView[]>();
  const [companies, setCompanies] = useState<CompanyViewDTO[]>();
  const [filterOpts, setFilterOpts] = useState<ProductLineGondolaFilter[]>()
  const [requiresQuestions, setRequiresQuestions] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<SelectedFilters>({})
  const userLogged = userStorage.isLogged();
  const [openFail, setOpenFail] = useState<boolean>(!userLogged);
  const navigate = useNavigate();
  const [marketAnswersData, setMarketAnswersData] =
    useState<MarketIntermediateAnswers | null>(
      marketAnswersStorage.getMarketIntermediateAnswers(),
    );
  const [editAnswers, setEditAnswers] = useState<boolean>(false);
  const [filter, setFilter] = useState<ProductLineFilterOption>({
    ...defaultSearchValues,
    [ProductLineFilterOptionFields.Guid]: guidWeb,
    [MarketIntermadiateAnswersFields.CompanyId]: marketAnswersData
      ? marketAnswersData[MarketIntermadiateAnswersFields.CompanyId]
      : undefined,
    [MarketIntermadiateAnswersFields.ProductDestinyCode]: marketAnswersData
      ? marketAnswersData[MarketIntermadiateAnswersFields.ProductDestinyCode]
      : undefined,
    [MarketIntermadiateAnswersFields.BillingAmount]: marketAnswersData
      ? marketAnswersData[MarketIntermadiateAnswersFields.BillingAmount]
      : undefined,
    //...marketFilterStorage.getLandingFilter(),
    //...marketFilterStorage.getSearchFilter()
  });
  const [uniqueLine, setUniqueLine] = useState<boolean>()
  const [dynamicSearchData, setDynamicSearchData] = useState<MarketIntermadiateDynamicSearch>()

  const loadAll = () => {
    showLoader();
    setProductLines(undefined);
    Promise.all([
      HttpCompany.getCompaniesByUser(),
      HttpProductLine.getProductLineGondolasSearch(guidWeb, filter),
      HttpMarketDynamicSearch.getByGuid(guidWeb),
    ])
      .then(([companyList, gondolaResponse, dynamicOpts]) => {
        setDynamicSearchData(dynamicOpts);
        setCompanies(companyList);
        setRequiresQuestions(
          dynamicOpts[DynamicSearchMarketViewFields.RequiresQuestions],
        );
        setUniqueLine(dynamicOpts[MarketIntermadiateDynamicSearchFields.IsUniqueProductLine]);
        setProductLines(gondolaResponse[ProductLineGondolaViewFields.Lines]);
        setFilterOpts(gondolaResponse[ProductLineGondolaViewFields.Filters]);
      })
      .finally(() => hideLoader());
  };

  useEffect(() => {
    if (userLogged) loadAll();
  }, [guidWeb]);

  const searchProductLines = (filter: FilterProductLineSearch) => {
    setFilter(filter);
    showLoader();
    setProductLines(undefined);
    HttpProductLine.getProductLineGondolasSearch(guidWeb, filter)
      .then(gondolaResponse => {
          setProductLines(gondolaResponse[ProductLineGondolaViewFields.Lines]);
          setFilterOpts(gondolaResponse[ProductLineGondolaViewFields.Filters]);
      })
      .finally(() => hideLoader());
  };

  const setFieldFilter = (
    codes: any,
    field: FilterProductLineSearchFields,
  ) => {
    const newFilter = {
      ...filter,
      [EntityPaginationFields.ActualPage]: 1,
      [field]: codes.map((v: any) => v.id),
    };
    setFilter(newFilter);
    const newStackedValues: SelectedFilters = {
      ...selectedValues,
      [field]: codes
    }
    setSelectedValues(newStackedValues)
    searchProductLines(newFilter);
  };

  const onCleanFilter = () => {
    const newFilter = {
      ...defaultSearchValues,
      [ProductLineFilterOptionFields.Guid]: guidWeb,
    };

    searchProductLines(newFilter);
    setFilter(newFilter);
    setSelectedValues({});
  };

  const openEditOptions = () => setEditAnswers(true);

  const onSubmitEdit = (data: MarketIntermediateAnswers) => {
    setMarketAnswersData(data);
    const newFilter = {
      ...filter,
      [MarketIntermadiateAnswersFields.CompanyId]:
        data[MarketIntermadiateAnswersFields.CompanyId],
      [MarketIntermadiateAnswersFields.ProductDestinyCode]:
        data[MarketIntermadiateAnswersFields.ProductDestinyCode],
      [MarketIntermadiateAnswersFields.BillingAmount]:
        data[MarketIntermadiateAnswersFields.BillingAmount],
    };

    searchProductLines(newFilter);
    setFilter(newFilter);
  };

  const onClickBackButton = () => navigate(-1);
    
  return (

      <Box sx={{ position: 'relative' }}>
          <Container>
              <AppBarBase title={dynamicSearchData?.[MarketIntermadiateDynamicSearchFields.Title] ?? ""}
                          hideLogo>
                  <AppBarBase.Left>
                      <Button variant={'outlined'}
                              color={'secondary'}
                              size={'small'}
                              startIcon={<Undo2Icon />}
                              onClick={onClickBackButton}
                      >
                          Volver
                      </Button>
                  </AppBarBase.Left>
                  
              </AppBarBase>

              <Box pt={paddingTopContent}>
                  <React.Fragment>
                      {
                          uniqueLine ?
                              <ProductLineUniquePage line={productLines?.[0]}
                                                     title={dynamicSearchData?.[MarketIntermadiateDynamicSearchFields.Title] ?? ""}
                                                     subheader={dynamicSearchData?.[MarketIntermadiateDynamicSearchFields.Detail] ?? ""}
                                                     requiresQuestions={requiresQuestions}
                              />
                              :
                              <ProductLineFilterContext.Provider
                                  value={{
                                      filters: filter,
                                      setFieldFilter: setFieldFilter,
                                      clearFilters: onCleanFilter,
                                      productLines: productLines ?? undefined,
                                      filterOpts: filterOpts,
                                      selectedValues: selectedValues,
                                      setSelectedValues: setSelectedValues
                                  }}
                              >
                                  <Grid container mb={2} spacing={2}>
                                      <Grid item xs={10}>
                                          {requiresQuestions && (
                                              <Stack spacing={2} alignItems="center" direction="row">
                                                  <Typography fontSize={16} fontWeight={600}>
                                                      Respuestas seleccionadas:
                                                  </Typography>
                                                  <Box
                                                      sx={{
                                                          border: '2px dashed lightblue',
                                                          borderRadius: '12px',
                                                          padding: 2,
                                                      }}
                                                  >
                                                      <Stack direction={'row'} alignItems={'center'} spacing={3}>
                                                          <Stack direction={'row'} spacing={1}>
                                                              <Typography fontSize={14} fontWeight={600}>
                                                                  Empresa:
                                                              </Typography>
                                                              <Typography fontSize={14}>
                                                                  {marketAnswersData?.[
                                                                      MarketIntermadiateAnswersFields.CompanyBusinessName
                                                                      ] ?? '- No seleccionada -'}
                                                              </Typography>
                                                          </Stack>
                                                          <Stack direction={'row'} spacing={1}>
                                                              <Typography fontSize={14} fontWeight={600}>
                                                                  Destino:
                                                              </Typography>
                                                              <Typography fontSize={14}>
                                                                  {marketAnswersData?.[
                                                                      MarketIntermadiateAnswersFields.ProductDestinyDesc
                                                                      ] ?? '- No seleccionado -'}
                                                              </Typography>
                                                          </Stack>
                                                          <Stack direction={'row'} spacing={1}>
                                                              <Typography fontSize={14} fontWeight={600}>
                                                                  Monto:
                                                              </Typography>
                                                              <Typography fontSize={14}>
                                                                  {`$ ${numberFormatter.toStringWithDecimals(marketAnswersData?.[MarketIntermadiateAnswersFields.BillingAmount] ?? 0)}`}
                                                              </Typography>
                                                          </Stack>
                                                      </Stack>
                                                  </Box>
                                                  <EditButton size={'small'} onClick={openEditOptions}>
                                                      Editar
                                                  </EditButton>
                                              </Stack>
                                          )}
                                      </Grid>
                                      
                                      <Grid item lg={3} md={5} xs={12}>
                                          <ProductLineFilter />
                                      </Grid>
                                      <Grid
                                          item
                                          lg={9}
                                          xs={12}
                                          container
                                          spacing={2}
                                          alignContent="flex-start"
                                      >
                                          {companies &&
                                          productLines ?
                                              productLines.length !== 0 ?
                                                  productLines.map((line, idx) => (
                                                      <Grid item xs={12} lg={3.55} key={idx}>
                                                          <ProductLineCard productLine={line} />
                                                      </Grid>
                                                  ))
                                                  :
                                                  <></>
                                              :
                                              Array.from(Array(6).keys()).map((item) => (
                                                  <Grid item xs={isSmallerThanLargeScreenSize ? 12 : 4} key={`keyProductLineCardBaseLoading_${item}`}>
                                                      <ProductLineCardLoading />
                                                  </Grid>
                                              ))
                                          }

                                          <Grid item xs={12}>
                                              <FlyerAssistedSearchLuc />
                                          </Grid>
                                      </Grid>
                                  </Grid>
                              </ProductLineFilterContext.Provider>
                      }
                      <FailRedirectMarketDialog
                          open={openFail}
                          onClose={() => {
                              setOpenFail(false);
                          }}
                          onCancel={() => {
                              navigate(-1);
                          }}
                          hideTitle
                      />
                      <MarketAdvertisingAnswersEditDialog
                          open={editAnswers}
                          onClose={() => {
                              setEditAnswers(false);
                          }}
                          answers={marketAnswersData}
                          onSearch={onSubmitEdit}
                      />
                  </React.Fragment>
              </Box>
              
          </Container>
      </Box>
      
  );
}

export default ProductLineAlterSearch;
