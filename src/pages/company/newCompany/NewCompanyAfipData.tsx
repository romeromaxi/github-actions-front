import React, {useContext, useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {Alert, Grid, Link, Stack, Typography} from '@mui/material';
import { UpdateButton } from 'components/buttons/Buttons';
import { LoaderBlockUI } from 'components/loader';

import { RequiredCuitSchema } from 'util/validation/validationSchemas';

import { HttpPersonNosis, HttpUser } from 'http/index';
import {
  PersonCompanyConsultantResponseDTO,
  PersonCompanyConsultantResponseDTOFields,
} from 'types/person/personNosisData';
import { ControlledTextFieldFilled } from '../../../components/forms';
import {
  PersonTypes,
  ValidationStatesType,
} from '../../../types/person/personEnums';
import { UserModelView } from '../../../types/user';
import CompanyAlreadyValidatedForm from './CompanyAlreadyValidatedForm';
import { NewCompanyContext } from '../components/MyCompaniesList';
import {
  CompanyKeyData,
  CompanyKeyDataFields,
} from '../../../types/company/companyData';
import NewCompanyValidationErrorForm from "./NewCompanyValidationErrorForm";
import {userStorage} from "../../../util/localStorage/userStorage";
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";
import {ModuleCodes} from "../../../types/general/generalEnums";

enum NewCompanyAfipDataFields {
  CUIT = 'cuit',
}

type NewCompanyAfipDataData = {
  [NewCompanyAfipDataFields.CUIT]: string;
};

interface NewCompanyAfipDataProps {
  onSubmitted?: (companyKeyData: CompanyKeyData) => void;
  marketRegister?: boolean;
  canSyncOwnCuit?: boolean;
  onHideTitle?: () => void;
  handleWithoutForm?: () => void,
  handleBackForm?: () => void,
  creation?: boolean;
}

enum CuitProcess {
  InitialCharge = 1,
  AlreadyExists = 2,
  AlreadyValidated = 3,
}

function NewCompanyAfipData({
  onSubmitted,
  marketRegister = false,
  canSyncOwnCuit = true,
  onHideTitle,
  handleWithoutForm,
  handleBackForm,
  creation = true
}: NewCompanyAfipDataProps) {
  const [error, setError] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserModelView>();
  const [showForm, setShowForm] = useState<boolean>(false)
  const [errorValidate, setErrorValidate] = useState<boolean>(false)
  const [cuit, setCuit] = useState<string>()
  const [cuitProcess, setCuitProcess] = useState<CuitProcess>(
    CuitProcess.InitialCharge,
  );
  const [companyId, setCompanyId] = useState<number>();
  const [personTypeCode, setPersonTypeCode] = useState<number>();
  const { onCloseDrawer } = useContext(NewCompanyContext);

  const newCompanySchema = yup.object().shape({
    [NewCompanyAfipDataFields.CUIT]: RequiredCuitSchema,
  });

  useEffect(() => {
    if (canSyncOwnCuit)
      HttpUser.getUserDataLogged().then((r) => setUserDetails(r));
  }, []);

  useEffect(() => {
    if (cuitProcess === CuitProcess.InitialCharge && handleBackForm) handleBackForm()
  }, [cuitProcess]);

  useEffect(() => {
    setCuitProcess(CuitProcess.InitialCharge);
    setError(undefined);
  }, []);

  const { control, getValues, handleSubmit, reset } =
    useForm<NewCompanyAfipDataData>({
      resolver: yupResolver(newCompanySchema),
    });

  const onValidatedCompany = (
    cuit: string,
    response: PersonCompanyConsultantResponseDTO,
  ) => {
    setErrorValidate(true)
    handleWithoutForm && handleWithoutForm()
    setCuit(cuit)
    setCuitProcess(CuitProcess.AlreadyValidated);
    setCompanyId(response[PersonCompanyConsultantResponseDTOFields.CompanyId]);
    onSubmittedResponse(cuit, response, cuit === userStorage.getCuit());
    onHideTitle && onHideTitle();
  };

  const onSubmittedResponse = (
    cuit: string,
    response: PersonCompanyConsultantResponseDTO,
    isOwnExistingCompany: boolean = false,
  ) => {
    onSubmitted &&
      onSubmitted({
        [CompanyKeyDataFields.CompanyId]:
          response[PersonCompanyConsultantResponseDTOFields.CompanyId],
        [CompanyKeyDataFields.PersonId]: response[PersonCompanyConsultantResponseDTOFields.PersonId],
        [CompanyKeyDataFields.BusinessName]:
            response[PersonCompanyConsultantResponseDTOFields.FirstName] && response[PersonCompanyConsultantResponseDTOFields.LastName] ?
            `${response[PersonCompanyConsultantResponseDTOFields.FirstName]} ${response[PersonCompanyConsultantResponseDTOFields.LastName]}`
            :
            response[PersonCompanyConsultantResponseDTOFields.CompanyBusinessName]
        ,
        [CompanyKeyDataFields.CUIT]: cuit,
        [CompanyKeyDataFields.PersonTypeCode]:
          response[PersonCompanyConsultantResponseDTOFields.PersonTypeCod],
        [CompanyKeyDataFields.ValidationStateCode]:
          response[PersonCompanyConsultantResponseDTOFields.ValidationStateCod],
        [CompanyKeyDataFields.IsOwnExistingCompany]: isOwnExistingCompany,
        [CompanyKeyDataFields.ActiveCompany]: response[PersonCompanyConsultantResponseDTOFields.ActiveCompany]
      });
  };

  const onInvalidResponse = (response: PersonCompanyConsultantResponseDTO) => {
    const companyCuit = getValues(NewCompanyAfipDataFields.CUIT);
    const errorMessage = !response[
      PersonCompanyConsultantResponseDTOFields.HasTaxActivity
    ]
      ? `El CUIT ${companyCuit} no se encuentra activo en ${PublicEntityEnums.ARCA} en este momento por lo que no es posible dar de alta la cuenta.`
      : `Hubo un problema con el CUIT: ${companyCuit}. ${response[PersonCompanyConsultantResponseDTOFields.DescriptionState]}`;

    setError(errorMessage);
  };

  const onSubmit = (data: NewCompanyAfipDataData) => {
    setError(undefined)
    setErrorValidate(false)

    let cuit: string = data[NewCompanyAfipDataFields.CUIT],
      businessName: string = '',
      codModule: number = ModuleCodes.CompanyRegistration;

    //if (cuit === userDetails?.[UserModelViewFields.CUIT]) setError('No se permite cargar el mismo CUIT que el usuario como empresa.')
    //else {
    setLoading(true);
    HttpPersonNosis.synchronizeCompany(cuit, businessName, codModule)
      .then((response) => {
        setLoading(false);
        if (response[PersonCompanyConsultantResponseDTOFields.Valid]) {
          setPersonTypeCode(
            response[PersonCompanyConsultantResponseDTOFields.PersonTypeCod],
          );
          if (
            response[PersonCompanyConsultantResponseDTOFields.ExistingCompany]
          ) {
            switch (
              response[
                PersonCompanyConsultantResponseDTOFields.ValidationStateCod
              ]
            ) {
              case ValidationStatesType.PendingValidation:
              case ValidationStatesType.Validated:
                onValidatedCompany(cuit, response);
                break;

              case ValidationStatesType.LoadProcess:
              case ValidationStatesType.Returned:
              case ValidationStatesType.CreatedWithoutConfirmation:
                const isOwnExistingCompany = cuit === userStorage.getCuit();
                onSubmittedResponse(cuit, response, isOwnExistingCompany);
                break;
            }
          } else {
            onSubmittedResponse(cuit, response);
          }
        } else {
          onInvalidResponse(response);
        }
      })
      .catch(() => {
        setLoading(false);
        setError(
          'Al parecer ha ocurrido un error, por favor intente nuevamente.',
        );
      });
    //}
  };

  const renderInitialForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} id={"company-afip-form"}>
        {marketRegister ? (
          <Stack spacing={2}>
            {error && (
              <Grid item xs={12}>
                <Alert severity={'error'}>{error}</Alert>
              </Grid>
            )}
              {/*!error && <DisclaimerNosis />*/}
              <ControlledTextFieldFilled
                control={control}
                placeholder="Ingresá los 11 dígitos"
                label={creation ? "CUIT de la PyME con la cual querés operar" : "CUIT de la PyME a la que te querés unir"}
                name={NewCompanyAfipDataFields.CUIT}
                fullWidth
              />
          </Stack>
        ) : (
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            mt={2}
          >
            {error && <Alert severity={'error'}>{error}</Alert>}

            {/*!error && <DisclaimerNosis />*/}

            <ControlledTextFieldFilled
              control={control}
              label={creation ? "CUIT de la PyME con la cual querés operar" : "CUIT de la PyME a la que te querés unir"}
              placeholder="Ingresá los 11 dígitos"
              name={NewCompanyAfipDataFields.CUIT}
              fullWidth
            />
          </Stack>
        )}
      </form>
    );
  };

  const renderAlreadyExistsForm = () => {
    return (
      <Stack spacing={2}>
        {error && (
          <Grid item xs={12}>
            <Alert severity={'error'}>{error}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack direction={'row'} textAlign={'center'}>
            <UpdateButton
              onClick={() => {
                setCuitProcess(CuitProcess.InitialCharge);
                setError(undefined);
                onHideTitle && onHideTitle();
              }}
              color={'inherit'}
            >
              Cargar otro CUIT
            </UpdateButton>
          </Stack>
        </Grid>
      </Stack>
    );
  };

  const onChargeAnotherCuit = () => {
    setCuitProcess(CuitProcess.InitialCharge);
    setError(undefined);
    reset();
    onHideTitle && onHideTitle();
  };

  const renderAlreadyValidated = () => {
    return (
      <Stack spacing={2}>
          <Grid item xs={12}>
            {errorValidate && !showForm &&
                <Alert severity={'error'}>
                  <Typography fontSize={13} flexWrap={'wrap'}>
                    {`La cuenta MiPyME con CUIT: ${cuit} existe en LUC y tiene un responsable verificado.
                    Si se trata de un error`}
                    <Link underline='none' onClick={() => setShowForm(true)}> hacé click acá</Link>
                  </Typography>
                </Alert>
            }
          </Grid>

        {showForm ?
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Alert severity={'info'}>Completa el siguiente formulario para contactarnos con vos</Alert>
                <NewCompanyValidationErrorForm onBack={() => {
                  setShowForm(false)
                }}
                 afterSubmit={() => {
                    setShowForm(false)
                    setErrorValidate(false)
                    onCloseDrawer()
                  }}
                />
              </Stack>
            </Grid>
            :
            <React.Fragment>
              <Grid item xs={12}>
                <Typography fontSize={16} color={'grey.600'}>
                  Si querés solicitar permiso al responsable para acceder completá este formulario
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CompanyAlreadyValidatedForm
                  companyId={companyId}
                  personTypeCode={personTypeCode}
                  onSubmitNewRole={onCloseDrawer}
                  onChargeAnotherCuit={onChargeAnotherCuit}
                />
              </Grid>
            </React.Fragment>
        }
        
      </Stack>
    );
  };

  const renderProcess = () => {
    switch (cuitProcess) {
      case CuitProcess.InitialCharge:
        return renderInitialForm();
      case CuitProcess.AlreadyExists:
        return renderAlreadyExistsForm();
      case CuitProcess.AlreadyValidated:
        return renderAlreadyValidated();
      default:
        return renderInitialForm();
    }
  };

  return (
    <>
      {renderProcess()}
      {isLoading && (
        <LoaderBlockUI message="Sincronizando, esto puede demorar un momento..." />
      )}
    </>
  );
}

export default NewCompanyAfipData;
