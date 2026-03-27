import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerBase from 'components/misc/DrawerBase';
import {SendButton} from 'components/buttons/Buttons';

import {
  CompanyDeclarationOfAssetsInsert, CompanyDeclarationOfAssetsInsertFields,
} from 'types/company/companyFinanceInformationData';

import {RequiredPositiveNumberSchema} from 'util/validation/validationSchemas';
import { useAction } from 'hooks/useAction';
import {BaseResponse, BaseResponseFields} from "../../../types/baseEntities";
import {ControlledTextFieldFilled} from "../../../components/forms";
import useAxios from "../../../hooks/useAxios";

interface CompanyFinanceHeaderDrawerProps {
  show: boolean;
  title: string;
  companyId: number;
  onCloseDrawer: () => void;
  onSubmit: (
    companyId: number,
    header: CompanyDeclarationOfAssetsInsert,
  ) => Promise<BaseResponse>;
  onFinishProcess: (newFinanceHeader: number) => void;
}

function CompanyFinanceHeaderDrawer(props: CompanyFinanceHeaderDrawerProps) {
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();

  const newCompanyFinanceHeaderSchema = yup.object().shape({
    [CompanyDeclarationOfAssetsInsertFields.Year]: RequiredPositiveNumberSchema,
  });

  const { control, reset, handleSubmit } = useForm<CompanyDeclarationOfAssetsInsert>({
    resolver: yupResolver(newCompanyFinanceHeaderSchema),
  });

  const onCloseSubmit = () => {
    reset({
      [CompanyDeclarationOfAssetsInsertFields.Year]: undefined,
    });
    props.onCloseDrawer();
  };

  const onHandleSubmitClose = (response: BaseResponse) => {
    if (!response[BaseResponseFields.HasError]) {
      props.onFinishProcess(response[BaseResponseFields.Data]);
      reset({[CompanyDeclarationOfAssetsInsertFields.Year]: undefined});
      snackbarSuccess('La manifestación de bienes se ha creado con éxito');
    }
  };

  const onHandleSubmit = (data: CompanyDeclarationOfAssetsInsert) => {
    fetchData(
        () => props.onSubmit(props.companyId, data),
        true
    ).then(onHandleSubmitClose)
  };

  return (
    <DrawerBase
      show={props.show}
      title={props.title}
      onCloseDrawer={onCloseSubmit}
      action={<SendButton form='new-declaration-of-assets-form'
                          type="submit"
                          onClick={(e) => e.stopPropagation()}
                          id={"company-declaration-of-assets-new-btn"}
      >
        Cargar
    </SendButton>}
      aboveDialogs
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onHandleSubmit)(e)
      }} id='new-declaration-of-assets-form'>
        <ControlledTextFieldFilled
            control={control}
            name={CompanyDeclarationOfAssetsInsertFields.Year}
            label="Año de la manifestación de bienes"
            helperText={'Formato YYYY'}
        />
      </form>
    </DrawerBase>
  );
}

export default CompanyFinanceHeaderDrawer;
