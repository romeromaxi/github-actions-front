import React, { useState } from 'react';

import { ButtonProps } from '@mui/material';

import { DialogAlert } from 'components/dialog';
import { LoaderBlockUI } from 'components/loader';
import {
  DefaultGreenButton,
  DefaultStylesButton,
} from 'components/buttons/Buttons';
import { BaseResponse, BaseResponseFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface CompanyFileButtonValidateProps extends ButtonProps {
  companyId: number;
  httpValidate: any;
}

function CompanyFileButtonValidate(props: CompanyFileButtonValidateProps) {
  const { snackbarSuccess } = useAction();
  const [responseError, setResponseError] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const validate = () => {
    setLoading(true);
    setResponseError(undefined);
    props.httpValidate
      .validate(props.companyId)
      .then((response: BaseResponse) => {
        if (response[BaseResponseFields.HasError])
          setResponseError(response[BaseResponseFields.ErrorDescription]);
        else snackbarSuccess('¡La sección se ha validado correctamente!');

        setLoading(false);
      });
  };

  return (
    <>
      <DefaultStylesButton {...props} onClick={validate}>
        Confirmar
      </DefaultStylesButton>

      {responseError && (
        <DialogAlert
          onClose={() => setResponseError(undefined)}
          open={true}
          textContent={responseError}
        />
      )}

      {isLoading && <LoaderBlockUI />}
    </>
  );
}

export default CompanyFileButtonValidate;
