import { fetchAuthSession } from 'aws-amplify/auth';
import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import useSWR from 'swr';
import type { SWRConfiguration } from 'swr';


// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================
/**
 * Create a custom Axios instance with base configuration
 * - baseURL: Retrieves API endpoint from Vite environment variables
 * - This instance will be reused for all HTTP requests
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
});

// ============================================================================
// REQUEST INTERCEPTOR - AUTOMATIC AUTHENTICATION
// ============================================================================
/**
 * Axios request interceptor for automatic authentication
 * Executed before each HTTP request to add necessary headers
 */
// // HTTP Request Preprocessing
api.interceptors.request.use(async (config) => {
  // If Authenticated, append ID Token to Request Header
  try {
    // STEP 1: Retrieve AWS Cognito authentication token
    // fetchAuthSession() gets the active user session from AWS Amplify
    const authSession = await fetchAuthSession();
    const idToken = authSession.tokens?.idToken;

    // STEP 2: Add Bearer token if user is authenticated
    if (idToken) {
      // Convert token to string and add to Authorization headers
      config.headers['Authorization'] = 'Bearer ' + idToken.toString();
    }

    // STEP 3: Set default Content-Type configuration
    // All requests use JSON as exchange format
    config.headers['Content-Type'] = 'application/json';

    // STEP 4: Return modified configuration
    return config;
  } catch (error) {
    // In case of error during token retrieval, continue without authentication
    console.warn('Error retrieving authentication token:', error);
    config.headers['Content-Type'] = 'application/json';
    return config;
  }
});

// ============================================================================
// FETCHER FUNCTIONS FOR SWR
// ============================================================================
/**
 * Simple fetcher for GET requests with SWR
 * @param url - Endpoint URL to call
 * @returns Promise containing only response data
 */
const fetcher = (url: string) => {
  return api.get(url).then((res) => res.data);
};

/**
 * Fetcher with parameters for complex GET requests with SWR
 * @param param - Array containing [url, params]
 * @returns Promise containing only response data
 */
const fetcherWithParams = ([url, params]: [string, Record<string, any>]) => {
  return api
    .get(url, {
      params, // Query string parameters
    })
    .then((res) => res.data);
};

// ============================================================================
// ERROR UTILITY FUNCTION (COMMENTED OUT)
// ============================================================================

/**
 * Utility function to extract error message from AxiosError
 * Priority: server message > generic Axios message
 */
// const getErrorMessage = (error: AxiosError<any>): string => {
//   return error.response?.data?.message ?? error.message;
// };

// ============================================================================
// MAIN useHttp HOOK
// ============================================================================

/**
 * Custom hook for HTTP requests with automatic authentication
 * Provides unified interface for all HTTP request types
 * 
 * FEATURES:
 * - Automatic authentication via AWS Cognito
 * - Centralized error handling
 * - SWR support for GET requests (caching, revalidation)
 * - Generic TypeScript types
 * 
 * @returns Object containing all available HTTP methods
 */
