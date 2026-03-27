import React, {useEffect, useState} from 'react';
import {Card, CardContent, Grid, Stack, Typography} from '@mui/material';
import {ITableColumn, TableWithPaging} from 'components/table';
import {SearchTwoTone} from '@mui/icons-material';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import {ButtonDropdown, ButtonIconDropdown, MenuItemDropdown} from 'components/buttons/Buttons';
import StoreIcon from '@mui/icons-material/Store';
import {EntityListWithPagination, EntityPaginationFields, EntityWithIdFields,} from '../../../../types/baseEntities';
import {HttpOffererProductLine} from '../../../../http';
import OffererLineTableFilter from './OffererLineTableFilter';
import {
  SolicitationAlertIconButton,
  SolicitationAlertIconType,
} from '../../components/OffererSolicitation/OffererSolicitationTable/SolicitationAlertIcons';
import {
  OffererButtonSecObjects,
  OffererSolicitationNavHeaderSecObjects,
  SecurityComponents,
} from '../../../../types/security';
import CollapseContent from '../../../../components/misc/CollapseContent';
import {
  ProductLineFields,
  ProductLineOffererFilter,
  ProductLineOffererFilterFields,
  ProductLineViewSummaryWithPublicationData
} from "../../../../types/lines/productLineData";
import ProductLineStateChip from "../../../lines/components/ProductLineStateChip";
import {useNavigate} from "react-router-dom";
import useSecurityObject from "../../../../hooks/useSecurityObject";

interface OffererLineTableProps {
  onClickEdit: (line: ProductLineViewSummaryWithPublicationData) => void;
  onClickDetail: (line: ProductLineViewSummaryWithPublicationData) => void;
  onClickPreview: (line: ProductLineViewSummaryWithPublicationData) => void;
  offererId: number;
}

