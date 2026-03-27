import React, {useContext, useEffect, useState} from 'react';
import * as yup from 'yup';
import {FormProvider, useForm, useFormState} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup/dist/yup';
import {Outlet, useLocation, useNavigate, useOutletContext, useParams,} from 'react-router-dom';

import {HttpMessage, HttpOffererProductLine, HttpProductLine,} from 'http/index';
import {RequiredSelectSchema, RequiredStringSchema} from 'util/validation/validationSchemas';
import {
  ProductLineFields,
  ProductLineFormData,
  ProductLineRequirementFields,
  ProductLineRequisiteDetailFields,
  ProductLineRequisiteDetailInsert,
  ProductLineRequisiteDetailInsertByCode,
  ProductLineRequisiteView,
  ProductLineStatusHistoryView,
  ProductLineUpdate,
} from 'types/lines/productLineData';
import {HttpCacheProduct} from 'http/cache/httpCacheProduct';
import {EntityWithIdFields} from 'types/baseEntities';
import {MessageFields, MessageView} from 'types/workflow/messageData';
import {ProductLineStatesType} from 'types/lines/productLineEnums';
import {PermissionType} from 'types/security';
import useAxios from 'hooks/useAxios';
import {useAction} from 'hooks/useAction';
import {CompanyFileType} from 'types/company/companyEnums';
import {useLogoutActions} from "hooks/useLogoutActions";
import OffererLineRequestPublicationStepperDrawer
  from "../offerer/line/components/OffererLineRequestPublicationStepperDrawer";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";

type ProductLineDetailContextType = {
  lineId: number;
  uniqueLineId: string;
  messageId: number;
  loading: boolean;
  offerer: boolean;
  allowEdit: false;
  allowEditWorkflow: false;
  listStatus: ProductLineStatusHistoryView[];
  requisites: ProductLineRequisiteView[];
  reloadStatus: () => {};
  onSaveProductLine: (data: ProductLineFormData) => {};
  onRequestPublication: (data: ProductLineFormData) => {};
};

interface ProductLineDetailContextProps {
  offerer?: boolean;
}

