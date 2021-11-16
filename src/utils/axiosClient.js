import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = process.env.REACT_APP_BASEURL;

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// axiosClient.defaults.timeout = 3000;

axiosClient.defaults.withCredentials = false;

export const getRequest = axiosClient.get;
export const postRequest = axiosClient.post;
export const deleteRequest = axiosClient.delete;

export default axiosClient;




