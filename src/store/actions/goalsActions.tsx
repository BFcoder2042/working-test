import { getDirectoryGoals, getPeriods, getSections, getTags, getUsersGoals, getUsersGoalsStatuses } from "../../api/goals";

import { GET_MY_GOALS, GET_DIRECTORY_GOALS, GET_PERIODS, GET_SECTIONS, GET_FILTERING_DIRECTORY_GOALS, GET_TAGS, GET_USERS_GOALS, GET_USERS_GOALS_STATUSES, SET_CURRENT_PERIOD, CLEAR_MY_GOALS } from "./types";

import { IUserGoalsObject } from "../../interfaces/IGoals";
import { IDirectoryGoalsObject } from "../../interfaces/IDirectoryGoals";
import { IPeriodsObject } from "../../interfaces/IPeriods";
import { ISectionsObject } from "../../interfaces/ISections";
import { ITags } from "../../interfaces/ITags";

export const fetchMyGoals = (context, periodId = null, userId = null) => async (dispatch) => {
  getUsersGoals(context, periodId, userId, null, null, null).then((myGoals : IUserGoalsObject) => {
  dispatch({
      type: GET_MY_GOALS,
      payload: myGoals.value,
    });
  });
};

export const clearMyGoals = () => async (dispatch) => {
  dispatch({
      type: CLEAR_MY_GOALS,
      payload: [],
    });
};

export const fetchDirectoryGoals = (context) => async (dispatch) => {
  getDirectoryGoals(context).then((directoryGoals : IDirectoryGoalsObject) => {
  dispatch({
      type: GET_DIRECTORY_GOALS,
      payload: directoryGoals.value,
    });
  });
};

export const fetchPeriods = (context) => async (dispatch) => {
  getPeriods(context).then((periods : IPeriodsObject) => {
    dispatch({
      type: GET_PERIODS,
      payload: periods.value,
    });
    dispatch({
      type: SET_CURRENT_PERIOD,
      payload: periods.value.find(period => period.Status === "В работе") || (periods.value[periods.value.length -1] ?? []),
    });
  });
};

export const fetchSections = (context) => async (dispatch) => {
  getSections(context).then((sections : ISectionsObject) => {
  dispatch({
      type: GET_SECTIONS,
      payload: sections.value,
    });
  });
};

export const fetchFilteringDirectoryGoals = (context, sectionId = null, name = null, tag = null) => async (dispatch) => {
  getDirectoryGoals(context, sectionId, name, tag).then((directoryGoals : ISectionsObject) => {
  dispatch({
      type: GET_FILTERING_DIRECTORY_GOALS,
      payload: directoryGoals.value,
    });
  });
};

export const fetchTags = (context) => async (dispatch) => {
  getTags(context).then((tags : ITags) => {
  dispatch({
      type: GET_TAGS,
      payload: tags.Choices,
    });
  });
};

export const fetchUsersGoals = (context, periodId = null, userId = null, goalName = null, userName = null, status = null) => async (dispatch) => {
  getUsersGoals(context, periodId, userId, goalName, userName, status).then((goals : IUserGoalsObject) => {
  dispatch({
      type: GET_USERS_GOALS,
      payload: goals.value,
    });
  });
};

export const fetchUsersGoalsStatuses = (context) => async (dispatch) => {
  getUsersGoalsStatuses(context).then((tags : ITags) => {
  dispatch({
      type: GET_USERS_GOALS_STATUSES,
      payload: tags.Choices,
    });
  });
};




