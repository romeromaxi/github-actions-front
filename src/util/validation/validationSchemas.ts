import * as yup from 'yup';
import { stringFormatter } from '../formatters/stringFormatter';

export const REQUIRED_FIELD_MESSAGE = 'Campo obligatorio';
const TYPE_ERROR_MESSAGE = 'Dato inválido';
export const DATE_OUT_OF_RANGE_MESSAGE = 'Fecha inválida';
const PERCENTAGE_NOT_ZERO_MESSAGE = 'El porcentaje debe ser mayor al 0 %';
const PERCENTAGE_OUT_OF_RANGE_MESSAGE =
  'El porcentaje no puede superar al 100 %';
const INVALID_FORMAT_MESSAGE = 'Formato inválido';
const EARLIER_YEAR_ERROR_MESSAGE = 'La fecha no puede ser inferior a 1900';
const PASSWORD_POLICIES =
  'La contraseña ingresada no respeta los criterios de contraseña';
const fullPhoneRegex =
  /^((\+\d{1,3}([- ])?\(?\d\)?([- ])?\d{1,3})|(\(?\d{2,3}\)?))([- ])?(\d{3,4})([- ])?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
// const noAreaCodePhoneRegex = /^([- ])?(\d{3,4})([- ])?(\d{4})(( x| ext)\d{1,5}){0,1}$/
const noAreaCodePhoneRegex = /^[0-9]*$/;
// const areaCodeRegex = /^((\+\d{1,3}([- ])?\(?\d\)?([- ])?\d{1,3})|(\(?\d{2,3}\)?))$/
const areaCodeRegex = /^[0-9]*$/;

export const RequiredSchema = yup.mixed().required(REQUIRED_FIELD_MESSAGE);

export const RequiredStringSchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .min(1, REQUIRED_FIELD_MESSAGE);
export const RequiredNotEmptyStringSchema = yup
  .string()
  .trim()
  .typeError(REQUIRED_FIELD_MESSAGE)
  .required(REQUIRED_FIELD_MESSAGE);

export const RequiredCaptchaSchema = yup
    .string()
    .required(REQUIRED_FIELD_MESSAGE)
    .min(1, REQUIRED_FIELD_MESSAGE);

export const RequiredPositiveNumberSchema = yup
  .number()
  .typeError(TYPE_ERROR_MESSAGE)
  .required(REQUIRED_FIELD_MESSAGE)
  .moreThan(999, INVALID_FORMAT_MESSAGE)
  .max(9999, INVALID_FORMAT_MESSAGE);

export const RequiredPercentSchema = yup
  .number()
  .typeError(REQUIRED_FIELD_MESSAGE)
  .required(REQUIRED_FIELD_MESSAGE)
  .positive(PERCENTAGE_NOT_ZERO_MESSAGE)
  .moreThan(0, PERCENTAGE_NOT_ZERO_MESSAGE)
  .max(100, PERCENTAGE_OUT_OF_RANGE_MESSAGE);

export const RequiredCuitSchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .matches(/^[0-9]+$/, 'CUIT inválido')
  .min(11, 'Deben ser 11 dígitos')
  .max(11, 'Deben ser 11 dígitos')
  .test('cuit', 'CUIT inválido', (cuit) => {
    if (!cuit) return false;
    return stringFormatter.isValidCuit(cuit);
  });

export const NotRequiredCuitSchema = yup
  .string()
  .matches(/^[0-9]+$/, 'CUIT inválido')
  .min(11, 'Deben ser 11 dígitos')
  .max(11, 'Deben ser 11 dígitos')
  .test('cuit', 'CUIT inválido', (cuit) => {
    if (!cuit) return false;
    return stringFormatter.isValidCuit(cuit);
  });

export const RequiredMailSchema = yup
  .string()
  .trim()
  .required(REQUIRED_FIELD_MESSAGE)
  .email('Formato de mail incorrecto');
export const MailSchema = yup.string().trim().email('Formato de mail incorrecto');

export const RequiredPhoneSchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .matches(noAreaCodePhoneRegex, 'Verifique teléfono');
export const PhoneSchema = yup
  .string()
  .matches(noAreaCodePhoneRegex, 'Verifique teléfono');
export const RequiredAreaCodeSchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .matches(areaCodeRegex, 'Verifique código de área')
  .matches(/^[1-9][0-9]*$/, 'El código de área no puede comenzar con 0');

