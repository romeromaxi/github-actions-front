import { BaseResponse, BaseResponseFields, BaseResponseWithData } from 'types/baseEntities';
import { useAction } from './useAction';
import { FileBlobResponse } from '../types/files/filesData';
import { downloadFileBlobHelper } from '../util/helpers';
import {useLoaderActions} from "./useLoaderActions";

const useAxios = () => {
  const { snackbarError, snackbarWarning } = useAction();
  const { showLoader, hideLoader } = useLoaderActions();

    const fetchData = async (
        promise: () => Promise<BaseResponseWithData<any> | BaseResponse>,
        blockUI: boolean = false
    ) => {
        if (blockUI) showLoader();

        return promise()
            .then((response: BaseResponseWithData<any> | BaseResponse) => {
                if (!response[BaseResponseFields.HasError])
                    // @ts-ignore
                    return response[BaseResponseFields.Data] || true;

                snackbarWarning(response[BaseResponseFields.ErrorDescription]);
                
                return Promise.reject(undefined);
            })
            .catch((err: BaseResponseWithData<any> | BaseResponse | undefined) => {
                if (!err)
                    return Promise.reject({} as BaseResponse);

                snackbarError(err[BaseResponseFields.ErrorDescription]);
                return Promise.reject(err);
            })
            .finally(() => {
                if (blockUI) hideLoader();
            });
    };

    const fetchAllData = async (
        promises: Iterable<Promise<BaseResponseWithData<any>>>,
        blockUI: boolean = false
    ) : Promise<any[] | undefined> => {
        if (blockUI) showLoader();

        return Promise.all(promises)
            .then(responses => {
                let responseData : any[] = []

                responses.forEach(response => {
                    if (response[BaseResponseFields.HasError]) {
                        snackbarWarning(response[BaseResponseFields.ErrorDescription]);
                        responseData.push(undefined);
                    } else
                        responseData.push(response[BaseResponseFields.Data] || true)
                })

                return responseData;
            })
            .catch((err: BaseResponseWithData<any>) => {
                snackbarError(err[BaseResponseFields.ErrorDescription]);
                return Promise.reject(undefined);
            })
            .finally(() => {
                if (blockUI) hideLoader();
            });
    };

  const fetchAndDownloadFile = (promise: () => Promise<FileBlobResponse>) => {
    showLoader();

    return promise()
      .then(downloadFileBlobHelper)
      .catch(() => {
        snackbarError('No se ha podido descargar el archivo solicitado');
        return Promise.reject(undefined);
      })
      .finally(() => hideLoader());
  };

  return { fetchData, fetchAllData, fetchAndDownloadFile };
};

export default useAxios;
