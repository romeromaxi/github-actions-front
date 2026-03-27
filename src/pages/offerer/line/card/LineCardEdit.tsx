import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Stack,
} from '@mui/material';
import LineCardEditFormContent from './LineCardEditFormContent';
import React, { useEffect, useState } from 'react';
import StoreIcon from '@mui/icons-material/Store';
import {
  ProductLineFields, ProductLineFormData,
  ProductLineRequirementFields,
  ProductLineRequisiteDetailFields,
  ProductLineRequisiteDetailInsert,
  ProductLineRequisiteDetailInsertByCode,
  ProductLineRequisiteView,
  ProductLineStatusHistoryView,
  ProductLineUpdate, ProductLineViewDetail, ProductLineViewSummaryWithPublicationData,
} from 'types/lines/productLineData';
import * as yup from 'yup';
import { object } from 'yup';
import {
  RequiredStringSchema,
} from 'util/validation/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {
  HttpAction,
  HttpOffererProductLine,
  HttpProductLine,
  HttpMessage,
} from 'http/index';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import {
  BaseResponseFields,
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import { FormProvider, useForm } from 'react-hook-form';
import { useAction } from 'hooks/useAction';
import { CompanyFileType } from 'types/company/companyEnums';
import { ProductLineStatesColorMapByNumber } from 'util/typification/productLineColors';
import OffererLineRequestPublicationDialog from '../components/OffererLineRequestPublicationDialog';
import { ProductLineStatesType } from 'types/lines/productLineEnums';
import { DeleteTwoTone, Search } from '@mui/icons-material';
import { DialogAlert } from 'components/dialog';
import { DefaultStylesButton } from 'components/buttons/Buttons';
import ProductLineDetailDialog from '../../../markets/lines/components/ProductLineDetailDialog';
import LineMarketViewDialog from './LineMarketViewDialog';
import { userStorage } from 'util/localStorage/userStorage';
import { Module } from 'types/form/login/login-enum';
import ActionButtonDropdown from '../../../workflow/components/ActionButtonDropdown';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ActionExecute, ActionExecuteFields } from 'types/workflow/actionData';
import useAxios from 'hooks/useAxios';
import {
  MessageFields,
  MessageView,
} from 'types/workflow/messageData';
import { PermissionType } from 'types/security';
import ProductLineStateChip from "pages/lines/components/ProductLineStateChip";

interface LineCardEditProps {
  line: ProductLineViewSummaryWithPublicationData;
  onClose: () => void;
  onReload: () => void;
  disabled?: boolean;
}

export const LineCardEditContext = React.createContext({
  loading: true,
  allowEdit: false,
  statusHistory: [] as ProductLineStatusHistoryView[],
});