export const AreaCodeSchema = yup
  .string()
  .matches(areaCodeRegex, 'Verifique código de área');

export const RequiredWebSchema = yup
  .string()
  .matches(
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
    'Verifique formato URL',
  );
export const NotRequiredWebSchema = (field: string) =>
  yup
    .string()
    .notRequired()
    .nullable()
    .when(field, {
      is: (value: string) => value,
      then: (rule) =>
        rule.matches(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[ñÑa-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          'Verifique formato URL',
        ),
    });

export const RequiredSingleFileSchema = yup
  .mixed()
  .test('required', 'Campo obligatorio', (file) => {
    return !!file;
  })
  .test('fileSize', 'El archivo es demasiado grande', (file) => {
    return file && file.size <= 20000000;
  });

export const RequiredFileSchema = yup
  .mixed()
  .test('required', 'Campo obligatorio', (file) => {
    return Array.isArray(file) ? !!file.length : !!file;
  });

export const RequiredSelectSchema = yup
  .number()
  .integer(REQUIRED_FIELD_MESSAGE)
  .positive(REQUIRED_FIELD_MESSAGE)
  .required(REQUIRED_FIELD_MESSAGE);

export const RequiredMultipleSelectSchema = yup
  .array()
  .min(1, REQUIRED_FIELD_MESSAGE)
  .of(yup.number().required(REQUIRED_FIELD_MESSAGE))
  .required(REQUIRED_FIELD_MESSAGE);

export const RequiredPinSchema = yup
  .string()
  .min(4, 'PIN incompleto')
  .max(4, 'PIN incompleto')
  .required(REQUIRED_FIELD_MESSAGE);

export const RequiredNumberSchema = yup
  .number()
  .required(REQUIRED_FIELD_MESSAGE)
  .typeError(TYPE_ERROR_MESSAGE)
  .required(REQUIRED_FIELD_MESSAGE);

export const NotRequiredNumberSchema = yup.lazy((value) =>
  value === '' ? yup.string() : yup.number().typeError(TYPE_ERROR_MESSAGE),
);

export const RequiredDayMonthSchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .matches(/([1-9]|[0-3][0-9])\/([0-1][0-9]|[1-9])/g, TYPE_ERROR_MESSAGE)
  .test('date', TYPE_ERROR_MESSAGE, (date) => {
    let [day, month] = (date?.split('/') || ['0', '0']).map((x) => parseInt(x));

    return day >= 1 && day <= 31 && month >= 1 && month <= 12;
  });

export const RequiredDaySchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .test('day', TYPE_ERROR_MESSAGE, (day) => {
    const dayParsed = day && parseInt(day);
    if (!dayParsed) return false;
    else return dayParsed >= 1 && dayParsed <= 31;
  });

export const RequiredMonthSchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .test('month', TYPE_ERROR_MESSAGE, (month) => {
    if (!month) return false;
      
    const monthParsed = parseInt(month.replace(/\./g, ''));
    if (!monthParsed) return false;
    else return monthParsed >= 1 && monthParsed <= 12;
  });
export const RequiredPasswordSchema = yup
  .string()
  .required(REQUIRED_FIELD_MESSAGE)
  .test('policies', PASSWORD_POLICIES, (password) => {
    const regexUpper = /^(?=.*[A-Z]).*$/;
    const regexLower = /^(?=.*[a-z]).*$/;
    const regexNumber = /^(?=.*\d).*$/;
    const regexSpecial = /^(?=.*[!-?+$%_/~()=#{}@^*]).*$/;

    if (
      password &&
      password.length >= 8 &&
      regexUpper.test(password) &&
      regexLower.test(password) &&
      regexNumber.test(password) &&
      regexSpecial.test(password)
    )
      return true;

    return false;
  });

export const RequiredDateSchema = yup
  .date()
  .required(REQUIRED_FIELD_MESSAGE)
  .typeError(REQUIRED_FIELD_MESSAGE);

export const RequiredDateRangeSchema = (min: Date, max: Date) =>
  yup
    .date()
    .required(REQUIRED_FIELD_MESSAGE)
    .typeError(REQUIRED_FIELD_MESSAGE)
    .min(min, DATE_OUT_OF_RANGE_MESSAGE)
    .max(max, DATE_OUT_OF_RANGE_MESSAGE);
