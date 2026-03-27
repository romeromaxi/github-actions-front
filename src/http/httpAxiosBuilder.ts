import qs from 'qs';
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError, AxiosRequestConfig
} from 'axios';
import { authTokenStorage } from '../util/localStorage/authTokenStorage';
import {
  FileBlobResponseFields,
} from '../types/files/filesData';
import {store} from "../stores";
import {snackbarWarning} from "../stores/action-creators/snackbarActionCreator";
import { reloadProfile } from '../stores/action-creators/profileActionCreator';
import {LoggerService, LogLevels} from './logger/httpLogger';

const CONTENT_DISPOSITION_REGEX = /filename=((['"]).*?\2|[^;\n]*)/g;
const URL_REFRESH_TOKENS = `${window.API_PROTOCOL}://${window.API_DOMAIN}/api/${window.API_VERSION}/auth/refresh-tokens`;
const API_TIMEOUT_REFRESH_TOKENS = window.API_TIMEOUT;

let axiosInstanceHeaders: any;
let tokenAutorizacion: string | null = authTokenStorage.getAccessToken();
if (tokenAutorizacion != null) {
  axiosInstanceHeaders = {
    common: { Authorization: 'Bearer ' + tokenAutorizacion },
  };
}

let axiosInstanceRefreshHeaders: any;
let tokenRefreshAutorizacion: string | null = authTokenStorage.getRefreshToken();
if (tokenRefreshAutorizacion != null) {
  axiosInstanceRefreshHeaders = {
    common: { Authorization: 'Bearer ' + tokenRefreshAutorizacion },
  };
}

const getParamsSerializer = (params: any): string => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

const getResponseBody = (response: AxiosResponse) => {
  return response.data;
};

const getResponseBlobBody = (response: AxiosResponse) => {
  const matches = response.headers['content-disposition'].match(
    CONTENT_DISPOSITION_REGEX,
  );
  const fileName = matches ? matches[0].replace('filename=', '') : '';

  return {
    [FileBlobResponseFields.File]: response.data,
    [FileBlobResponseFields.FileName]: fileName,
  };
};

const responseLogOut = () => {
  const { userStorage } = require('../util/localStorage/userStorage');
  userStorage.removeFromStorage();
  window.location.href = '/';
};

const showSlowInternetRetryAlert = (): void => {
  store.dispatch(snackbarWarning('Al parecer su conexión a internet es intermitente, estamos reintentando...') as any);
};

export const HttpAxiosBuilder = (axiosInstance: AxiosInstance) => {

  const getWithRetries = async (url: string, config: any, retries: number = 1): Promise<any> => {
    try {
      const response = await axiosInstance.get(url, config);
      return getResponseBody(response);
    } catch (error) {
      if (retries > 0 && error.code === 'ECONNABORTED') {
        showSlowInternetRetryAlert();
        return getWithRetries(url, config, retries - 1);
      }
      throw error;
    }
  };

  const getBlobWithRetries = async (url: string, config: any, retries: number = 1): Promise<any> => {
    try {
      const response = await axiosInstance.get(url, config);
      return getResponseBlobBody(response);
    } catch (error) {
      if (retries > 0 && error.code === 'ECONNABORTED') {
        showSlowInternetRetryAlert();
        return getBlobWithRetries(url, config, retries - 1);
      }
      throw error;
    }
  };

  const responseBodyRefreshToken = (response: AxiosResponse, originalRequest: AxiosRequestConfig) => {
    if (response.status >= 200 && response.status < 300){
      const newAccessToken: string = response.data;
      const newBearerToken: string = `Bearer ${newAccessToken}`;
      axiosInstanceHeaders = {
        common: { Authorization: newBearerToken },
      };
      axiosInstance.defaults.headers = axiosInstanceHeaders;

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: newBearerToken
      }
      
      const { authTokenStorage } = require('../util/localStorage/authTokenStorage');
      authTokenStorage.updateAccessToken(newAccessToken);
      
      store.dispatch(reloadProfile(true) as any)
      
      return axiosInstance(originalRequest)
          .then(getResponseBody)
          .catch((error) => Promise.reject(error.response?.data))
    }

    return responseLogOut();
  };

  function isClientOrServerError(status?: number): boolean {
    if (status === undefined) return false;
    return (status >= 400 && status < 600 && status !== 401);
  }

  function formDataToObject(formData: FormData): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }
  
  const getError = async (error: AxiosError) => {
    const statusResponseCode = error.response?.status;
    
    if (isClientOrServerError(statusResponseCode)) {
      try {
        const errorConfig = error.config;
        
        const bodyRaw = errorConfig?.data;
        let body;
        try {
          if (bodyRaw instanceof FormData) {
            body = formDataToObject(bodyRaw);
          } else {
            body = JSON.parse(bodyRaw);
          } 
        } catch {
          body = bodyRaw;
        }

        const responseBodyRaw = error.response?.data;
        let responseBody;
        try {
          responseBody = JSON.parse(responseBodyRaw);
        } catch {
          responseBody = responseBodyRaw;
        }
        
        const fullUrl = error.config?.url ?? '';
        const baseURL = error.config?.baseURL ?? '';
        const params = error.config?.params ?? {};

        let endpoint = '';
        try {
          if (fullUrl && baseURL) {
            const url = new URL(fullUrl, baseURL);
            endpoint = url.toString();
          } else {
            endpoint = fullUrl || baseURL || '';
          }
        } catch {
          endpoint = fullUrl || baseURL || '';
        }
        
        let queryParams = '';
        try {
          if (!!params)
            queryParams = new URLSearchParams(params as Record<string, string>).toString();
        } catch (_) {}
        
        await LoggerService.log({
          level: LogLevels.Error,
          detail: `Error en request: ${error.message}`,
          endpoint: `${endpoint}`,
          queryParams: queryParams,
          location: window.location.toString(),
          statusCode: `${statusResponseCode}`,
          body: body,
          response: responseBody,
        });
      } catch (_) { }
      
    } else if (statusResponseCode === 401) {
      if (axiosInstanceRefreshHeaders) {
        try {
          const originalRequest = error.config as AxiosRequestConfig;
          let response = await axios.post(
              URL_REFRESH_TOKENS, { }, {
                headers: axiosInstanceRefreshHeaders.common,
                timeout: API_TIMEOUT_REFRESH_TOKENS
              }
          );

          return responseBodyRefreshToken(response, originalRequest);
        } catch (e) {
          return responseLogOut();
        }
      } else {
        return responseLogOut();
      }
    }

    return Promise.reject(error.response?.data);
  };

  return {
    get: async (url: string) =>
      getWithRetries(url, {}).catch(getError),

    getBlob: async (url: string) =>
      getBlobWithRetries(url, { responseType: 'blob' }).catch(getError),

    getBlobWithQueryParamsSerializer: async (url: string, params: {}) =>
      axiosInstance
        .get(url, {
          responseType: 'blob',
          params: params,
          paramsSerializer: getParamsSerializer,
        })
        .then(getResponseBlobBody)
        .catch(getError),

    getWithQueryParams: async (url: string, params: {}) =>
      axiosInstance
        .get(url, { params: params })
        .then(getResponseBody)
        .catch(getError),

    getWithQueryParamsSerializer: async (url: string, params: {}) =>
      axiosInstance
        .get(url, {
          params: params,
          paramsSerializer: getParamsSerializer,
        })
        .then(getResponseBody)
        .catch(getError),

    post: async (url: string, body: {}, options: {} = {}) =>
      axiosInstance.post(url, body, options).then(getResponseBody).catch(getError),

    postFormData: async (url: string, formData: FormData, options: {} = {}) =>
      axiosInstance.post(url, formData, {
        ...options,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
    }).then(getResponseBody).catch(getError),

    put: async (url: string, body: {}) =>
      axiosInstance.put(url, body).then(getResponseBody).catch(getError),

    delete: async (url: string) =>
      axiosInstance.delete(url).then(getResponseBody).catch(getError),

    deleteWithBody: async (url: string, body: {}) =>
      axiosInstance
        .delete(url, { data: body })
        .then(getResponseBody)
        .catch(getError),

    patch: async (url: string, body: {}) =>
      axiosInstance
        .patch(url, body)
        .then(getResponseBody)
        .catch(getError),

    refreshToken(newAccessToken: string, newRefreshToken: string) {
      axiosInstanceHeaders = {
        common: { Authorization: 'Bearer ' + newAccessToken },
      };
      axiosInstance.defaults.headers = axiosInstanceHeaders;

      axiosInstanceRefreshHeaders = {
        common: { Authorization: 'Bearer ' + newRefreshToken },
      };
    },
  };
};