function LineCardEdit({
  line,
  onClose,
  onReload,
  disabled,
}: LineCardEditProps) {
  const { fetchData } = useAxios();
  const {
    showLoader,
    hideLoader,
    snackbarSuccess,
    snackbarError,
    snackbarWarning,
  } = useAction();
  const userType = userStorage.getUserType();

  const [loading, setLoading] = useState<boolean>(true);
  const [requisites, setRequisites] = useState<ProductLineRequisiteView[]>();
  const [title, setTitle] = useState<string>(line[ProductLineFields.Line]);
  const [showRequestPublicationDialog, setShowRequestPublicationDialog] =
    useState<boolean>(false);
  const [
    showUnsubscribePublicationDialog,
    setShowUnsubscribePublicationDialog,
  ] = useState<boolean>(false);
  const [showEditConfirmationDialog, setShowEditConfirmationDialog] =
    useState<boolean>(false);
  const [lineState, setLineState] = useState<EntityWithIdAndDescription>();
  const [statusWasChanged, setStatusWasChanged] = useState<boolean>(false);
  const [productLineDetail, setProductLineDetail] = useState<ProductLineViewDetail>();
  const [productLineDetailOpen, setProductLineDetailOpen] =
    useState<boolean>(false);
  const [marketPreviewOpen, setMarketPreviewOpen] = useState<boolean>(false);
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [statusHistory, setStatusHistory] = useState<
    ProductLineStatusHistoryView[]
  >([]);

  const OffererLineFormSchema = yup.object().shape({
    [ProductLineFields.Line]: RequiredStringSchema,
    [ProductLineFields.LineLarge]: RequiredStringSchema,
    /*        [ProductLineFields.AmountMin]: NotRequiredNumberSchema,
        [ProductLineFields.AmountMax]: NotRequiredNumberSchema,
        [ProductLineFields.RateMin]: NotRequiredNumberSchema,
        [ProductLineFields.RateMax]: NotRequiredNumberSchema,
        [ProductLineFields.MonthsMin]: NotRequiredNumberSchema,
        [ProductLineFields.MonthsMax]: NotRequiredNumberSchema,
        [ProductLineFields.MonthGrace]: NotRequiredNumberSchema,*/
    [ProductLineFields.ListRequirements]: yup.array().of(
      object().shape({
        [ProductLineRequirementFields.Description]: yup
          .string()
          .max(200, 'Deben ser menos de 200 caracteres'),
      }),
    ),
  });

  const methods = useForm<ProductLineFormData>({
    defaultValues: line,
    resolver: yupResolver(OffererLineFormSchema),
  });

  const handleOnDetail = (line: ProductLineViewSummaryWithPublicationData) => {
    HttpProductLine.getByProductLineId(line[EntityWithIdFields.Id]).then(
      (productLine) => {
        setProductLineDetail(productLine);
        setProductLineDetailOpen(true);
      },
    );
  };

  const handleOnMarketPreview = (line: ProductLineViewSummaryWithPublicationData) => {
    HttpProductLine.getByProductLineId(line[EntityWithIdFields.Id]).then(
      (productLine) => {
        setProductLineDetail(productLine);
        setMarketPreviewOpen(true);
      },
    );
  };

  const updateProductLine = (
    data: ProductLineFormData,
    onCallback: () => void,
  ) => {
    showLoader();

    let offererLineUpdate = {
      ...data,
      [ProductLineFields.AmountMin]:
        data[ProductLineFields.AmountMin] || undefined,
      [ProductLineFields.AmountMax]:
        data[ProductLineFields.AmountMax] || undefined,
      [ProductLineFields.RateMin]: data[ProductLineFields.RateMin] || undefined,
      [ProductLineFields.RateMax]: data[ProductLineFields.RateMax] || undefined,
      [ProductLineFields.MonthsMin]:
        data[ProductLineFields.MonthsMin] || undefined,
      [ProductLineFields.MonthsMax]:
        data[ProductLineFields.MonthsMax] || undefined,
      [ProductLineFields.MonthGrace]:
        data[ProductLineFields.MonthGrace] || undefined,
      [ProductLineFields.ListRequirements]:
        data[ProductLineFields.ListRequirements] || [],
      [ProductLineFields.FileTypeCode]:
        data[ProductLineFields.FileTypeCode] || CompanyFileType.Short,
    } as ProductLineUpdate;

    let requisitesDetail: ProductLineRequisiteDetailInsert[] = [];
    for (let requisiteId in data[ProductLineFields.ListRequisites]) {
      // @ts-ignore
      data[ProductLineFields.ListRequisites][requisiteId].forEach((x) => {
        let hasData: boolean = Object.entries(x).some(
          (x) => x[1] !== undefined && x[1] !== '',
        );

        if (x[ProductLineRequisiteDetailFields.BillingAmountMinimum] == '')
          x[ProductLineRequisiteDetailFields.BillingAmountMinimum] = undefined;

        if (x[ProductLineRequisiteDetailFields.BillingAmountMaximum] == '')
          x[ProductLineRequisiteDetailFields.BillingAmountMaximum] = undefined;

        if (x[ProductLineRequisiteDetailFields.SeniorityCompanyMinimum] == '')
          x[ProductLineRequisiteDetailFields.SeniorityCompanyMinimum] =
            undefined;

        if (x[ProductLineRequisiteDetailFields.SeniorityCompanyMaximum] == '')
          x[ProductLineRequisiteDetailFields.SeniorityCompanyMaximum] =
            undefined;

        if (hasData)
          requisitesDetail.push({
            ...x,
            [ProductLineRequisiteDetailFields.ProductLineRequisiteId]:
              parseInt(requisiteId),
          });
      });
    }

    offererLineUpdate[ProductLineFields.ListRequisites] = requisitesDetail;

    HttpOffererProductLine.update(
      line[ProductLineFields.OffererId],
      line[ProductLineFields.Id],
      offererLineUpdate,
    )
      .then(() => {
        onCallback();
      })
      .finally(() => {
        hideLoader();
      });
  };

  const onSubmit = (data: ProductLineFormData) =>
    updateProductLine(data, onReload);

  const onShowUnsubscribePublication = () =>
    setShowUnsubscribePublicationDialog(true);

  const onCloseAlertUnsubscribe = () =>
    setShowUnsubscribePublicationDialog(false);

  const onSubmitAlertUnsubscribe = () => {
    showLoader();

    HttpOffererProductLine.unsubscribePublication(
      line[ProductLineFields.OffererId],
      line[ProductLineFields.Id],
    )
      .then((response) => {
        if (response[BaseResponseFields.HasError])
          snackbarError(response[BaseResponseFields.ErrorDescription]);
        else {
          onReload();
          setShowUnsubscribePublicationDialog(false);
          snackbarSuccess(
            'La publicación de la línea se ha dado de baja exitosamente',
          );
        }
      })
      .finally(() => hideLoader());
  };

  const onCloseAlertEditConfirmation = () =>
    setShowEditConfirmationDialog(false);

  const onSubmitAlertEditConfirmation = () => {
    const messageId: number = line[ProductLineFields.MessageId] ?? 0;

    if (messageId) {
      const dataExecute: ActionExecute = {
        [ActionExecuteFields.MessageId]: messageId,
        [ActionExecuteFields.WorkflowVariables]: [],
        [ActionExecuteFields.Observations]: '',
      } as ActionExecute;
      fetchData(() => HttpAction.executeAction(34, dataExecute), true).then(
        () => {
          fetchData(
            () =>
              HttpProductLine.getActualProductLineId(
                line[EntityWithIdFields.Id],
              ),
            true,
          ).then((newProductLineId: number) => {
            if (newProductLineId != line[EntityWithIdFields.Id]) {
              const newUrl = window.location.pathname.replace(
                `${line[EntityWithIdFields.Id]}`,
                `${newProductLineId}`,
              );
              window.history.replaceState({}, '', newUrl);
            }

            window.location.reload();
          });
        },
      );
    }
  };

  const loadLineData = () => {
    Promise.all([
      HttpOffererProductLine.getById(
        line[ProductLineFields.OffererId],
        line[ProductLineFields.Id],
      ),
      HttpCacheProduct.getRequisites(),
      HttpProductLine.getStatusHistory(line[ProductLineFields.Id]),
    ]).then(([offererLine, requisites, history]) => {
      let requisitesByCode: ProductLineRequisiteDetailInsertByCode = {};

      requisites.forEach((requisite) => {
        let requisiteId: number = requisite[EntityWithIdFields.Id];
        requisitesByCode[requisiteId] =
          offererLine.listaRequisitos?.filter(
            (x) =>
              x[ProductLineRequisiteDetailFields.ProductLineRequisiteId] ===
              requisiteId,
          ) || [];
      });

      methods.reset({
        ...offererLine,
        [ProductLineFields.LineLarge]:
          offererLine[ProductLineFields.LineLarge] ?? '',
        [ProductLineFields.ListRequisites]: requisitesByCode,
      } as ProductLineFormData);

      setTitle(offererLine[ProductLineFields.Line]);
      setRequisites(requisites);
      setLoading(false);
      setLineState({
        [EntityWithIdFields.Id]:
          offererLine[ProductLineFields.ProductLineStatusCode],
        [EntityWithIdAndDescriptionFields.Description]:
          offererLine[ProductLineFields.ProductLineStatusDesc],
      });
      setStatusWasChanged(
        offererLine[ProductLineFields.ProductLineStatusCode] !=
          line[ProductLineFields.ProductLineStatusCode],
      );
      setStatusHistory(history);
    });
  };

  const checkPermissionsAndLoadData = () => {
    setLoading(true);

    fetchData(() =>
      HttpMessage.readMessage(line[ProductLineFields.MessageId] ?? 0),
    )
      .then((message: MessageView) => {
        let isCreated =
          line[ProductLineFields.ProductLineStatusCode] ===
          ProductLineStatesType.Created;
        let allowEditMessage =
          message[MessageFields.PermissionTypeCode] == PermissionType.Write;
        setAllowEdit(isCreated && !disabled && allowEditMessage);
        if (
          message[MessageFields.Warning] &&
          message[MessageFields.Warning] !== ''
        ) {
          snackbarWarning(message[MessageFields.Warning]);
        }
        loadLineData();
      })
      .catch(onClose);
  };

  const onRequestPublication = (data: ProductLineFormData) =>
    updateProductLine(data, () => setShowRequestPublicationDialog(true));

  const onHandleClose = () => (statusWasChanged ? onReload() : onClose());

  const onCloseRequestPublication = () =>
    setShowRequestPublicationDialog(false);

  const onSubmitRequestPublication = () => {
    onReload();
    setShowRequestPublicationDialog(false);
  };

  useEffect(() => {
    checkPermissionsAndLoadData();
  }, []);

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          !loading &&
          line &&
          lineState && (
            <Stack
              direction={'row'}
              alignItems={'center'}
              pt={'0.5rem'}
              spacing={2.5}
            >
              <ProductLineStateChip code={lineState[EntityWithIdFields.Id]}
                                    description={lineState[EntityWithIdAndDescriptionFields.Description]} />
              <DefaultStylesButton
                size={'small'}
                startIcon={<Search />}
                onClick={() => handleOnDetail(line)}
              >
                Detalle
              </DefaultStylesButton>
              <DefaultStylesButton
                size={'small'}
                startIcon={<StoreIcon />}
                onClick={() => handleOnMarketPreview(line)}
              >
                Previsualizar
              </DefaultStylesButton>
              {lineState[EntityWithIdFields.Id] ===
                ProductLineStatesType.Created &&
                userType == Module.Offerer && (
                  <Button
                    variant={'outlined'}
                    size={'small'}
                    onClick={methods.handleSubmit(onRequestPublication)}
                  >
                    Solicitar Publicación
                  </Button>
                )}
              {lineState[EntityWithIdFields.Id] ===
                ProductLineStatesType.Published &&
                userType == Module.Offerer && (
                  <Button
                    variant={'contained'}
                    size={'small'}
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => setShowEditConfirmationDialog(true)}
                  >
                    Modificar
                  </Button>
                )}

              {userType == Module.Internal &&
                !!line[ProductLineFields.CurrentStageId] && (
                  <ActionButtonDropdown
                    stageId={line[ProductLineFields.CurrentStageId] ?? 0}
                    messageId={line[ProductLineFields.MessageId] ?? 0}
                  />
                )}

              {lineState[EntityWithIdFields.Id] ===
                ProductLineStatesType.Published && (
                <Button
                  variant={'outlined'}
                  size={'small'}
                  color={'error'}
                  startIcon={<DeleteTwoTone />}
                  onClick={onShowUnsubscribePublication}
                >
                  Dar de Baja
                </Button>
              )}
            </Stack>
          )
        }
      />
      <CardContent>
        <LineCardEditContext.Provider
          value={{ loading, allowEdit, statusHistory }}
        >
          <FormProvider {...methods}>
            <LineCardEditFormContent requisites={requisites} />
          </FormProvider>
        </LineCardEditContext.Provider>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="secondary" onClick={onHandleClose}>
          Cancelar
        </Button>

        {allowEdit && (
          <Button variant="contained" onClick={methods.handleSubmit(onSubmit)}>
            Guardar
          </Button>
        )}
      </CardActions>

      <OffererLineRequestPublicationDialog
        open={showRequestPublicationDialog}
        offererId={line[ProductLineFields.OffererId]}
        productLineId={line[EntityWithIdFields.Id]}
        onCloseDialog={onCloseRequestPublication}
        onSubmitDialog={onSubmitRequestPublication}
      />

      <DialogAlert
        open={showUnsubscribePublicationDialog}
        onClose={onCloseAlertUnsubscribe}
        onConfirm={onSubmitAlertUnsubscribe}
        textContent={'¿Estás seguro que deseás dar de baja la publicación?'}
      />

      <DialogAlert
        open={showEditConfirmationDialog}
        onClose={onCloseAlertEditConfirmation}
        onConfirm={onSubmitAlertEditConfirmation}
        textContent={'¿Estás seguro que deseás modificar la línea publicada?'}
      />

      {productLineDetail && productLineDetailOpen && (
        <ProductLineDetailDialog
          onClose={() => {
            setProductLineDetailOpen(false);
            setProductLineDetail(undefined);
          }}
          line={productLineDetail}
          open={productLineDetailOpen}
        />
      )}
      {productLineDetail && marketPreviewOpen && (
        <LineMarketViewDialog
          onClose={() => {
            setMarketPreviewOpen(false);
            setProductLineDetail(undefined);
          }}
          line={productLineDetail}
          open={marketPreviewOpen}
        />
      )}
    </Card>
  );
}

export default LineCardEdit;
