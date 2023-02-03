import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { getCurrentUser } from './users';
import { IUser } from '../interfaces/IUser';
const ACCESS_TOKEN_KEY = "accessToken";

const token = localStorage.getItem(ACCESS_TOKEN_KEY);

const closePeriod = (context, periodId) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "X-HTTP-Method": "MERGE",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List3ListItem' }, 'Status': 'Закрыт' }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/Lists(guid'0c40ed31-17d5-494d-82d2-1ddaa231449d')/items(${periodId})`, SPHttpClient.configurations.v1, options)
        .then(() => {
          getUsersGoals(context, periodId, false, false, false, false).then((goals : any) => {
            let goalsArray = goals.value.filter(el => !['Выполнена','Перенесена', 'Не выполнена'].includes(el.Status));
            recursiveСhangeGoalStatus(context, 'Не выполнена', goalsArray, 0, resolve)
          }).catch((err) => {
              console.log(err);
          });
        })
        .catch((error) => {
            reject(error);
        });
    })
}


const getUsersGoals = (context, periodId, userId, goalName, userName, status) => {
    const fields = ['Id','Status','AssignedId','AuthorId','Created','TutorId','DateDeadline','DateEnd','DateStart','Description','EditorId','Modified','AchievementCriteria','CertificationPeriodId','NameGoalId','NameGoal/Title','CertificationPeriod/Title','Tutor/Title', 'Assigned/Title'];
    let params = [];
    let goalNameParam = `${goalName ? `substringof('${goalName}', NameGoal/Title)` : ''}`;
    let userNameParam = `${userName ? `substringof('${userName}', Assigned/Title)` : ''}`;
    let statusParam = `${status ? `Status eq '${status}'` : ''}`;
    let periodIdParam = `${periodId ? `CertificationPeriod eq ${periodId}` : ''}`;
    let userIdParam = `${userId ? `AssignedId eq ${userId}` : ''}`;
    params.push(goalNameParam, userNameParam, statusParam, periodIdParam, userIdParam);
    params = params.filter(e => e).map((item,index) => index > 0 ? 'and ' + item : item);
    return new Promise((resolve, reject) => {
            context.spHttpClient
            .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items?$filter=${params.join(" ")}&$select=${fields.join()}&$expand=NameGoal,CertificationPeriod,Tutor,Assigned`,
            SPHttpClient.configurations.v1, {
                headers: {
                    'Authorization': token
                }
            })
            .then((userGoals) => {
                resolve(userGoals.json());
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getUsersGoal = (context, id) => {
    return new Promise((resolve, reject) => {
            context.spHttpClient
            .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items?$filter=NameGoalId eq ${id}`,
            SPHttpClient.configurations.v1, {
                headers: {
                    'Authorization': token
                }
            })
            .then((userGoals) => {
                resolve(userGoals.json());
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getDirectoryGoals = (context, sectionId = null, name = null, tag = null) => {
    const fields = ['Id','AuthorId','Created','Description','EditorId','Modified','AchievementCriteria','Title','Tags','Status','SectionId','Section/Title'];
    let params = [];
    let nameParam = `${name ? `substringof('${name}', Title)` : ''}`;
    let tagParam = `${tag ? `Tags eq '${tag}'` : ''}`;
    let sectionParam = `${sectionId ? `SectionId eq ${sectionId}` : ''}`;
    let statusParam = `Status eq 'Активная'`
    params.push(nameParam, tagParam, sectionParam, statusParam);
    params = params.filter(e => e).map((item,index) => index > 0 ? 'and ' + item : item);
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'9e5bcc4b-4da0-4892-89ad-0748e31ce87a')/items?$filter=${params.join(" ")}&$select=${fields.join()}&$expand=Section`,
        SPHttpClient.configurations.v1, {
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

const getTags = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'9e5bcc4b-4da0-4892-89ad-0748e31ce87a')/fields(guid'557a0cf6-f999-4de0-b9f4-fb63ced24e46')`,
        SPHttpClient.configurations.v1, {
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

const getUsersGoalsStatuses = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/fields(guid'4f6472a6-a167-4fe5-8cda-cee203108ce4')`,
        SPHttpClient.configurations.v1, {
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

const getPeriods = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'0c40ed31-17d5-494d-82d2-1ddaa231449d')/items`, SPHttpClient.configurations.v1, {
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

const getSections = (context) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'5f9e28fe-1ef0-4a8f-bc10-4e0a0eb35e50')/items`, SPHttpClient.configurations.v1, {
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

const checkUserGoal = (context, goalId, userId) => {
    return new Promise((resolve, reject) => {
        context.spHttpClient
        .get(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items?$filter=NameGoalId eq ${goalId} and AssignedId eq ${userId}`, SPHttpClient.configurations.v1, {
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


const createUserGoal = (context, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List1ListItem' },
            'NameGoalId': data.nameGoalId,
            'AchievementCriteria': data.achievementCriteria,
            'Description': data.description,
            'CertificationPeriodId': data.certificationPeriodId,
            'DateEnd': data.dateEnd,
            'DateStart': data.dateStart,
            'DateDeadline': data.dateDeadline().toString(),
            'AssignedId': data.assignedId,
            'TutorId': data.tutorId,
            'Role': data.role
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items`, SPHttpClient.configurations.v1, options)
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}

const createGoal = (context, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.ListListItem' },
            'Title': data.title,
            'AchievementCriteria': data.achievementCriteria,
            'Description': data.description,
            'SectionId': data.sectionId,
            'Tags': { '__metadata': { 'type' : 'Collection(Edm.String)'}, results: data.tags },
            'Status': data.status
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'9e5bcc4b-4da0-4892-89ad-0748e31ce87a')/items`, SPHttpClient.configurations.v1, options)
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}

const createSubSection = (context, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List5ListItem' },
            'Title': data.title,
            'ParentId': data.parentId,
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'5f9e28fe-1ef0-4a8f-bc10-4e0a0eb35e50')/items`, SPHttpClient.configurations.v1, options)
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}


const createSection = (context, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List5ListItem' },
            'Title': data.title,
            'ParentId': 0,
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'5f9e28fe-1ef0-4a8f-bc10-4e0a0eb35e50')/items`, SPHttpClient.configurations.v1, options)
        .then((res) => {
            resolve(res.json());
        })
        .catch(err => {
            reject(err);
        })
    })
}

const updateSection = (context, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
              "accept": "application/json; odata=verbose",
              "Content-Type" : "application/json;odata=verbose",
              "IF-MATCH": "*",
              'odata-version': '3.0',
              "X-HTTP-Method": "MERGE",
              'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List5ListItem' },
            'Title': data.title
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'5f9e28fe-1ef0-4a8f-bc10-4e0a0eb35e50')/items(${data.id})`, SPHttpClient.configurations.v1, options)
        .then((res) => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const deleteSection = (context, id) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
              "accept": "application/json; odata=verbose",
              "Content-Type" : "application/json;odata=verbose",
              "IF-MATCH": "*",
              'odata-version': '3.0',
              "X-HTTP-Method": "DELETE",
              'Authorization': token
            },
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'5f9e28fe-1ef0-4a8f-bc10-4e0a0eb35e50')/items(${id})`, SPHttpClient.configurations.v1, options)
        .then((res) => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const arhiveGoal = (context, status, id) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                "X-HTTP-Method": "MERGE",
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.ListListItem' },
            'Status': status,
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'9e5bcc4b-4da0-4892-89ad-0748e31ce87a')/items(${id})`, SPHttpClient.configurations.v1, options)
        .then(() => {
            resolve(true)
        })
        .catch(err => {
            reject(err);
        })
    })
}

const updateGoal = (context, id, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                "X-HTTP-Method": "MERGE",
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.ListListItem' },
            'Title': data.title,
            'AchievementCriteria': data.criterion,
            'Description': data.description,
            'SectionId': data.sectionId,
            'Tags': { '__metadata': { 'type' : 'Collection(Edm.String)'}, results: data.tags }
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'9e5bcc4b-4da0-4892-89ad-0748e31ce87a')/items(${id})`, SPHttpClient.configurations.v1, options)
        .then(() => {
          getUsersGoal(context, id).then((goals : any) => {
            goals.value.forEach((goal : any) => {
              updateUserGoal(context, goal.Id, data)
            });
            resolve(true);
          });
        })
        .catch(err => {
            reject(err);
        })
    })
}

