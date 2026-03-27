import React, { useCallback, useEffect, useState } from 'react';
import { useAction } from 'hooks/useAction';
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import { DialogAlert } from 'components/dialog';
import {
  ITableColumn,
  Pagination,
  TableColumnType,
  TableList,
} from 'components/table';

import { ProductLineStatesType } from 'types/lines/productLineEnums';
import {
  LineQuaFilterSearch,
  LineQuaFilterSearchFields,
  ProductLineFields,
  ProductLineView, ProductLineViewSummaryWithPublicationData,
} from 'types/lines/productLineData';
import {
  BaseResponse,
  BaseResponseFields,
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPaginationFields,
  EntityWithIdFields,
} from 'types/baseEntities';

import { HttpProductLine } from 'http/index';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AsyncSelect } from '../../../components/forms';
import {
  ButtonDropdown,
  SearchButton,
} from '../../../components/buttons/Buttons';
import { HttpCacheProductLine } from '../../../http/cache/httpProductLine';
import ProductLineStateChip from "../../lines/components/ProductLineStateChip";
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {LineSegments} from "@phosphor-icons/react";
import {ControlledMultipleSelectAsync} from "../../../components/forms/ControlledMultipleSelectAsync";

enum LineDialogAlertFields {
  Id = 'id',
  Message = 'message',
  Action = 'action',
}

interface LineDialogAlert {
  [LineDialogAlertFields.Id]?: number;
  [LineDialogAlertFields.Message]: string;
  [LineDialogAlertFields.Action]?: (
    productLineId: number,
  ) => Promise<BaseResponse>;
}

