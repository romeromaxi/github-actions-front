import React, { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Grid, Stack, Tabs, Tab, Box, useMediaQuery, Theme, Divider, Tooltip, IconButton } from '@mui/material';
import { ProductLineFields, ProductLineView } from 'types/lines/productLineData';
import { HttpMarketShoppingCart } from 'http/market/httpMarketShoppingCart';
import { HttpCompany } from 'http/index';
import {
  CompanyFields,
  CompanyFileCompletenessView,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import ProductLineAptitudeDialog from './dialogs/ProductLineAptitudeDialog';
import { marketSolicitationStorage } from 'util/sessionStorage/marketSolicitationStorage';
import { useForm } from 'react-hook-form';
import { AsyncSelectNew } from "components/forms/AsyncSelectNew";
import { BaseIconWrapper } from "components/icons/Icons";
import { Folders } from "@phosphor-icons/react";
import { DeleteButton } from "components/buttons/Buttons";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useAxios from "hooks/useAxios";
import BoxEmtynessDescription from "components/misc/BoxEmtynessDescription";
import { DialogAlert } from "components/dialog";
import ShoppingCartAccordion from "./ShoppingCartAccordion";
import { groupBy } from "util/helpers";
import { CompanyFileType } from "types/company/companyEnums";
import CompanyFileGeneralInfo from "../../../company/components/CompanyFileGeneralInfo";
import { SolicitationTypes } from '../../../../types/solicitations/solicitationEnums';
import { MarketSolicitationFields } from '../../../../util/sessionStorage/marketSolicitationStorage';
import FloatingCart from './components/FloatingCart';
import ProductLineSummaryComponentLoadingList from '../components/ProductLineSummaryComponentLoading';

enum ProductLineShoppingCartSelectCompanyFields {
  CompanyId = 'companyId',
}

interface ProductLineShoppingCartSelectCompany {
  [ProductLineShoppingCartSelectCompanyFields.CompanyId]: string | undefined;
}

const ProductLineShoppingCart: FC = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  let parsedId: number = parseInt(companyId!);
  const { fetchData } = useAxios();
  const [companies, setCompanies] = useState<CompanyViewDTO[]>();
  const [companyFileCompleteness, setCompanyFileCompleteness] =
    useState<CompanyFileCompletenessView>();
  const [solicitationIdAptitude, setSolicitationIdAptitude] =
    useState<number>();
  const [disableField, setDisableField] = useState<boolean>(false);
  const [companyLines, setCompanyLines] = useState<ProductLineView[]>([]);
  const [linesGrouped, setLinesGrouped] = useState<{ [key: string]: ProductLineView[] }>();
  const [openDeleteAll, setOpenDeleteAll] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isMediumScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const isLargeScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down(1440));
  const isExtraLargeScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.up(1440));
  const [selectedLines, setSelectedLines] = useState<ProductLineView[]>([]);
  const [currentGroupTitle, setCurrentGroupTitle] = useState<string>('');

  const methods = useForm<ProductLineShoppingCartSelectCompany>({
    defaultValues: {
      [ProductLineShoppingCartSelectCompanyFields.CompanyId]: companyId,
    },
  });
  const watchCompanyValue = methods.watch(
    ProductLineShoppingCartSelectCompanyFields.CompanyId,
  );

  const getCompanyLines = () => {
    setLinesGrouped(undefined);
    setCompanyFileCompleteness(undefined);
    Promise.all([
      HttpMarketShoppingCart.getByCompanyId(parsedId),
      HttpCompany.getCompletenessPercentage(parsedId),
      HttpCompany.getCompanyById(parsedId).then((r) => setCompanyName(r[CompanyViewDTOFields.BusinessName]))
    ]).then((responses) => {
      setCompanyLines(responses[0]);

      const groupbySolicitationType = groupBy(responses[0],
        [ProductLineFields.GroupedCartLabel]);

      setLinesGrouped(groupbySolicitationType);

      setCompanyFileCompleteness(responses[1]);
    });
  };

  const getShoppingCartInfo = () => {
    setCompanies(undefined);

    HttpCompany.getCompaniesByUser().then(setCompanies);

    getCompanyLines();
  };

  const handleAptitudeClose = () => {
    setSolicitationIdAptitude(undefined);
  };

  const onSave = () => {
    handleAptitudeClose();
  };

  const aptitudeDialog = () => {
    return (
      <ProductLineAptitudeDialog
        open={!!solicitationIdAptitude}
        solicitationId={solicitationIdAptitude ?? 0}
        onClose={handleAptitudeClose}
        onSubmit={() => onSave()}
        disableField={disableField}
      />
    );
  };

  const deleteAllDialog = () => (
    <DialogAlert open={openDeleteAll}
      title={'Atención'}
      textContent={`¿Estás seguro de que querés eliminar todas las líneas seleccionadas para ${companyName}?`}
      textClose={'Cancelar'}
      onClose={() => setOpenDeleteAll(false)}
      textConfirm={'Eliminar'}
      onConfirm={() => handleDeleteAll()}
    />
  );

  const mapLoading = () => (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <ProductLineSummaryComponentLoadingList />
        </Stack>
      </CardContent>
    </Card>
  );

  const loadCompaniesSelect = useCallback(() => {
    if (companies)
      return Promise.resolve(
        companies.map((x) => {
          return {
            id: x.id,
            [EntityWithIdAndDescriptionFields.Description]:
              x[CompanyFields.BusinessName],
          };
        }),
      );
  }, [companies]);

  useEffect(() => {
    if (watchCompanyValue)
      navigate(`/market/lines/carrito/${watchCompanyValue}`);
  }, [watchCompanyValue]);

  useEffect(() => {
    if (companyId)
      methods.reset({
        [ProductLineShoppingCartSelectCompanyFields.CompanyId]: companyId,
      });
  }, [companyId]);

  useEffect(() => {
    if (parsedId) {
      marketSolicitationStorage.clearSolicitation();
      getShoppingCartInfo();
    }
  }, [parsedId]);

  const handleDeleteAll = () => {
    fetchData(
      () => HttpMarketShoppingCart.removeAll(parseInt(companyId || '0')),
      true
    ).then(() => {
      getCompanyLines();
      setOpenDeleteAll(false);
    });
  };

  const handleChangeCompany = (id: string) => methods.setValue(ProductLineShoppingCartSelectCompanyFields.CompanyId, id);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCheckBoxClick = (productLine: ProductLineView) => {
    const solicitationId = productLine[ProductLineFields.SolicitationId];
    const isLineSelected = selectedLines.some(line => line[ProductLineFields.SolicitationId] === solicitationId);

    if (isLineSelected) {
      setSelectedLines(prev => prev.filter(line => line[ProductLineFields.SolicitationId] !== solicitationId));
    } else {
      const isMatcherCasfog = productLine[ProductLineFields.FileTypeCode] === CompanyFileType.MatcherCasfog;

      if (isMatcherCasfog) {
        setSelectedLines([productLine]);
      } else {
        const isSameType = selectedLines.length === 0 || selectedLines[0][ProductLineFields.FileTypeCode] === productLine[ProductLineFields.FileTypeCode];

        if (isSameType) {
          setSelectedLines(prev => [...prev, productLine]);
        } else {
          setSelectedLines([productLine]);
        }
      }

      setCurrentGroupTitle(productLine[ProductLineFields.GroupedCartLabel]);
    }
  };

  const handleProceedLinesRequestClick = () => {
    const solicitationIds = selectedLines.map(line => line[ProductLineFields.SolicitationId]);
    const referenceLine = selectedLines[0];
    const solicitationType = referenceLine[ProductLineFields.SolicitationTypeCode] ?? SolicitationTypes.None;
    const fileType = referenceLine[ProductLineFields.FileTypeCode] ?? CompanyFileType.Long;

    marketSolicitationStorage.setCurrentSolicitation({
      [MarketSolicitationFields.CompanyId]: parsedId,
      [MarketSolicitationFields.SolicitationIdList]: solicitationIds,
      [MarketSolicitationFields.SolicitationType]: solicitationType,
      [MarketSolicitationFields.FileType]: fileType,
    });

    navigate(`/market/lines/${parsedId}/prequalification`);
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={7} lg={8.5}>
        <AsyncSelectNew
          label={'Selección de productos de'}
          labelVariant={'h6'}
          icon={<BaseIconWrapper Icon={Folders} size={'md'} />}
          control={methods.control}
          loadOptions={loadCompaniesSelect}
          action={
            isMediumScreenSize && isLargeScreenSize ? (
              <Tooltip title="Vaciar selección" arrow>
                <IconButton
                  size="medium"
                  onClick={() => setOpenDeleteAll(true)}
                  disabled={!companyId || companyId === ''}
                >
                  <DeleteOutlineIcon color='primary'/>
                </IconButton>
              </Tooltip>
            ) : isExtraLargeScreenSize && ( 
              <DeleteButton
                variant="text"
                size="small"
                color="primary"
                onClick={() => setOpenDeleteAll(true)}
                disabled={!companyId || companyId === ''}
                fullWidth
                sx={{ml: -2}}
              >
                Vaciar selección
              </DeleteButton>
            )
          }
          companyId={companyId}
          onChangeSelect={handleChangeCompany}
          name={ProductLineShoppingCartSelectCompanyFields.CompanyId}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={7} lg={8.5} sx={{mb: selectedLines.length > 0 ? { xs: 20, sm: 2, md: 14 } : { xs: 2, sm: 2, md: 2}}}
      >
        {!companyLines || !companyFileCompleteness ? 
          mapLoading()
        :
          <React.Fragment>
            {companyLines.length == 0 &&
              <BoxEmtynessDescription />
            }

            {linesGrouped && (
              <>
                {isMobile && (
                  <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    {Object.keys(linesGrouped).map((key, index) => (
                      <Tab key={`tab_${key}`} label={key} />
                    ))}
                  </Tabs>
                )}

                {!isMobile && (
                  <Stack spacing={3}>
                    {Object.keys(linesGrouped).map((key) => (
                      <Card key={`card_${key}`} sx={{ width: '100%' }}>
                        <CardContent>
                          <ShoppingCartAccordion
                            title={key}
                            companyId={parsedId}
                            lines={linesGrouped[key]}
                            onReload={getCompanyLines}
                            uniqueLineGrouping={Object.keys(linesGrouped).length === 1}
                            onlySingleSelection={
                              !!linesGrouped[key]?.length &&
                              linesGrouped[key][0][ProductLineFields.FileTypeCode] === CompanyFileType.MatcherCasfog
                            }
                            handleCheckBoxClick={handleCheckBoxClick}
                            selectedLines={selectedLines}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}

                {isMobile && (
                  <Box mb={1}>
                    {Object.keys(linesGrouped).map((key, index) => (
                      <Box key={`tabpanel_${key}`} role="tabpanel" hidden={activeTab !== index}>
                        {activeTab === index && (
                          <ShoppingCartAccordion
                            title={key}
                            companyId={parsedId}
                            lines={linesGrouped[key]}
                            onReload={getCompanyLines}
                            uniqueLineGrouping={Object.keys(linesGrouped).length === 1}
                            onlySingleSelection={
                              !!linesGrouped[key]?.length &&
                              linesGrouped[key][0][ProductLineFields.FileTypeCode] === CompanyFileType.MatcherCasfog
                            }
                            handleCheckBoxClick={handleCheckBoxClick}
                            selectedLines={selectedLines}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
            {aptitudeDialog()}
            {deleteAllDialog()}
          </React.Fragment>
        }
      </Grid>
      {!isMobile && 
        <Grid item sm={12} md={5} lg={3.5} sx={{mb: selectedLines.length > 0 ? isMobile ? 20 : 15 : 0}}>
          <CompanyFileGeneralInfo companyId={parsedId} />
        </Grid>
      }
      {selectedLines.length > 0 && 
        <FloatingCart
        title={currentGroupTitle}
        selectedLines={selectedLines}
        onProceed={handleProceedLinesRequestClick}
        />
      }
    </Grid>
  );

};

export default ProductLineShoppingCart;