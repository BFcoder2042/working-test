import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
const ACCESS_TOKEN_KEY = "accessToken";

const token = localStorage.getItem(ACCESS_TOKEN_KEY);

const getCurrentUser = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/currentuser`, SPHttpClient.configurations.v1, {
            headers: {
                'Authorization': token
            }
        })
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getCurators = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'39d11806-7698-4251-993b-b7f6202f18c4')/Items`, SPHttpClient.configurations.v1, {
            headers: {
                'Authorization': token
            }
        })
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getGroupsCurrentUser = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/currentuser/groups`, SPHttpClient.configurations.v1, {
            headers: {
                'Authorization': token
            }
        })
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getParticipants = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'd84b6868-bc04-4907-8445-b0ac2ee76d1e')/Items`, SPHttpClient.configurations.v1, {
            headers: {
                'Authorization': token
            }
        })
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}


export {
    getCurrentUser,
    getCurators,
    getGroupsCurrentUser,
    getParticipants
};
