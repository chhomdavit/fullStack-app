import axios from 'axios';
import { message } from 'antd';

const BASE_URL = "http://localhost:8080/api/v1/";
export const Config = {
  base_server: `${BASE_URL}`,
  image_path: `${BASE_URL}upload/`,
  version: 1,
};

export const request = async (method = "", url = "", data = {}, newToken = null) => {
  let accessToken = localStorage.getItem('accessToken');
  if (newToken !== null) {
    accessToken = newToken;
  }
  try {
    const response = await axios({
      method: method,
      url: Config.base_server + url,
      data: data,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });
    return response;
  } catch (err) {
    const status = err.response?.status;

    if (status === 404) {
      message.error('Route Not Found!');
    } else if (status === 403 || status === 401) {
      return refreshToken(url, method, data);
    } else if (status === 500) {
      message.error('Internal server error!');
    } else if (status === 401) {
      message.error('Unauthorized access!');
    } else {
      message.error(err.message || 'An unexpected error occurred.');
    }
    return false;
  }
};

export const refreshToken = async (url, method, data) => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const res = await axios({
      url: Config.base_server + 'employee/refresh-token',
      method: 'post',
      data: {
        refresh_token: refreshToken,
      },
    });
    message.success('Token refreshed successfully');
    localStorage.setItem("accessToken", res.data.response_data.access_token);
    localStorage.setItem("refreshToken", res.data.response_data.refresh_token);

    const newToken = res.data.response_data.access_token;
    return request(method, url, data, newToken);
  } catch (error) {
    message.error('Session expired. Please log in again.');
    logout();
    window.location.href = "/";
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('login');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('response_data');
  message.info('You have been logged out.');
};


//===========================================================

// import axios from 'axios' 

// const BASE_URL = "http://localhost:8080/api/v1/";
// export const Config = {
//   base_server: `${BASE_URL}`,
//   image_path: `${BASE_URL}upload/`,
//   version: 1,
// };

// export const request = (method = "", url = "", data = {}) => {
//   return axios({
//     method: method,
//     url: Config.base_server + url,
//     data: data,
//   }).then(res => {
//     return res
//   }).catch(() => {
//     return false;
//   });
// }
