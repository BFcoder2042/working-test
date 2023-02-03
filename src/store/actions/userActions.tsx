import { getCurrentUser, getCurators, getGroupsCurrentUser, getParticipants } from "../../api/users";

import { GET_CURRENT_USER, GET_CURATORS, GET_GROUPS_CURRENT_USER, GET_PARTISIPIANTS, SET_CURRENT_USER_GROUP} from "./types";

import { IUser } from "../../interfaces/IUser";
import { ICuratorsObject } from "../../interfaces/ICurators";
import usersGroupState from "../../state/usersGroupState";

export const fetchCurrentUser = (context) => async (dispatch) => {
  getCurrentUser(context).then((user : IUser) => {
  dispatch({
      type: GET_CURRENT_USER,
      payload: user,
    });
  });
};

export const fetchCurators = (context) => async (dispatch) => {
  getCurators(context).then((curators : any) => {
  curators.value.map(item => item.Id = item.Id0Id);
  dispatch({
      type: GET_CURATORS,
      payload: curators.value,
    });
  });
};

export const fetchGroupsCurrentUser = (context) => async (dispatch) => {
  getGroupsCurrentUser(context).then((groups : ICuratorsObject) => {
    const currentUserIsAdmin = groups.value.some(item => item.Id === usersGroupState.curators || item.Id === usersGroupState.owners);
    dispatch({
      type: GET_GROUPS_CURRENT_USER,
      payload: currentUserIsAdmin,
    });
  });
};

export const fetchPartisipiants = (context) => async (dispatch) => {
  getParticipants(context).then((partisipiants : any) => {
    partisipiants.value.map(item => item.Id = item.Id0Id);
    dispatch({
      type: GET_PARTISIPIANTS,
      payload: partisipiants.value
    });
  });
};

