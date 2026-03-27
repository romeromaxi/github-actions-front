import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseRequestFields, BaseResponse } from '../../types/baseEntities';
import {
  ProductLineRegister,
  ProductLineRegisterPost,
  ProductLineRegisterPostFields,
} from '../../types/lines/productLineData';
import { FileRequestedSolicitationInsertFields } from '../../types/solicitations/solicitationData';
import { dateFormatter } from '../../util/formatters/dateFormatter';

export const HttpProductLineRegisters = {
  getEndpoint: (productLineId: number, url: string = ''): string =>
    `producto-lineas/${productLineId}/registros${url}`,

  getList: (productLineId: number): Promise<ProductLineRegister[]> => {
    return HttpAxiosRequest.get(
      HttpProductLineRegisters.getEndpoint(productLineId),
    );
  },

  insert: (
    productLineId: number,
    registerToPost: ProductLineRegisterPost,
  ): Promise<BaseResponse> => {
    const formData: FormData = new FormData();

    formData.append(
      ProductLineRegisterPostFields.RegisterDesc,
      registerToPost[ProductLineRegisterPostFields.RegisterDesc],
    );
    formData.append(
      ProductLineRegisterPostFields.RegisterDate,
      dateFormatter.toShortDate(
        registerToPost[ProductLineRegisterPostFields.RegisterDate],
      ),
    );
    formData.append(BaseRequestFields.ModuleCode, '1');
    formData.append(BaseRequestFields.OriginCode, '1');
    registerToPost[FileRequestedSolicitationInsertFields.Files]?.length !== 0 &&
      registerToPost[ProductLineRegisterPostFields.Files]?.map((file) =>
        formData.append('files', file),
      );

    return HttpAxiosRequest.post(
      HttpProductLineRegisters.getEndpoint(productLineId),
      formData,
    );
  },
};