function LinesList() {
  const navigate = useNavigate();
  const { setTitle, showLoader, hideLoader, snackbarSuccess, snackbarError } =
    useAction();
  const [order, setOrder] = useState<string>('Fecha Últ. Mod. Descendiente');

  setTitle('Líneas');

  const [linesWithPagination, setLinesWithPagination] =
    useState<EntityListWithPagination<ProductLineViewSummaryWithPublicationData>>();
  const [lineSearchFilter, setLineSearchFilter] = useState<LineQuaFilterSearch>(
    {
      [LineQuaFilterSearchFields.LineOffererName]: undefined,
      [LineQuaFilterSearchFields.LineProductName]: undefined,
      [LineQuaFilterSearchFields.LineStateCods]: [],
      [EntityPaginationFields.PageSize]: 10,
      [EntityPaginationFields.ActualPage]: 1,
    },
  );

  const changeToLastMod = () => {
    setOrder('Fecha Últ. Mod. Descendiente');
    const newFilter: LineQuaFilterSearch = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModDESC',
    };

    setLineSearchFilter(newFilter);
    loadProductLines(newFilter);
  };

  const changeToProdAsc = () => {
    setOrder('Producto Ascendiente');
    const newFilter: LineQuaFilterSearch = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreProductoASC',
    };

    setLineSearchFilter(newFilter);
    loadProductLines(newFilter);
  };

  const changeToProdDesc = () => {
    setOrder('Producto Descendiente');
    const newFilter: LineQuaFilterSearch = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'nombreProductoDESC',
    };

    setLineSearchFilter(newFilter);
    loadProductLines(newFilter);
  };

  const changeToOffererAsc = () => {
    setOrder('Oferente Ascendiente');
    const newFilter: LineQuaFilterSearch = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialOferenteASC',
    };

    setLineSearchFilter(newFilter);
    loadProductLines(newFilter);
  };

  const changeToOffererDesc = () => {
    setOrder('Oferente Descendiente');
    const newFilter: LineQuaFilterSearch = {
      ...lineSearchFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialOferenteDESC',
    };

    setLineSearchFilter(newFilter);
    loadProductLines(newFilter);
  };

  const { control, handleSubmit } = useForm<LineQuaFilterSearch>({
    defaultValues: {
      ...lineSearchFilter,
    },
  });

  const [loading, setLoading] = useState(true);
  const [lineToAction, setLineToAction] = useState<LineDialogAlert>({
    [LineDialogAlertFields.Message]: '',
  });

  const linesColumns: ITableColumn[] = [
    { label: 'Producto', value: ProductLineFields.ProductDesc },
    { label: 'Línea', value: ProductLineFields.Line },
    { label: 'Oferente', value: ProductLineFields.OffererBusinessName },
    {
      label: 'Últ. Mod.',
      value: ProductLineFields.DateLastModified,
      type: TableColumnType.Date,
    },
    {
      label: 'Estado',
      value: ProductLineFields.ProductLineStatusDesc,
      onRenderCell: (line: ProductLineViewSummaryWithPublicationData) => {
        let statusCode =
          line[ProductLineFields.ProductLineStatusCode] ??
          ProductLineStatesType.Created;
        return (
          <ProductLineStateChip code={statusCode}
                                description={line[ProductLineFields.ProductLineStatusDesc]} />
        );
      },
    },
    {
      label: '',
      value: '',
      onRenderCell: (line: ProductLineView) => (
        <SearchButton
          color={'inherit'}
          size={'small'}
          onClick={() =>
            navigate(`/internal/lines/${line[EntityWithIdFields.Id]}`)
          }
        >
          Ver
        </SearchButton>
      ),
    },
  ];
  const loadProductLines = (filter: LineQuaFilterSearch) => {
    setLoading(true);

    HttpProductLine.searchInternal(filter).then((lines) => {
      setLinesWithPagination(lines);
      setLoading(false);
    });
  };

  const onSearch = (data: LineQuaFilterSearch) => {
    setLineSearchFilter(data);
    loadProductLines(data);
  };

  const loadProducts = useCallback(() => {
    return HttpProductLine.getProducts();
  }, []);

  const loadOfferers = useCallback(() => {
    return HttpProductLine.getOfferers();
  }, []);

  useEffect(() => {
    loadProductLines(lineSearchFilter);
  }, []);

  const onCloseAlert = () =>
    setLineToAction({
      [LineDialogAlertFields.Message]: '',
    });

  const onSubmitAlert = () => {
    const lineId: number | undefined = lineToAction[LineDialogAlertFields.Id];
    const functionToExecute:
      | ((id: number) => Promise<BaseResponse>)
      | undefined = lineToAction[LineDialogAlertFields.Action];

    if (!!lineId && !!functionToExecute) {
      showLoader();

      functionToExecute(lineId)
        .then((response) => {
          if (response[BaseResponseFields.HasError])
            snackbarError(response[BaseResponseFields.ErrorDescription]);
          else {
            setLineToAction({
              [LineDialogAlertFields.Message]: '',
            });
            snackbarSuccess('Se aprobó la publicación de la línea');
            loadProductLines(lineSearchFilter);
          }
        })
        .finally(() => hideLoader());
    }
  };

  const onPaging = (actualPage: number) => {
    const filter: LineQuaFilterSearch = {
      ...lineSearchFilter,
      [EntityPaginationFields.ActualPage]: actualPage,
    };

    loadProductLines(filter);
  };

  return (
    <Stack spacing={3}>
      <TabSectionCardHeader icon={LineSegments}
                            sectionTitle={'ABM de líneas'}
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSearch)}>
            <Grid container alignItems={'center'} spacing={5}>
              <Grid item xs={6} md={3}>
                <AsyncSelect
                  loadOptions={loadProducts}
                  control={control}
                  name={LineQuaFilterSearchFields.LineProductName}
                  fullWidth
                  label={'Producto'}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <AsyncSelect
                  loadOptions={loadOfferers}
                  control={control}
                  name={LineQuaFilterSearchFields.LineOffererName}
                  fullWidth
                  label={'Oferente'}
                />
              </Grid>
              <Grid item xs={10} md={3.5}>
                <ControlledMultipleSelectAsync
                  id="selMulLineStatesSearch"
                  label="Estado"
                  control={control}
                  loadOptions={HttpCacheProductLine.getStatesType}
                  name={LineQuaFilterSearchFields.LineStateCods}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2} md={1.5}>
                <SearchButton type={'submit'}>Buscar</SearchButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent={'flex-end'}
      >
        <Typography fontWeight={600} color={'grey.700'} fontSize={'1.2rem'}>
          Ordenar por:
        </Typography>
        <ButtonDropdown
          label={order}
          items={[
            { label: 'Fecha Últ. Mod. Descendiente', onClick: changeToLastMod },
            { label: 'Producto Ascendiente', onClick: changeToProdAsc },
            { label: 'Producto Descendiente', onClick: changeToProdDesc },
            { label: 'Oferente Ascendiente', onClick: changeToOffererAsc },
            { label: 'Oferente Descendiente', onClick: changeToOffererDesc },
          ]}
        />
      </Stack>
      <Card>
        <TableList<ProductLineViewSummaryWithPublicationData>
          entityList={linesWithPagination?.[EntityListWithPaginationFields.List]}
          columns={linesColumns}
          isLoading={loading}
          error={false}
        />
        <CardActions>
          <Pagination
            entityPagination={
              linesWithPagination?.[EntityListWithPaginationFields.Pagination]
            }
            isLoading={loading}
            onPaging={onPaging}
          />
        </CardActions>

        <DialogAlert
          open={!!lineToAction[LineDialogAlertFields.Id]}
          onClose={onCloseAlert}
          onConfirm={onSubmitAlert}
          textContent={lineToAction[LineDialogAlertFields.Message]}
        />
      </Card>
    </Stack>
  );
}

export default LinesList;
