import CryptoJS from 'crypto-js';

import {
  AuthorizationOffererRequestFields,
  AuthorizationRequest,
  AuthorizationRequestFields,
  AuthorizationResponse,
  ChangePasswordRequestFields,
  ForgotMailRequestFields,
  ForgotMailResponse, ForgotPasswordRequest,
  PinGenerationRequest,
  PinValidationRequest,
  PinValidationResponse,
  ResetPasswordRequestFields,
} from 'types/user';
import { BaseRequestFields, BaseResponse } from 'types/baseEntities';
import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  ConfigurationEconde,
  configurationEncoder,
} from 'util/configurations/configurationEncode';
import { CryptoJSHelper } from '../../util/helpers';

const encryptPassword = (
  encoder: ConfigurationEconde,
  password: string,
): string =>
  CryptoJS.AES.encrypt(
    password,
    CryptoJS.enc.Utf8.parse(encoder.key.substring(0, encoder.keyLength)),
    {
      iv: CryptoJS.enc.Utf8.parse(encoder.iv.substring(0, encoder.ivLength)),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString();

export const HttpAuth = {
  getEndpoint: (url: string): string => `auth${url}`,

  authenticateUser: async (
    requestParams: AuthorizationRequest,
  ): Promise<AuthorizationResponse> => {
    let encoder: ConfigurationEconde =
      await configurationEncoder.getConfiguration();

    let encryptPassword: string = CryptoJS.AES.encrypt(
      requestParams.password,
      CryptoJS.enc.Utf8.parse(encoder.key.substring(0, encoder.keyLength)),
      {
        iv: CryptoJS.enc.Utf8.parse(encoder.iv.substring(0, encoder.ivLength)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    ).toString();

    return HttpAxiosRequest.post(HttpAuth.getEndpoint(''), {
      [AuthorizationRequestFields.Mail]: requestParams.mail,
      [AuthorizationRequestFields.ClientIp]: requestParams.ipClient,
      [AuthorizationRequestFields.Password]: encryptPassword,
      [AuthorizationRequestFields.CaptchaToken]: requestParams.captcha
    });
  },

  authenticateOffererUser: async (
      requestParams: AuthorizationRequest,
      offererSlug: string = ''
  ): Promise<AuthorizationResponse> => {
    let encoder: ConfigurationEconde =
        await configurationEncoder.getConfiguration();

    let encryptPassword: string = CryptoJSHelper.encrypt(encoder, requestParams.password);

    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/oferentes'), {
      [AuthorizationRequestFields.Mail]: requestParams.mail,
      [AuthorizationRequestFields.ClientIp]: requestParams.ipClient,
      [AuthorizationRequestFields.Password]: encryptPassword,
      [AuthorizationOffererRequestFields.OffererSlug]: offererSlug,
      [AuthorizationRequestFields.CaptchaToken]: requestParams.captcha
    });
  },

  authenticateQuaUser: async (
      requestParams: AuthorizationRequest
  ): Promise<AuthorizationResponse> => {
    let encoder: ConfigurationEconde =
        await configurationEncoder.getConfiguration();

    let encryptPassword: string = CryptoJSHelper.encrypt(encoder, requestParams.password);

    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/qua'), {
      [AuthorizationRequestFields.Mail]: requestParams.mail,
      [AuthorizationRequestFields.ClientIp]: requestParams.ipClient,
      [AuthorizationRequestFields.Password]: encryptPassword,
      [AuthorizationRequestFields.CaptchaToken]: requestParams.captcha
    });
  },

  passwordRecovery: (data: ForgotPasswordRequest) => {
    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/olvide-contrasena'), data);
  },

  resetPassword: async (identifierWeb: string, password: string) => {
    let encoder: ConfigurationEconde =
      await configurationEncoder.getConfiguration();
    let encryptPassword: string = CryptoJSHelper.encrypt(encoder, password);

    return HttpAxiosRequest.post(
      HttpAuth.getEndpoint('/confirmar-contrasena'),
      {
        [ResetPasswordRequestFields.IdentifierWeb]: identifierWeb,
        [ResetPasswordRequestFields.Password]: encryptPassword,
        [BaseRequestFields.ModuleCode]: 1,
      },
    );
  },

  mailRecovery: (userCUIT: string): Promise<ForgotMailResponse> => {
    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/olvide-mail'), {
      [ForgotMailRequestFields.CUIT]: userCUIT,
    });
  },

  mailPinValidation: (
    pinValidationRequest: PinValidationRequest,
  ): Promise<PinValidationResponse> => {
    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/pin/validar/mail'), {
      ...pinValidationRequest,
      codModulo: 1,
    });
  },

  mailPinGeneration: (pinGenerationRequest: PinGenerationRequest) => {
    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/pin/generar/mail'), {
      ...pinGenerationRequest,
      codModulo: 1,
    });
  },

  phonePinGeneration: (pinGenerationRequest: PinGenerationRequest) => {
    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/pin/generar/sms'), {
      ...pinGenerationRequest,
      codModulo: 1,
    });
  },

  phonePinValidation: (
    pinValidationRequest: PinValidationRequest,
  ): Promise<PinValidationResponse> => {
    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/pin/validar/sms'), {
      ...pinValidationRequest,
      codModulo: 1,
    });
  },

  changePassword: async (
    actualPassword: string,
    newPassword: string,
  ): Promise<BaseResponse> => {
    let encoder: ConfigurationEconde =
      await configurationEncoder.getConfiguration();

    let encryptActualPassword: string = encryptPassword(
      encoder,
      actualPassword,
    );
    let encryptNewPassword: string = encryptPassword(encoder, newPassword);

    return HttpAxiosRequest.post(HttpAuth.getEndpoint('/cambiar-contrasena'), {
      [ChangePasswordRequestFields.ActualPassword]: encryptActualPassword,
      [ChangePasswordRequestFields.NewPassword]: encryptNewPassword,
      [BaseRequestFields.ModuleCode]: 1,
      [BaseRequestFields.OriginCode]: 1,
    });
  },

  ping: (): Promise<void> => {
    return HttpAxiosRequest.get(HttpAuth.getEndpoint('/ping'));
  },
};
