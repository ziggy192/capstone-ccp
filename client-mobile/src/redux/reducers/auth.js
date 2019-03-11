import * as Actions from "../types";

const Initial_State = {
  loading: false,
  userIsLoggin: false,
  data: {},
  token: null
};

export default function authReducer(state = Initial_State, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.LOGIN_SUCCESS: {
      return {
        ...state,
        userIsLoggin: payload.signIn,
        token: payload.token,
        data: payload.data.data
      };
    }
    case Actions.LOGOUT_SUCCESS: {
      return {
        ...state,
        userIsLoggin: payload.signIn,
        token: null
      };
    }
    default:
      return state;
  }
}
