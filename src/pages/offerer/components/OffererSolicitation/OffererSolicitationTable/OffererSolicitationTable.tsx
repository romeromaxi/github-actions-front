import React, { useCallback, useContext, useEffect, useState } from 'react';
import { OffererContext } from '../../OffererContextProvider';
import { HttpSolicitation } from 'http/index';
import {
  EntityListWithPagination,
  EntityPaginationFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import {
  SolicitationFilter,
  SolicitationFilterFields,
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import {
  ITableColumn,
  TableColumnType,
  TableWithPaging,
} from 'components/table';
import { Grid, Stack, Tooltip, Typography } from '@mui/material';
import { stringFormatter } from 'util/formatters/stringFormatter';
import OffererSolicitationTableFilter from './OffererSolicitationTableFilter';
import SolicitationOffererStatusChip from '../SolicitationOffererStatusChip';
import { useNavigate } from 'react-router-dom';
import {
  SolicitationAlertIconButton,
  SolicitationAlertIconType,
} from './SolicitationAlertIcons';
import {
  OffererSolicitationNavHeaderSecObjects,
  SecurityComponents,
} from 'types/security';
import {
  ButtonDropdown,
  SearchIconButton,
} from '../../../../../components/buttons/Buttons';
import CollapseContent from '../../../../../components/misc/CollapseContent';

function OffererSolicitationTable() {
  const navigate = useNavigate();
  const offerer = useContext(OffererContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [shouldSearch, setShouldSearch] = useState<boolean>(true);
  const [paginatedSolicitationList, setPaginatedSolicitationList] =
    useState<EntityListWithPagination<SolicitationViewDTO>>();
  const [solicitationFilter, setSolicitationFilter] =
    useState<SolicitationFilter>({
      [SolicitationFilterFields.PageSize]: 10,
      [SolicitationFilterFields.CurrentPage]: 1,
      [SolicitationFilterFields.HasAlert]: null,
    });
  const [order, setOrder] = useState<string>('Fecha Últ. Mod. Descendiente');

  const columns: ITableColumn[] = [
    {
      label: 'Estado',
      onRenderCell: (solicitation: SolicitationViewDTO) => (
        <SolicitationOffererStatusChip
          label={
            solicitation[
              SolicitationViewDTOFields.OffererSolicitationStatusLabelDesc
            ]
          }
          statusCode={
            solicitation[
              SolicitationViewDTOFields.OffererSolicitationStatusTypeCode
            ]
          }
          alertType={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
          small
        />
      ),
    },
    {
      label: 'Fecha',
      value: SolicitationViewDTOFields.OffererLastModified,
      type: TableColumnType.Date,
    },
    {
      label: 'Línea',
      onRenderCell: (solicitation: SolicitationViewDTO) => (
        <Tooltip title={solicitation[SolicitationViewDTOFields.LineDesc]}>
          <Typography>
            {stringFormatter.cutIfHaveMoreThan(
              solicitation[SolicitationViewDTOFields.LineDesc],
              25,
            )}
          </Typography>
        </Tooltip>
      ),
    },
    {
      label: 'Asignado',
      value: SolicitationViewDTOFields.StageResponsibleUserName,
    },
    {
      label: 'Ref. Comercial',
      value: SolicitationViewDTOFields.CommercialResponsibleUserName,
    },
    {
      label: 'PYME',
      onRenderCell: (solicitation: SolicitationViewDTO) => (
        <Tooltip
          title={solicitation[SolicitationViewDTOFields.CompanyBusinessName]}
        >
          <Typography>
            {stringFormatter.cutIfHaveMoreThan(
              solicitation[SolicitationViewDTOFields.CompanyBusinessName],
              25,
            )}
          </Typography>
        </Tooltip>
      ),
    },
    { label: 'Nro. Solicitud', value: EntityWithIdFields.Id },
    {
      label: 'Alertas',
      onRenderCell: (solicitation: SolicitationViewDTO) => {
        return (
          <Stack direction={'row'} spacing={1}>
            <SolicitationAlertIconButton
              AlertCode={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
              type={SolicitationAlertIconType.Message}
              onClick={() => {
                navigate(
                  `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}?tab=activity`,
                );
              }}
              securityComponentName={
                SecurityComponents.OffererSolicitationNavHeader
              }
              securityObjectName={
                OffererSolicitationNavHeaderSecObjects.SolicitationOffererChatLink
              }
            />

            <SolicitationAlertIconButton
              AlertCode={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
              type={SolicitationAlertIconType.Document}
              onClick={() => {
                navigate(
                  `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}?tab=requestedFiles`,
                );
              }}
              securityComponentName={
                SecurityComponents.OffererSolicitationNavHeader
              }
              securityObjectName={
                OffererSolicitationNavHeaderSecObjects.SolicitationOffererRequestedFilesLink
              }
            />
          </Stack>
        );
      },
    },
    {
      label: 'Detalle',
      onRenderCell: (solicitation: SolicitationViewDTO) => (
        <SearchIconButton
          tooltipTitle={'Ver solicitud'}
          onClick={() =>
            navigate(
              `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}`,
            )
          }
        />
      ),
    },
  ];

  const searchSolicitations = (filter: SolicitationFilter) => {
    setLoading(true);
    HttpSolicitation.getByOffererId(offerer[EntityWithIdFields.Id], filter)
      .then((paginatedList) => {
        setPaginatedSolicitationList(paginatedList);
        setLoading(false);
        setShouldSearch(false);
      })
      .catch(setError);
  };

  useEffect(() => {
    if (shouldSearch) {
      searchSolicitations(solicitationFilter);
    }
  }, [searchSolicitations, shouldSearch]);

  const changeToLastModDesc = () => {
    setOrder('Fecha Últ. Mod. Descendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToLastModAsc = () => {
    setOrder('Fecha Últ. Mod. Ascendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToProdAsc = () => {
    setOrder('Producto Ascendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'nombreProductoASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToProdDesc = () => {
    setOrder('Producto Descendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'nombreProductoDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToServiceAsc = () => {
    setOrder('Servicio Ascendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'nombreServicioASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToServiceDesc = () => {
    setOrder('Servicio Descendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'nombreServicioDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToToolTypeAsc = () => {
    setOrder('Tipo Instrumento Ascendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'nombreInstrumentoTipoASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToToolTypeDesc = () => {
    setOrder('Tipo Instrumento Descendiente');
    const newFilter: SolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'nombreInstrumentoTipoDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const onPaging = useCallback(
    (currentPage: number) => {
      setSolicitationFilter({
        ...solicitationFilter,
        [SolicitationFilterFields.CurrentPage]: currentPage,
      });

      setShouldSearch(true);
    },
    [solicitationFilter],
  );

  const onFilterSearch = (filter: SolicitationFilter) => {
    if (filter[SolicitationFilterFields.ResponsibleUserStageId] === 0)
      filter[SolicitationFilterFields.ResponsibleUserStageId] = undefined;
    if (filter[SolicitationFilterFields.ResponsibleUserCommercialId] === 0)
      filter[SolicitationFilterFields.ResponsibleUserCommercialId] = undefined;
    if (!filter[SolicitationFilterFields.HasAlert]) {
      filter[SolicitationFilterFields.HasAlert] = undefined;
    }
    setSolicitationFilter({ ...filter });
    setShouldSearch(true);
  };

  return (
    <div>
      <TableWithPaging
        title={
          <CollapseContent tooltip={'filtro'}>
            <Grid container justifyContent={'space-between'} spacing={3}>
              <Grid item xs={3}>
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
                    sx={{ p: 2 }}
                    size={'small'}
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
              <Grid item xs={9}>
                <OffererSolicitationTableFilter
                  filter={solicitationFilter}
                  onClickSearch={onFilterSearch}
                />
              </Grid>
            </Grid>
          </CollapseContent>
        }
        entityPaginada={paginatedSolicitationList}
        columns={columns}
        isLoading={loading}
        error={error}
        onPaging={onPaging}
      />
    </div>
  );
}

export default OffererSolicitationTable;
