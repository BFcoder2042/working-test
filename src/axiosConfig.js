import * as axios from 'axios';
import token from './api/auth';

export const API_URL = 'https://365sts.sharepoint.com/sites/Certification/_api/web/';

const ACCESS_TOKEN_KEY = "accessToken";

const $api = axios.create({
  baseURL: API_URL,
});


$api.interceptors.request.use(config => {
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`;
  }
  return config;
}, error => {
  console.log(error);
})

$api.interceptors.response.use(response => {
  return response;
}, error => {
  // token().then((res) => {
  //   localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access_token);
  //   error.config.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`;

  //   return $api.request(error.config);
  // })
})



export default $api;