function ProductLineDetailContext({ offerer }: ProductLineDetailContextProps) {
  const { shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch } = useApplicationCommon();
  const { lineId } = useParams();
  const { fetchData } = useAxios();
  const { showLoader, hideLoader, snackbarWarning } = useAction();
  const { addLogoutAction, removeAndExecuteLogoutAction } = useLogoutActions();
  const location = useLocation();
  const navigate = useNavigate();
  const lineIdNumber = parseInt(lineId ?? '0');
  const [initialShouldWarn, _] = useState<boolean>(shouldWarnBeforeSwitch);
  const [loadingLine, setLoadingLine] = useState<boolean>(false);
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [allowEditWorkflow, setAllowEditWorkflow] = useState<boolean>(false);
  const [listStatus, setListStatus] =
    useState<ProductLineStatusHistoryView[]>();
  const [requisites, setRequisites] = useState<ProductLineRequisiteView[]>();
  const [showRequestPublicationDialog, setShowRequestPublicationDialog] =
    useState<boolean>(false);
  const [messageId, setMessageId] = useState<number>();
  const [uniqueProductLineId, setUniqueProductLineId] = useState<string>();

  const productLineFormSchema = yup.object().shape({
    [ProductLineFields.Line]: RequiredStringSchema,
    [ProductLineFields.LineLarge]: RequiredStringSchema,
    [ProductLineFields.ProductCode]: RequiredSelectSchema,
    [ProductLineFields.ListRequirements]: yup.array().of(
      yup.object().shape({
        [ProductLineRequirementFields.Description]: yup
          .string()
          .max(200, 'Deben ser menos de 200 caracteres'),
      }),
    ),
  });

  const methods = useForm<ProductLineFormData>({
    resolver: yupResolver(productLineFormSchema),
  });

  const { isDirty, isSubmitted } = useFormState({ control: methods.control });

  useEffect(() => {
    if (isDirty) {
      setShouldWarnBeforeSwitch(isDirty);
    }
  }, [isDirty]);

  useEffect(() => {
    if (isSubmitted && !initialShouldWarn) {
      setShouldWarnBeforeSwitch(false);
    }
  }, [isSubmitted]);
  
  
  const offererId = methods.watch(ProductLineFields.OffererId);

  const goBack = () => window.location.reload();

  const reloadLineStatus = () => {
    setListStatus(undefined);
    HttpProductLine.getStatusHistory(lineIdNumber)
      .then(setListStatus)
      .catch(() => setListStatus([]));
  };

  const loadProductLineData = () => {
    setLoadingLine(true);
    Promise.all([
      HttpProductLine.getByProductLineId(lineIdNumber),
      HttpCacheProduct.getRequisites(),
    ]).then(([productLineReponse, requisitesReponse]) => {
      setUniqueProductLineId(productLineReponse[ProductLineFields.UniqueId]);
      
      fetchData(() =>
        HttpMessage.readMessage(
          productLineReponse[ProductLineFields.MessageId] ?? 0,
        ),
      )
        .then((message: MessageView) => {
          let isCreated = 
              (productLineReponse[ProductLineFields.ProductLineStatusCode] === ProductLineStatesType.Created) ||
              (productLineReponse[ProductLineFields.ProductLineStatusCode] === ProductLineStatesType.PublishedInModification);
          let allowEditMessage =
            message[MessageFields.PermissionTypeCode] == PermissionType.Write;
          setAllowEdit(isCreated && !!offerer && allowEditMessage);
          if (
            message[MessageFields.Warning] &&
            message[MessageFields.Warning] !== ''
          ) {
            snackbarWarning(message[MessageFields.Warning]);
          }
          let requisitesByCode: ProductLineRequisiteDetailInsertByCode = {};

          requisitesReponse.forEach((requisite) => {
            let requisiteId: number = requisite[EntityWithIdFields.Id];
            requisitesByCode[requisiteId] =
              productLineReponse.listaRequisitos?.filter(
                (x) =>
                  x[ProductLineRequisiteDetailFields.ProductLineRequisiteId] ===
                  requisiteId,
              ) || [];
          });

          methods.reset({
            ...productLineReponse,
            [ProductLineFields.LineLarge]:
              productLineReponse[ProductLineFields.LineLarge] ?? '',
            [ProductLineFields.ListRequisites]: requisitesByCode,
          } as ProductLineFormData);

          setMessageId(productLineReponse[ProductLineFields.MessageId]);
          setAllowEditWorkflow(allowEditMessage);
          setRequisites(requisitesReponse);
        })
        .catch(() => navigate(-1))
        .finally(() => setLoadingLine(false));
    });
  };

  useEffect(() => {
    reloadLineStatus();
  }, [lineIdNumber]);

  useEffect(() => {
    if (lineIdNumber) {
      loadProductLineData();
    }
  }, []);

  const updateProductLine = (
    data: ProductLineFormData,
    onCallback: () => void,
  ) => {
    showLoader();

    let lineUpdate = {
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
        data[ProductLineFields.FileTypeCode] || CompanyFileType.Long,
    } as unknown as ProductLineUpdate;
    
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

          if (x[ProductLineRequisiteDetailFields.ScoringMinimum] == '')
              x[ProductLineRequisiteDetailFields.ScoringMinimum] =
                  undefined;

          if (x[ProductLineRequisiteDetailFields.DebtSituationMaximum] == '')
              x[ProductLineRequisiteDetailFields.DebtSituationMaximum] =
                  undefined;

        if (hasData)
          requisitesDetail.push({
            ...x,
            [ProductLineRequisiteDetailFields.ProductLineRequisiteId]:
              parseInt(requisiteId),
          });
      });
    }

    lineUpdate[ProductLineFields.ListRequisites] = requisitesDetail;

    HttpOffererProductLine.update(offererId, lineIdNumber, lineUpdate)
      .then(() => {
        setShouldWarnBeforeSwitch(false);
        onCallback();
      })
      .finally(() => {
        hideLoader();
      });
  };

  const onSubmit = (data: ProductLineFormData) =>
    updateProductLine(data, goBack);

  const onRequestPublication = (data: ProductLineFormData) =>
    updateProductLine(data, () => setShowRequestPublicationDialog(true));

  const onCloseRequestPublication = () =>
    setShowRequestPublicationDialog(false);

  const onSubmitRequestPublication = () => {
    goBack();
    setShowRequestPublicationDialog(false);
  };
  
  const closeMessage = (id: number) =>
    fetchData(() => HttpMessage.closeMessage(id), true);
  
  useEffect(() => {
    if (messageId) {
      const handleUnload = async () => await closeMessage(messageId);

      addLogoutAction(handleUnload);

      return () => removeAndExecuteLogoutAction(handleUnload);
    }
  }, [location.pathname, messageId]);

  return (
    <FormProvider {...methods}>
      <Outlet
        context={{
          lineId: lineIdNumber,
          uniqueLineId: uniqueProductLineId,
          messageId: messageId,
          loading: loadingLine,
          offerer: !!offerer,
          allowEdit: allowEdit,
          allowEditWorkflow: allowEditWorkflow,
          listStatus: listStatus,
          requisites: requisites,
          reloadStatus: reloadLineStatus,
          onSaveProductLine: onSubmit,
          onRequestPublication: onRequestPublication,
        }}
      />

      <OffererLineRequestPublicationStepperDrawer open={showRequestPublicationDialog} 
                                                  offererId={offererId} 
                                                  productLineId={lineIdNumber} 
                                                  onCloseDrawer={onCloseRequestPublication} 
                                                  onSubmitDrawer={onSubmitRequestPublication}
      />
    </FormProvider>
  );
}

export default ProductLineDetailContext;
export function useProductLineDetail() {
  return useOutletContext<ProductLineDetailContextType>();
}
