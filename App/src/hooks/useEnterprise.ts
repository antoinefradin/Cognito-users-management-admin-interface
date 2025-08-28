// import { useCallback, useState } from 'react';
import type { RegisterEnterpriseRequest } from '../@types/enterprise';
import useEnterpriseApi from './useEnterpriseApi';
// import { produce } from 'immer';


const useEnterprise = () => {
  const api = useEnterpriseApi();
  
  return {
    registerEnterprise: (params: RegisterEnterpriseRequest) => {
      return api.registerEnterprise(params);
    },

  };
};

export default useEnterprise;