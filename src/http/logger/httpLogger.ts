import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';

const loggerEndpointUrl = '/logger';

export enum LogLevels {
  NoStatus = 0,
  Debug = 1,
  Information = 2,
  Warning = 3,
  Error = 4
}

interface Log {
  level: LogLevels;
  detail: string;
  endpoint?: string;
  queryParams?: string;
  location?: string;
  statusCode?: string;
  body?: any;
  response?: any;
}

export const LoggerService = {
  log: async (logData: Log): Promise<BaseResponse | undefined> => {
    try {
      return await HttpAxiosRequest.post(loggerEndpointUrl, logData);
    } catch (error) {
      console.error('Failed to log:', error);
    }
  },
};