const useHttp = () => {
  // Alert hook (currently disabled)
  // const alert = useAlertSnackbar();

  return {
    // ========================================================================
    // GET METHOD - WITH SWR CACHING
    // ========================================================================
    
    /**
     * GET request with automatic caching and revalidation via SWR
     * 
     * SWR ADVANTAGES:
     * - Automatic data caching
     * - Background revalidation
     * - Loading/error state management
     * - Deduplication of identical requests
     * 
     * @param url - URL or array [url, params] for parameterized requests
     * @param config - SWR configuration (refresh interval, etc.)
     * @returns SWR object with data, error, isLoading, mutate, etc.
     */
    get: <Data = any, Error = any>(
      url: string | [string, ...unknown[]] | null,
      config?: SWRConfiguration
    ) => {
      return useSWR<Data, AxiosError<Error>>(
        url, // SWR cache key
        typeof url === 'string' ? fetcher : fetcherWithParams, // Select appropriate fetcher
        {
          ...config, // Merge with custom configuration
        }
      );
    },

    // ========================================================================
    // SINGLE GET METHOD - WITHOUT CACHING
    // ========================================================================
    
    /**
     * Single GET request without SWR caching
     * Used for data that doesn't require caching
     * 
     * @param url - Endpoint URL
     * @param params - Query parameters (query string)
     * @param errorProcess - Custom error handling function
     * @returns Promise containing complete Axios response
     */
    getOnce: <RES = any, DATA = any>(
      url: string,
      params?: DATA,
      errorProcess?: (err: any) => void
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .get<RES, AxiosResponse<RES>, DATA>(url, {
            params, // Parameters added to URL
          })
          .then((response) => {
            // SUCCESS: Resolve promise with complete response
            resolve(response);
          })
          .catch((error) => {
            // ERROR: Handle via custom function or alert system
            if (errorProcess) {
              errorProcess(error);
            } else {
              // Default error handling (alert system disabled)
              // alert.openError(getErrorMessage(error));
              console.error('GET Error:', error);
            }
            reject(error);
          });
      });
    },

    // ========================================================================
    // POST METHOD - RESOURCE CREATION
    // ========================================================================
    
    /**
     * POST request for creating new resources
     * Automatically includes authentication headers and JSON content-type
     * 
     * @param url - Endpoint URL for resource creation
     * @param data - Request payload (will be JSON stringified)
     * @param errorProcess - Custom error handling function
     * @returns Promise containing complete Axios response
     */
    post: <RES = any, DATA = any>(
      url: string,
      data: DATA,
      errorProcess?: (err: any) => void
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .post<RES, AxiosResponse<RES>, DATA>(url, data)
          .then((response) => {
            // SUCCESS: Resource created successfully
            resolve(response);
          })
          .catch((error) => {
            // ERROR: Handle creation failure
            if (errorProcess) {
              errorProcess(error);
            } else {
              // Default error handling
              // alert.openError(getErrorMessage(error));
              console.error('POST Error:', error);
            }
            reject(error);
          });
      });
    },

    // ========================================================================
    // PUT METHOD - RESOURCE UPDATE/REPLACEMENT
    // ========================================================================
    
    /**
     * PUT request for updating/replacing existing resources
     * Typically used for complete resource replacement
     * 
     * @param url - Endpoint URL for resource update
     * @param data - Complete resource data for replacement
         * @param errorProcess - Custom error handling function
     * @returns Promise containing complete Axios response
     */
    put: <RES = any, DATA = any>(
      url: string,
      data: DATA,
      errorProcess?: (err: any) => void
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .put<RES, AxiosResponse<RES>, DATA>(url, data)
          .then((response) => {
            // SUCCESS: Resource updated/replaced successfully
            resolve(response);
          })
          .catch((error) => {
            // ERROR: Handle update failure
            if (errorProcess) {
              errorProcess(error);
            } else {
              // Default error handling
              // alert.openError(getErrorMessage(error));
              console.error('PUT Error:', error);
            }
            reject(error);
          });
      });
    },

    // ========================================================================
    // DELETE METHOD - RESOURCE REMOVAL
    // ========================================================================
    
    /**
     * DELETE request for removing resources
     * Can include query parameters for conditional deletion
     * 
     * @param url - Endpoint URL for resource deletion
     * @param params - Optional query parameters for conditional deletion
     * @param errorProcess - Custom error handling function
     * @returns Promise containing complete Axios response
     */
    delete: <RES = any, DATA = any>(
      url: string,
      params?: DATA,
      errorProcess?: (err: any) => void
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .delete<RES, AxiosResponse<RES>, DATA>(url, {
            params, // Query parameters for conditional deletion
          })
          .then((response) => {
            // SUCCESS: Resource deleted successfully
            resolve(response);
          })
          .catch((error) => {
            // ERROR: Handle deletion failure
            if (errorProcess) {
              errorProcess(error);
            } else {
              // Default error handling
              // alert.openError(getErrorMessage(error));
              console.error('DELETE Error:', error);
            }
            reject(error);
          });
      });
    },

    // ========================================================================
    // PATCH METHOD - PARTIAL RESOURCE UPDATE
    // ========================================================================
    
    /**
     * PATCH request for partial resource updates
     * Used when only specific fields need to be modified
     * More efficient than PUT for partial updates
     * 
     * @param url - Endpoint URL for partial resource update
     * @param data - Partial resource data (only fields to update)
     * @param errorProcess - Custom error handling function
     * @returns Promise containing complete Axios response
     */
    patch: <RES = any, DATA = any>(
      url: string,
      data: DATA,
      errorProcess?: (err: any) => void
    ) => {
      return new Promise<AxiosResponse<RES>>((resolve, reject) => {
        api
          .patch<RES, AxiosResponse<RES>, DATA>(url, data)
          .then((response) => {
            // SUCCESS: Resource partially updated successfully
            resolve(response);
          })
          .catch((error) => {
            // ERROR: Handle partial update failure
            if (errorProcess) {
              errorProcess(error);
            } else {
              // Default error handling
              // alert.openError(getErrorMessage(error));
              console.error('PATCH Error:', error);
            }
            reject(error);
          });
      });
    },
  };
};

// ============================================================================
// EXPORT DEFAULT HOOK
// ============================================================================

export default useHttp;





// FLOW DIAGRAM:
// Component → useHttp() → Axios Instance → AWS API Gateway
//     ↓           ↓            ↓              ↓
// UI Logic → HTTP Methods → Auth Headers → Backend API
//     ↓           ↓            ↓              ↓
// State Mgmt → Error Handle → Token Refresh → Response Data

// STEP-BY-STEP AUTHENTICATION:
// 1. Component calls useHttp method
// 2. Axios interceptor triggers
// 3. fetchAuthSession() retrieves Cognito token
// 4. Token added to Authorization header
// 5. Request sent to API Gateway
// 6. API Gateway validates token with Cognito
// 7. Request forwarded to Lambda if valid

// ERROR HANDLING HIERARCHY:
// 1. Custom errorProcess function (if provided)
// 2. Global alert system (commented out)
// 3. Console logging (fallback)
// 4. Promise rejection (for component handling)