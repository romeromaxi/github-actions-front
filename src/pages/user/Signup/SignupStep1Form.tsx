import {Button, Link, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import {ControlledTextFieldFilled} from 'components/forms';
import {ControlledReCaptcha} from 'components/forms/ControlledReCaptcha';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useSnackbarActions} from 'hooks/useSnackbarActions';
import {useLoaderActions} from 'hooks/useLoaderActions';
import {useNavigate} from 'react-router-dom';
import {TypographyBase} from '../../../components/misc/TypographyBase';
import {PersonValidationDataFields, NosisResponseFields} from "../../../types/person/personData";
import {
    RequiredCaptchaSchema,
    RequiredCuitSchema,
    RequiredMailSchema,
} from "../../../util/validation/validationSchemas";
import {useState} from "react";
import {ModuleCodes} from "../../../types/general/generalEnums";

const ButtonIdAlreadyAccount: string = "btn-ya-tengo-usuario";
const ButtonIdContinueSignup: string = "btn-continuar-registracion";

enum Step1FormDataFields {
    Mail = 'mail',
    Cuit = 'cuit',
    Captcha = 'captcha'
}

const schemaStep1 = yup.object().shape({
  [Step1FormDataFields.Mail]: RequiredMailSchema,
  [Step1FormDataFields.Cuit]: RequiredCuitSchema,
  [Step1FormDataFields.Captcha]: RequiredCaptchaSchema
});

interface Step1FormData {
    [Step1FormDataFields.Mail]: string;
    [Step1FormDataFields.Cuit]: string;
    [Step1FormDataFields.Captcha]: string;
};

interface SignupStep1FormProps {
  onSuccess: (data: Step1FormData, userData: any) => void;
}

export default function SignupStep1Form({ onSuccess }: SignupStep1FormProps) {
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const { addSnackbarError } = useSnackbarActions();
  const { showLoader, hideLoader } = useLoaderActions();
  const navigate = useNavigate();
  const [reset, resetCaptcha] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm<Step1FormData>({ resolver: yupResolver(schemaStep1) });

  const onSubmit = async (data: Step1FormData) => {
    showLoader();
    try {
      const { HttpUser } = await import('../../../http/index');
      
      const response = await HttpUser.userCredentialsValidation({
        [PersonValidationDataFields.Mail]: data.mail,
        [PersonValidationDataFields.CUIT]: data.cuit,
        [PersonValidationDataFields.ModuleCode]: ModuleCodes.UserRegistration,
        [PersonValidationDataFields.Captcha]: data.captcha
      });
      
      if (response && response[NosisResponseFields.Valid]) {
        onSuccess(data, response);
      } else {
        addSnackbarError(response[NosisResponseFields.StatusDescription]);
        setValue(Step1FormDataFields.Captcha, '');
        resetCaptcha(true);
      }
    } catch (err) {
      addSnackbarError('Captcha inválido');
      setValue(Step1FormDataFields.Captcha, '');
      resetCaptcha(true);
    } finally {
      hideLoader();
    }
  };

  return (
    <Stack spacing={4}>
      <Stack
        direction={{ xs: 'column-reverse', sm: 'row' }}
        justifyContent={'space-between'}
        width={1}
      >
        <Stack spacing={0.75}>
          <TypographyBase color="primary" fontWeight={600} variant="eyebrow2">
            INGRESÁ A LUC
          </TypographyBase>
          <Typography variant="h4" fontWeight={600}>
            Creá tu usuario en pocos pasos
          </Typography>
        </Stack>

        <Stack alignItems={'end'}>
          <Button id={ButtonIdAlreadyAccount} variant="text" size="small" onClick={() => navigate('/login')}>
            Ya tengo usuario
          </Button>
        </Stack>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <ControlledTextFieldFilled
            fullWidth
            control={control}
            name={Step1FormDataFields.Mail}
            label="Email"
            placeholder={"ejemplo@email.com"}
          />
          <Stack>
            <ControlledTextFieldFilled
              fullWidth
              control={control}
              name={Step1FormDataFields.Cuit}
              label="CUIT"
              placeholder={"Ingresá los 11 dígitos"}
            />
            <Typography fontSize={14} color={'#69716D !important'}>
              Necesitaremos este dato para validar tu identidad.{' '}
              <Link underline={'none'} color={"#164293"} fontWeight={500}>
                Tu información está segura y no será compartida con terceros.
              </Link>
            </Typography>
          </Stack>
          <Stack
            direction={mobileView ? 'column' : "row"}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <ControlledReCaptcha
              control={control}
              reset={reset}
              setReset={resetCaptcha}
              name={Step1FormDataFields.Captcha}
            />
            <Button id={ButtonIdContinueSignup} type="submit" variant="contained" color="primary" fullWidth={mobileView}>
              Continuar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
