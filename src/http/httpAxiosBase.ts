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
let axiosInstance = axios.create({
  baseURL: `${window.API_PROTOCOL}://${window.API_DOMAIN}/api/${window.API_VERSION}/`,
  timeout: window.API_TIMEOUT,
  headers: axiosInstanceHeaders,
});

export const HttpAxiosRequest = HttpAxiosBuilder(axiosInstance);

// export const HttpAxiosRequest = {
// 	get: async (url: string) => axiosInstance.get(url)
// 											.then(getResponseBody)
// 											.catch(getError),
//
// 	getBlob: async (url: string) => axiosInstance.get(url, { responseType: 'blob' })
// 												.then(getResponseBody)
// 												.catch(getError),
//
// 	getWithQueryParams: async (url: string, params : {}) => axiosInstance.get(url, { params: params})
// 																		.then(getResponseBody)
// 																		.catch(getError),
//
// 	getWithQueryParamsSerializer: async (url: string, params : {}) => axiosInstance.get(url, { params: params, paramsSerializer: getParamsSerializer})
// 																				.then(getResponseBody)
// 																				.catch(getError),
//
// 	post: async (url: string, body: {}) => axiosInstance.post(url, body)
// 														.then(getResponseBody)
// 														.catch(getError),
//
// 	put: async (url: string, body: {}) => axiosInstance.put(url, body)
// 														.then(getResponseBody)
// 														.catch(getError),
//
// 	delete: async (url: string) => axiosInstance.delete(url)
// 												.then(getResponseBody)
// 												.catch(getError),
//
// 	deleteWithBody: async (url: string, body: {}) => axiosInstance.delete(url, { data: body})
// 																  .then(getResponseBody)
// 																  .catch(getError),
//
// 	refreshToken(newAuthToken: string) {
// 		axiosInstanceHeaders = {
// 			common : { 'Authorization': "Bearer " + newAuthToken }
// 		}
//
// 		axiosInstance = axios.create({
// 			baseURL: `${window.API_PROTOCOL}://${window.API_DOMAIN}/api/${window.API_VERSION}/`,
// 			timeout: window.API_TIMEOUT,
// 			headers: axiosInstanceHeaders
// 		});
// 	},
// };
