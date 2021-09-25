import { AUTH_START, AUTH_FAILURE, AUTH_NEUTRAL, AUTH, LOGOUT } from '../constants/actionTypes';

const authReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case AUTH_FAILURE:
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case AUTH_NEUTRAL:
      return {
        isFetching: false,
        error: false,
      };
    case AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case LOGOUT:
      localStorage.clear();
      return {
        user: null,
        isFetching: false,
        error: false,
      };
    default:
      return state;
  }
};

export default authReducer;
