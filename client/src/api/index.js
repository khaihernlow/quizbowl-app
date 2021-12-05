import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/' }); //localhost
// const API = axios.create({ baseURL: 'https://kh-quizbowl.herokuapp.com/' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }

    return req;
});

// AUTH
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);

// ROOM
export const getRoom = (roomID) => API.get(`/room/${roomID}`);