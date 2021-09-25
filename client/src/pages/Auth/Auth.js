import React, { useState, useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { CircularProgress } from '@material-ui/core';

import './Auth.css';
import { signIn, signUp } from '../../actions/auth';
import { AUTH_NEUTRAL } from '../../constants/actionTypes';

const initialState = { username: '', password: '' };

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  //const dispatch = useDispatch();
  const history = useHistory();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    if (isSignup) {
      signUp(formData, history, dispatch);
    } else {
      signIn(formData, history, dispatch);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const googleSuccess = async (res) => {};

  const googleFailure = (error) => {};

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    dispatch({ type: AUTH_NEUTRAL })
  };

  return (
    <>
      <div className="auth__nav">
        <div className="auth__nav__logo"></div>
        <Link to="/room/sciencebowl" className="link-style">
          <h1 className="auth__nav__text">Quizbowl</h1>
        </Link>
      </div>

      <hr className="auth__divider"></hr>

      <div className="auth__main-container">
        <div className="auth__hero">
          <h1 className="auth__hero__text">Compete with Players and practice on Thousands of Questions</h1>
        </div>
        <div className="auth__form-wrapper">
          <form className="auth__form" onSubmit={handleSubmit}>
            <GoogleLogin
              clientId="510460764367-5tspg6fvb66o78kr7nmmj2s3pkbs7f0j.apps.googleusercontent.com"
              className="auth__form__google"
              buttonText={isSignup ? 'Sign up with Google' : 'Sign in with Google'}
              theme="dark"
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy="single_host_origin"
            />
            <hr className="auth__form__divider"></hr>
            <h4 className="auth__form__label">Username</h4>
            <input
              name="username"
              type="text"
              className="auth__form__input"
              placeholder="Enter your username"
              onChange={handleChange}
            />
            <h4 className="auth__form__label">Password</h4>
            <input
              name="password"
              type="password"
              className="auth__form__input"
              placeholder="Enter your password"
              onChange={handleChange}
            />
            {error && <h4 className="auth__form__error">Incorrect username or password.</h4>}
            <button type="submit" className="auth__form__submit" disabled={isFetching}>
              {isFetching ? <CircularProgress color="#D8D8D8" size="20px" /> : isSignup ? 'Sign Up' : 'Sign In'}
            </button>
            {isSignup ? (
              <h4 className="auth__form__switchAuthMode">
                Already on Quizbowl?{' '}
                <span className="auth__form__switchAuthMode__link" onClick={switchMode}>
                  Log in
                </span>
              </h4>
            ) : (
              <h4 className="auth__form__switchAuthMode">
                Not a member yet?{' '}
                <span className="auth__form__switchAuthMode__link" onClick={switchMode}>
                  Sign up
                </span>
              </h4>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;
