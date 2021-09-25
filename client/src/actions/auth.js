import { AUTH_START, AUTH, AUTH_FAILURE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signIn = async (formData, history, dispatch) => {
    dispatch({ type: AUTH_START });
    try {
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, payload: data });

        history.push('/room/sciencebowl');
        console.log(data);
    } catch (error) {
        console.log(error);
        dispatch({ type: AUTH_FAILURE, payload: error });
    }
}

export const signUp = async (formData, history, dispatch) => {
    dispatch({ type: AUTH_START });
    try {
        const { data } = await api.signUp(formData);

        history.go(0);
    } catch (error) {
        console.log(error);
    }
}