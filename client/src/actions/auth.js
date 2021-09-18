import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signIn = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, data });

        history.push('/room/sciencebowl');
    } catch (error) {
        console.log(error);
    }
}

export const signUp = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: AUTH, data });

        history.push('/room/sciencebowl');
    } catch (error) {
        console.log(error);
    }
}