import { createContext, useEffect, useReducer } from 'react';
import authReducer from '../reducers/auth';

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem('profile')),
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  // useEffect(() => {
  //   localStorage.setItem('user', JSON.stringify(state.user));
  // }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
