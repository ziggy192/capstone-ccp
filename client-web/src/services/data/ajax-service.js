import ConfigService from '../common/config-service';
import axios from 'axios';
import { getRefreshToken, setTokens, getRoutePath } from 'Utils/common.utils';
import history from 'Common/createHistory';
import { routeConsts } from 'Common/consts';

const refreshAxios = axios.create({
  baseURL: ConfigService.getBaseUrl(),
  timeout: 60000,
});

/**
 * Service for making AJAX requests.
 * Uses Axios (https://github.com/mzabriskie/axios)
 */
const instance = axios.create({
  baseURL: ConfigService.getBaseUrl(),
  timeout: 60000,
});

// For refresh token
instance.interceptors.response.use(
  // Do nothing on success
  response => response,
  // Check error 401 to refresh token
  async error => {
    
    // Save origin request config to request again after refresh token
    const originalRequest = error.config;

    if (error.response.status === 401) {

      if (!getRefreshToken()) {
        setTokens('', '');
        window.logout();

        return Promise.reject(error);
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'json',
        data: JSON.stringify({
          refreshToken: getRefreshToken()
        })
      };

      // refresh token
      try {
        const responseData = await refreshAxios
          .request('/authen/refresh', options);
        // get token, refresh token and persist them
        const { accessToken, refreshToken } = responseData.data.tokenWrapper;
        setTokens(accessToken, refreshToken);
        // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      }
      catch (error) {
        setTokens('', '');
        window.logout();

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default {
  request(options) {
    return instance.request(options);
  },
};
