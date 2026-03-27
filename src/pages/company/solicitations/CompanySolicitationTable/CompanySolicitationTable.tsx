import React, { useCallback, useEffect, useState } from 'react';
import { CompanyViewDTO } from 'types/company/companyData';
import { HttpSolicitation } from 'http/index';
import {
  EntityListWithPagination,
  EntityPaginationFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import {
  CompanySolicitationFilter,
  SolicitationFilterFields,
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import {
  ITableColumn,
  TableColumnType,
  TableWithPaging,
} from 'components/table';
import {
  SolicitationCompanyStatusChip
} from '../../../offerer/components/OffererSolicitation/SolicitationOffererStatusChip';
import { Grid, Stack, Tooltip, Typography } from '@mui/material';
import { stringFormatter } from 'util/formatters/stringFormatter';
import {
  SolicitationAlertIconButton,
  SolicitationAlertIconType,
} from '../../../offerer/components/OffererSolicitation/OffererSolicitationTable/SolicitationAlertIcons';
import CompanySolicitationTableFilter from './CompanySolicitationTableFilter';
import { useNavigate } from 'react-router-dom';
import {
  CompanySolicitationPageSecObjects,
  SecurityComponents,
} from 'types/security';
import {
  ButtonDropdown,
  SearchIconButton,
} from '../../../../components/buttons/Buttons';
import CollapseContent from '../../../../components/misc/CollapseContent';

interface CompanySolicitationTableProps {
  company: CompanyViewDTO;
}

function CompanySolicitationTable({ company }: CompanySolicitationTableProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [shouldSearch, setShouldSearch] = useState<boolean>(true);
  const [paginatedSolicitationList, setPaginatedSolicitationList] =
    useState<EntityListWithPagination<SolicitationViewDTO>>();
  const [solicitationFilter, setSolicitationFilter] =
    useState<CompanySolicitationFilter>({
      [SolicitationFilterFields.PageSize]: 10,
      [SolicitationFilterFields.CurrentPage]: 1,
    });

  const [order, setOrder] = useState<string>('Defecto');

  const columns: ITableColumn[] = [
    { label: 'Nro. Solicitud', value: EntityWithIdFields.Id },

    {
      label: 'Estado',
      onRenderCell: (solicitation: SolicitationViewDTO) => (
        <SolicitationCompanyStatusChip
          label={
            solicitation[
              SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc
            ]
          }
          statusCode={
            solicitation[
              SolicitationViewDTOFields.CompanySolicitationStatusTypeCode
            ]
          }
          alertType={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
        />
      ),
    },
    {
      label: 'Fecha',
      value: SolicitationViewDTOFields.CompanyLastModified,
      type: TableColumnType.Date,
      helperTooltip: 'Fecha de ingreso al estado',
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
      label: 'Producto',
      onRenderCell: (solicitation: SolicitationViewDTO) => (
        <Tooltip title={solicitation[SolicitationViewDTOFields.ProductDesc]}>
          <Typography>
            {stringFormatter.cutIfHaveMoreThan(
              solicitation[SolicitationViewDTOFields.ProductDesc],
              25,
            )}
          </Typography>
        </Tooltip>
      ),
    },
    {
      label: 'Oferente',
      onRenderCell: (solicitation: SolicitationViewDTO) => (
        <Tooltip
          title={solicitation[SolicitationViewDTOFields.OffererBusinessName]}
        >
          <Typography>
            {stringFormatter.cutIfHaveMoreThan(
              solicitation[SolicitationViewDTOFields.OffererBusinessName],
              25,
            )}
          </Typography>
        </Tooltip>
      ),
    },
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
                  `/mis-solicitudes/${company[EntityWithIdFields.Id]}/${solicitation[EntityWithIdFields.Id]}?tab=activity`,
                );
              }}
              securityComponentName={SecurityComponents.CompanySolicitationPage}
              securityObjectName={
                CompanySolicitationPageSecObjects.SolicitationCompanyChatLink
              }
            />

            <SolicitationAlertIconButton
              AlertCode={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
              type={SolicitationAlertIconType.Document}
              onClick={() => {
                navigate(
                  `/mis-solicitudes/${company[EntityWithIdFields.Id]}/${solicitation[EntityWithIdFields.Id]}?tab=requestedFiles`,
                );
              }}
              securityComponentName={SecurityComponents.CompanySolicitationPage}
              securityObjectName={
                CompanySolicitationPageSecObjects.SolicitationCompanyRequestedFilesLink
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
              `/mis-solicitudes/${company[EntityWithIdFields.Id]}/${solicitation[EntityWithIdFields.Id]}`,
            )
          }
        />
      ),
    },
  ];

  const searchSolicitations = useCallback(
    (filter: CompanySolicitationFilter) => {
      setLoading(true);
      HttpSolicitation.getByFilter(company[EntityWithIdFields.Id], filter)
        .then((paginatedList) => {
          setPaginatedSolicitationList(paginatedList);
          setLoading(false);
          setShouldSearch(false);
        })
        .catch(setError);
    },
    [solicitationFilter],
  );

  useEffect(() => {
    if (shouldSearch) {
      searchSolicitations(solicitationFilter);
    }
  }, [searchSolicitations, shouldSearch]);

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

  const onFilterSearch = (filter: CompanySolicitationFilter) => {
    if (!filter[SolicitationFilterFields.HasAlert]) {
      filter[SolicitationFilterFields.HasAlert] = undefined;
    }
    setSolicitationFilter({ ...filter });
    setShouldSearch(true);
  };

  const changeToDefault = () => {
    setOrder('Defecto');

    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: '',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToStateAsc = () => {
    setOrder('Estado Ascendente');

    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'descSolicitudEstadoEmpresaASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToStateDesc = () => {
    setOrder('Estado Descendente');

    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'descSolicitudEstadoEmpresaDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToLastModDesc = () => {
    setOrder('Fecha Últ. Mod. Descendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModEstadoEmpresaDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToLastModAsc = () => {
    setOrder('Fecha Últ. Mod. Ascendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModEstadoEmpresaASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToOffererAsc = () => {
    setOrder('Oferente Ascendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialOferenteASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToOffererDesc = () => {
    setOrder('Oferente Descendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialOferenteDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToProdAsc = () => {
    setOrder('Producto Ascendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'descProductoASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToProdDesc = () => {
    setOrder('Producto Descendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'descProductoDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToLineAsc = () => {
    setOrder('Linea Ascendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'descProductoLineaASC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  const changeToLineDesc = () => {
    setOrder('Linea Descendente');
    const newFilter: CompanySolicitationFilter = {
      ...solicitationFilter,
      [EntityPaginationFields.OrderBy]: 'descProductoLineaDESC',
    };

    setSolicitationFilter(newFilter);
    searchSolicitations(newFilter);
  };

  return (
    <div>
      <TableWithPaging
        title={
          <CollapseContent tooltip={'filtro'}>
            <Grid container justifyContent={'space-between'} spacing={3}>
              <Grid item xs={3}>
                {/*
                                    <Typography variant={'h5'} sx={{fontWeight: 600}}>
                                        Solicitudes
                                        <Typography variant={'subtitle2'} sx={{fontWeight: 200}}>
                                            {`Encontramos un total de ${paginatedSolicitationList?.[EntityListWithPaginationFields.Pagination][EntityPaginationFields.CantRecords] || '...'} solicitudes`}
                                        </Typography>
                                    </Typography>
                                     */}
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
                    sx={{ p: 0 }}
                    size={'small'}
                    items={[
                      { label: 'Defecto', onClick: changeToDefault },
                      { label: 'Estado Ascendente', onClick: changeToStateAsc },
                      {
                        label: 'Estado Descendente',
                        onClick: changeToStateDesc,
                      },
                      {
                        label: 'Fecha Últ. Mod. Ascendente',
                        onClick: changeToLastModAsc,
                      },
                      {
                        label: 'Fecha Últ. Mod. Descendente',
                        onClick: changeToLastModDesc,
                      },
                      {
                        label: 'Oferente Ascendente',
                        onClick: changeToOffererAsc,
                      },
                      {
                        label: 'Oferente Descendente',
                        onClick: changeToOffererDesc,
                      },
                      { label: 'Línea Ascendente', onClick: changeToLineAsc },
                      { label: 'Línea Descendente', onClick: changeToLineDesc },
                      {
                        label: 'Producto Ascendente',
                        onClick: changeToProdAsc,
                      },
                      {
                        label: 'Producto Descendente',
                        onClick: changeToProdDesc,
                      },
                    ]}
                  />
                </Stack>
              </Grid>
              <Grid item xs={9}>
                <CompanySolicitationTableFilter
                  companyId={company[EntityWithIdFields.Id]}
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

export default CompanySolicitationTable;
