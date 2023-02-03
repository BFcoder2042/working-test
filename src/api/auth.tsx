import axios from 'axios';
// import $api from '../axiosConfig';

const ACCESS_TOKEN_KEY = "accessToken";

const token = () => {
  return new Promise((resolve, reject) => {
    axios.post('http://10.1.6.13:3000/api/token', {
      data: {
      tenantId: '7ce83bea-9f48-4720-966f-6abbbe073228',
      clientId: '98cbcce7-89a8-4d9f-87f4-94aae071e326@7ce83bea-9f48-4720-966f-6abbbe073228',
      clientSecret: 'o4ghhMtIPv6x5uQIjHdOidjOqxfMs2R3rNjTet/cCbY=',
      resource: '00000003-0000-0ff1-ce00-000000000000/365sts.sharepoint.com@7ce83bea-9f48-4720-966f-6abbbe073228'
    }
    }).then((res : any) => {
      resolve(res);
    }).catch((err) => {
      Promise.reject(err);
      reject(err);
    });
  })
}


export default token;