const updateUserGoal = (context, id, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                "X-HTTP-Method": "MERGE",
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List1ListItem' },
            'AchievementCriteria': data.criterion,
            'Description': data.description
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items(${id})`, SPHttpClient.configurations.v1, options)
        .then(() => {
            resolve(true)
        })
        .catch(err => {
            reject(err);
        })
    })
}

const recursiveСhangeGoalStatus = (context, status, goalsArray, index, callback) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                "X-HTTP-Method": "MERGE",
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List1ListItem' },
            'Status': status,
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items(${goalsArray[index].Id})`, SPHttpClient.configurations.v1, options)
        .then(() => {
          if (!!goalsArray[index + 1]) recursiveСhangeGoalStatus(context, status, goalsArray, index + 1, callback)
          else callback(true)
        })
        .catch(err => {
            reject(err);
        })
    })
}

const changeMyGoalStatus = (context, status, id) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                "X-HTTP-Method": "MERGE",
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List1ListItem' },
            'Status': status,
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items(${id})`, SPHttpClient.configurations.v1, options)
        .then(() => {
            resolve(true)
        })
        .catch(err => {
            reject(err);
        })
    })
}

const changeUserGoal = (context, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                "X-HTTP-Method": "MERGE",
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List1ListItem' },
            'Status': data.status,
            'CertificationPeriodId': data.certificationPeriodId,
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'fe121a7f-7d2f-4a16-a710-0cc3bd8133f3')/items(${data.id})`, SPHttpClient.configurations.v1, options)
        .then(() => {
            resolve(true)
        })
        .catch(err => {
            reject(err);
        })
    })
}

const createPeriod = (context, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "accept": "application/json; odata=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                'odata-version': '3.0',
                'Authorization': token
            },
            body: JSON.stringify({ '__metadata': { 'type': 'SP.Data.List3ListItem' },
            'Title': data.title,
            'Status': data.status,
            'DateStart': data.dateStart,
            'DateEnd': data.dateEnd
            }),
        }
        context.spHttpClient
        .post(`https://365sts.sharepoint.com/sites/Certification/_api/web/lists(guid'0c40ed31-17d5-494d-82d2-1ddaa231449d')/items`, SPHttpClient.configurations.v1, options)
        .then((res) => {
            resolve(res.json())
        })
        .catch(err => {
            reject(err);
        })
    })
}

export {
    closePeriod,
    getDirectoryGoals,
    getPeriods,
    createUserGoal,
    getSections,
    getTags,
    createSection,
    createSubSection,
    updateSection,
    deleteSection,
    createGoal,
    arhiveGoal,
    updateGoal,
    getUsersGoal,
    changeMyGoalStatus,
    getUsersGoals,
    getUsersGoalsStatuses,
    createPeriod,
    changeUserGoal,
    checkUserGoal
};
