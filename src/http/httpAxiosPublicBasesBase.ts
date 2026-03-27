import axios from 'axios';
import { authTokenStorage } from '../util/localStorage/authTokenStorage';
import { HttpAxiosBuilder } from './httpAxiosBuilder';

let axiosInstanceHeaders: any;
let tokenAutorizacion: string | null = authTokenStorage.getAccessToken();

/* Los headers usan "common" para que se aplique para todas las request. */
if (tokenAutorizacion != null) {
  axiosInstanceHeaders = {
    common: { Authorization: 'Bearer ' + tokenAutorizacion },
  };
}

/* Si se desea configurar para que consuma la api de forma local, dentro de public/configuration.js
   setear en domain localhost:44341 */
let axiosInstancePublicBases = axios.create({
  baseURL: `${window.API_PROTOCOL}://${window.API_PUBLIC_BASES_DOMAIN}/api/${window.API_VERSION}/`,
  timeout: window.API_TIMEOUT,
  headers: axiosInstanceHeaders,
});

export const HttpAxiosRequestPublicBases = HttpAxiosBuilder(
  axiosInstancePublicBases,
);
