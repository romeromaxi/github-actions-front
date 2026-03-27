import {
  AuthorizationResponse, EvaluationQueryResult,
  LinkPersonToUserRequest,
  NewUserRequest,
  NewUserRequestFields,
  NewUserResponse,
  UpdateUserMailRequest,
  UpdateUserPhoneRequest,
  UserConfirmations, UserEvaluateIdentityPublicBases,
  UserInfoSummaryView,
  UserInvitationActivationRequestFields,
  UserModelView,
  UserResponseInvitation,
  UserValidateIdentity, UserValidateIdentityPublicBases,
  UserValidateIdentityRequest,
  UserValidateIdentityRequestFields, ValidationQueryResult,
} from 'types/user';
import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  ConfigurationEconde,
  configurationEncoder,
} from 'util/configurations/configurationEncode';
import CryptoJS from 'crypto-js';
import { Role } from 'types/company/rolesData';
import { BaseRequestFields, BaseResponse } from '../../types/baseEntities';
import { CryptoJSHelper } from '../../util/helpers';
import { CompanyUserInvitation } from '../../types/user/userInvitation';
import {NosisResponse, PersonUpdateValidateState, PersonValidationData} from '../../types/person/personData';
import { Document } from '../../types/files/filesData';

export const HttpUser = {
  getEndpoint: (url: string): string => `/usuarios${url}`,

  newUser: async (newUserRequest: NewUserRequest): Promise<NewUserResponse> => {
    const encoder: ConfigurationEconde =
      await configurationEncoder.getConfiguration();

    const encryptedPassword: string = CryptoJS.AES.encrypt(
      newUserRequest[NewUserRequestFields.Password],
      CryptoJS.enc.Utf8.parse(encoder.key.substring(0, encoder.keyLength)),
      {
        iv: CryptoJS.enc.Utf8.parse(encoder.iv.substring(0, encoder.ivLength)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    ).toString();

    return HttpAxiosRequest.post(HttpUser.getEndpoint(''), {
      ...newUserRequest,
      [NewUserRequestFields.Password]: encryptedPassword,
      codModulo: 1,
    });
  },

  updatePerson: (linkRequest: LinkPersonToUserRequest): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(HttpUser.getEndpoint('/personas'), linkRequest);
  },

  validatePerson: (): Promise<any> => {
    return HttpAxiosRequest.post(HttpUser.getEndpoint('/personas/validar'), {});
  },

  getValidateIdentity: (): Promise<UserValidateIdentity> => {
    return HttpAxiosRequest.get(HttpUser.getEndpoint('/identidad/validar'));
  },

  postValidateIdentity: (
    validateIdentity: UserValidateIdentityRequest,
  ): Promise<BaseResponse> => {
    let formData: FormData = new FormData();
    const fileFront =
      validateIdentity[UserValidateIdentityRequestFields.DocumentFront][0];
    const fileBack =
      validateIdentity[UserValidateIdentityRequestFields.DocumentBack][0];

    formData.append(
      UserValidateIdentityRequestFields.DocumentTypeCode,
      validateIdentity[
        UserValidateIdentityRequestFields.DocumentTypeCode
      ].toString(),
    );
    formData.append(
      UserValidateIdentityRequestFields.GenderCode,
      validateIdentity[
        UserValidateIdentityRequestFields.DocumentTypeCode
      ].toString(),
    );
    formData.append(
      UserValidateIdentityRequestFields.DocumentFront,
      fileFront,
      fileFront.name,
    );
    formData.append(
      UserValidateIdentityRequestFields.DocumentBack,
      fileBack,
      fileBack.name,
    );
    formData.append(BaseRequestFields.ModuleCode, '1');
    formData.append(BaseRequestFields.OriginCode, '1');

    return HttpAxiosRequest.post(
      HttpUser.getEndpoint('/identidad/validar'),
      formData,
    );
  },

  getIdentityValidationDocuments: (userId: number): Promise<Document[]> =>
    HttpAxiosRequest.get(
      HttpUser.getEndpoint(`/identidad/validar/${userId}/archivos`),
    ),
  
  validateIdentityNosis: (data: UserValidateIdentityPublicBases) : Promise<ValidationQueryResult> => {
    return HttpAxiosRequest.post(
        HttpUser.getEndpoint(`/identidad/validar/bases-publicas`),
        data
    )  
  },
  
  evaluateIdentityQueryNosis: (data: UserEvaluateIdentityPublicBases) : Promise<EvaluationQueryResult> => {
    return HttpAxiosRequest.post(
        HttpUser.getEndpoint(`/identidad/validar/bases-publicas/evaluaciones`),
        data
    )
  },
  
  addMail: (request: UpdateUserMailRequest): Promise<any> => {
    return HttpAxiosRequest.put(HttpUser.getEndpoint('/mails'), request);
  },

  addPhone: (request: UpdateUserPhoneRequest): Promise<any> => {
    return HttpAxiosRequest.put(HttpUser.getEndpoint('/telefonos'), request);
  },

  getUserDataLogged: (): Promise<UserModelView> => {
    return HttpAxiosRequest.get(HttpUser.getEndpoint('/detalles'));
  },

  getUserRoles: (): Promise<Role[]> => {
    return HttpAxiosRequest.get(HttpUser.getEndpoint('/roles'));
  },

  getUserConfirmation: (mail: string): Promise<UserConfirmations> =>
    HttpAxiosRequest.getWithQueryParams(
      HttpUser.getEndpoint('/confirmaciones'),
      { mail: mail },
    ),

  completeRegistration: (
    userId: number,
    allowNotifications: boolean,
  ): Promise<BaseResponse> =>
    HttpAxiosRequest.post(HttpUser.getEndpoint('/confirmaciones'), {
      idUsuario: userId,
      permiteNotificacionesMail: allowNotifications,
    }),

  userInvitationByIdentifierWeb: (
    identifierWeb: string,
  ): Promise<UserResponseInvitation> =>
    HttpAxiosRequest.post(HttpUser.getEndpoint('/invitaciones'), {
      guid: identifierWeb,
      codOrigen: 1,
      codModulo: 1,
    }),

  getInvitationByIdentifierWeb: (
    identifierWeb: string,
  ): Promise<CompanyUserInvitation> =>
    HttpAxiosRequest.get(
      HttpUser.getEndpoint(`/invitaciones/${identifierWeb}`),
    ),

  userInvitationActivation: async (
    identifierWeb: string,
    personId: number,
    password: string,
  ): Promise<AuthorizationResponse> => {
    const encoder: ConfigurationEconde =
      await configurationEncoder.getConfiguration();

    const passwordEncrypt = CryptoJSHelper.encrypt(encoder, password);

    return HttpAxiosRequest.post(
      HttpUser.getEndpoint('/invitaciones/validar'),
      {
        [UserInvitationActivationRequestFields.IdentifierWeb]: identifierWeb,
        [UserInvitationActivationRequestFields.PersonId]: personId,
        [UserInvitationActivationRequestFields.Password]: passwordEncrypt,
        [BaseRequestFields.OriginCode]: 1,
        [BaseRequestFields.ModuleCode]: 1,
      },
    );
  },

  getUserSummary: (): Promise<UserInfoSummaryView> => {
    return HttpAxiosRequest.get(HttpUser.getEndpoint('/resumen'));
  },

  updateState: (
    userId: number,
    data: PersonUpdateValidateState,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpUser.getEndpoint(`/${userId}/estado`), {
      ...data,
      [BaseRequestFields.ModuleCode]: 1,
      [BaseRequestFields.OriginCode]: 1,
    });
  },
  
  insertNotifications: (
      allowMailNotifications: boolean
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
        HttpUser.getEndpoint('/notificaciones'),
        {
          permiteNotificacionesMail: allowMailNotifications
        }
    )
  },
  
  recoverPassword: (
      userId: number
  ) : Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
        HttpUser.getEndpoint(`/${userId}/restablecer-contrasenia`),
        {}
    )
  },
  
  userCredentialsValidation: (data: PersonValidationData) : Promise<NosisResponse> => 
      HttpAxiosRequest.post(
          HttpUser.getEndpoint('/validaciones'),
          data
      ),
    
  skipFirstLogin: () : Promise<BaseResponse> => 
      HttpAxiosRequest.post(
          HttpUser.getEndpoint('/primer-ingreso'),
          {}
      )
};