function OffererLineTable(props: OffererLineTableProps) {
  const navigate = useNavigate();
  const { hasReadPermission } = useSecurityObject()
  
  const [listLines, setListLines] =
    useState<EntityListWithPagination<ProductLineViewSummaryWithPublicationData>>();

  const [lineSearchFilter, setLineSearchFilter] = useState<ProductLineOffererFilter>({
    [ProductLineOffererFilterFields.LineProductCode]: undefined,
    [ProductLineOffererFilterFields.LineProductCode]: undefined,
    [ProductLineOffererFilterFields.LineToolTypeCode]: undefined,
    [ProductLineOffererFilterFields.LineStateCods]: [],
    [EntityPaginationFields.PageSize]: 10,
    [EntityPaginationFields.ActualPage]: 1,
  });
  const [shouldSearch, setShouldSearch] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<string>('Fecha Últ. Mod. Descendiente');

  const searchOffererLines = (filter: ProductLineOffererFilter) => {
    setLoading(true);
    HttpOffererProductLine.getListByOffererId(props.offererId, filter)
      .then((response) => {
        setListLines(response);
        setShouldSearch(false);
        setLoading(false);
      })
      .catch(() => setError(true));
  };

  const onFilterSearch = (filter: ProductLineOffererFilter) => {
    console.log(filter);
    setLineSearchFilter({ ...filter });
    setShouldSearch(true);
  };

  useEffect(() => {
    if (shouldSearch) {
      searchOffererLines(lineSearchFilter);
    }
  }, [shouldSearch]);

  const changeToLastModDesc = () => {
    setOrder('Fecha Últ. Mod. Descendiente');
    const newFilter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModDESC',
    };

    setLineSearchFilter(newFilter);
    searchOffererLines(newFilter);
  };

  const changeToProdAsc = () => {
    setOrder('Producto Ascendiente');
    const newFilter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreProductoASC',
    };

    setLineSearchFilter(newFilter);
    searchOffererLines(newFilter);
  };

  const changeToProdDesc = () => {
    setOrder('Producto Descendiente');
    const newFilter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreProductoDESC',
    };

    setLineSearchFilter(newFilter);
    searchOffererLines(newFilter);
  };

  const changeToServiceAsc = () => {
    setOrder('Servicio Ascendiente');
    const newFilter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreServicioASC',
    };

    setLineSearchFilter(newFilter);
    searchOffererLines(newFilter);
  };

  const changeToServiceDesc = () => {
    setOrder('Servicio Descendiente');
    const newFilter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreServicioDESC',
    };

    setLineSearchFilter(newFilter);
    searchOffererLines(newFilter);
  };

  const changeToToolTypeAsc = () => {
    setOrder('Tipo Instrumento Ascendiente');
    const newFilter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreInstrumentoTipoASC',
    };

    setLineSearchFilter(newFilter);
    searchOffererLines(newFilter);
  };

  const changeToToolTypeDesc = () => {
    setOrder('Tipo Instrumento Descendiente');
    const newFilter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreInstrumentoTipoDESC',
    };

    setLineSearchFilter(newFilter);
    searchOffererLines(newFilter);
  };

  const columns: ITableColumn[] = [
    {
      label: 'Estado',
      value: ProductLineFields.ProductLineStatusDesc,
      onRenderCell: (line: ProductLineViewSummaryWithPublicationData) => (
        <ProductLineStateChip code={line[ProductLineFields.ProductLineStatusCode]}
                              description={line[ProductLineFields.ProductLineStatusDesc]} />
      ),
    },
    {
      label: 'Nombre de Línea',
      value: ProductLineFields.Line,
      textAlign: 'left',
    },
    {
      label: 'Servicio',
      value: ProductLineFields.ProductServiceDesc,
      textAlign: 'left',
    },
    {
      label: 'Tipo de Instrumento',
      value: ProductLineFields.ProductInstrumentTypeDesc,
      textAlign: 'left',
    },
    {
      label: 'Instrumento',
      value: ProductLineFields.ProductInstrumentDesc,
      textAlign: 'left',
    },
    { label: 'Producto', value: ProductLineFields.ProductDesc, textAlign: 'left' },
    {
      label: 'Alertas',
      onRenderCell: (line: ProductLineViewSummaryWithPublicationData) => {
        return (
          <Stack direction={'row'} spacing={1}>
            <SolicitationAlertIconButton
              AlertCode={line[ProductLineFields.AlertCode] || 0}
              type={SolicitationAlertIconType.Message}
              onClick={() => navigate(`/offerer/lines/${line[EntityWithIdFields.Id]}?tab=chat`)}
              securityComponentName={SecurityComponents.OffererSolicitationNavHeader}
              securityObjectName={OffererSolicitationNavHeaderSecObjects.SolicitationOffererChatLink}
            />
          </Stack>
        );
      },
    },

    {
      label: '',
      onRenderCell: (line: ProductLineViewSummaryWithPublicationData) => {
        let itemsDropdown: MenuItemDropdown[] = [];
        
        if (hasReadPermission(SecurityComponents.OffererLineHome, OffererButtonSecObjects.OffererButtonDetailLine)) {
          itemsDropdown.push({
            label: 'Ver',
            icon: <SearchTwoTone fontSize={'small'} />,
            onClick: () => props.onClickEdit(line),
          });
        }

        if (hasReadPermission(SecurityComponents.OffererProductLineDetailPage, OffererButtonSecObjects.OffererButtonPreviewLine)) {
          itemsDropdown.push({
            label: 'Previsualizar Card Tienda',
            icon: <StoreIcon fontSize={'small'} />,
            onClick: () => props.onClickPreview(line),
          });
          
          itemsDropdown.push({
            label: 'Previsualizar Detalle Línea',
            icon: <ArticleTwoToneIcon fontSize={'small'} />,
            onClick: () => props.onClickDetail(line),
          });
        }

        return (
            itemsDropdown.length !== 0 ?
            <ButtonIconDropdown label={''}
                                items={itemsDropdown}
                                color={'inherit'}
                                size={'small'}
            />
                :
                <></>
        );
      },
    },
  ];

  const onPaging = (actualPage: number) => {
    const filter: ProductLineOffererFilter = {
      ...lineSearchFilter,
      [EntityPaginationFields.ActualPage]: actualPage,
    };

    searchOffererLines(filter);
  };

  return (
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <CollapseContent title={'Filtros de línea'}>
              <Grid container justifyContent={'space-between'} spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={0}>
                    <Typography
                        fontWeight={600}
                        color={'grey.700'}
                        fontSize={'0.875rem'}
                    >
                      Ordenar por:
                    </Typography>
                    <ButtonDropdown
                        label={order}
                        sx={{ p: 1 }}
                        items={[
                          {
                            label: 'Fecha Últ. Mod. Descendiente',
                            onClick: changeToLastModDesc,
                          },
                          {
                            label: 'Producto Ascendiente',
                            onClick: changeToProdAsc,
                          },
                          {
                            label: 'Producto Descendiente',
                            onClick: changeToProdDesc,
                          },
                          {
                            label: 'Servicio Ascendiente',
                            onClick: changeToServiceAsc,
                          },
                          {
                            label: 'Servicio Descendiente',
                            onClick: changeToServiceDesc,
                          },
                          {
                            label: 'Tipo Instrumento Ascendiente',
                            onClick: changeToToolTypeAsc,
                          },
                          {
                            label: 'Tipo Instrumento Descendiente',
                            onClick: changeToToolTypeDesc,
                          },
                        ]}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <OffererLineTableFilter
                      filter={lineSearchFilter}
                      onClickSearch={onFilterSearch}
                  />
                </Grid>
              </Grid>
            </CollapseContent>
          </CardContent>
        </Card>
                
        <TableWithPaging
            title={'Líneas'}
            entityPaginada={listLines}
            columns={columns}
            isLoading={loading}
            error={error}
            onPaging={onPaging}
        />
      </Stack>
  );
}

export default OffererLineTable;
