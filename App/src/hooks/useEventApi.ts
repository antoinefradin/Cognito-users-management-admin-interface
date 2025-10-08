import axios from 'axios';
import type {
  GetEventsResponse,
} from '../@types/event';
import useHttp from './useHttp';

const useEventApi = () => {
  const http = useHttp();

  return {
    getEvents: (
      refreshIntervalFunction?: (data?: GetEventsResponse) => number
    ) => {
      return http.get<GetEventsResponse>(['event'], { // `event` is the api router endpoint
        refreshInterval: refreshIntervalFunction,
      });
    },
  };
};

export default useEventApi;
