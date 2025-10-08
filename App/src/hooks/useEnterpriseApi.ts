import axios from 'axios';
import type {
  RegisterEnterpriseRequest,
  RegisterEnterpriseResponse,
  GetEnterprisesResponse,
  GetEnterpriseResponse,
  UpdateEnterpriseRequest,
  UpdateEnterpriseResponse,
} from '../@types/enterprise';
import useHttp from './useHttp';

const useEnterpriseApi = () => {
  const http = useHttp();

  return {
    getEnterprises: (
      refreshIntervalFunction?: (data?: GetEnterprisesResponse) => number
    ) => {
      return http.get<GetEnterprisesResponse>(['enterprise'], {
        refreshInterval: refreshIntervalFunction,
      });
    },
    getEnterprise: (enterpriseId: string) => {
      return http.getOnce<GetEnterpriseResponse>(`enterprise/${enterpriseId}`);
    },
    registerEnterprise: (params: RegisterEnterpriseRequest) => {
      return http.post<RegisterEnterpriseResponse>('enterprise', params);
    },
    updateEnterprise: (enterpriseId: string, params: UpdateEnterpriseRequest) => {
      return http.patch<UpdateEnterpriseResponse>(`enterprise/${enterpriseId}`, params);
    },
    deleteEnterprise: (enterpriseId: string) => {
      return http.delete(`enterprise/${enterpriseId}`);
    },
  };
};

export default useEnterpriseApi;
