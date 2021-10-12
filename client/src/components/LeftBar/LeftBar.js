import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import './LeftBar.css';
import Avatar from '../Avatar/Avatar';
import { AuthContext } from '../../contexts/auth';

const LeftBar = () => {
  const { user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const handleAvatarClick = () => {
    setDropdownOpen((prevDropdownOpen) => !prevDropdownOpen);
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    history.push('/auth');
  };

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    // setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location, user?.token]);

  return (
    // <div className="rooms">
    //   <div className="room">
    //     <div className="room__icon"></div>
    //     <div className="room__info">
    //       <h3 className="room__info__name">Science Bowl</h3>
    //       <h4 className="room__info__desc">What time was our mee... · 20m</h4>
    //     </div>
    //   </div>

    //   <div className="room">
    //     <div className="room__icon"></div>
    //     <div className="room__info">
    //       <h3 className="room__info__name">History Bowl</h3>
    //       <h4 className="room__info__desc">What time was our mee... · 20m</h4>
    //     </div>
    //   </div>
    // </div>

    <div className="leftBar">
      <div className="leftBar__brand">
        <div className="leftBar__brand__logo"></div>
        <h2 className="leftBar__brand__name">QuizBowl</h2>
      </div>
      <div className="leftBar__quickSelect">
        {user ? (
          <div className="leftBar__quickSelect__option leftBar__quickSelect__user" onClick={handleAvatarClick}>
            <span className="leftBar__quickSelect__option__icon">
              <Avatar size="35" letter={user?.result?.username?.charAt(0).toUpperCase()} />
            </span>
            <h3 className="leftBar__quickSelect__option__label">{user?.result?.username}</h3>
            {dropdownOpen && (
              <div className="leftBar__avatar__dropdown">
                <div className="leftBar__dropdown__item leftBar__dropdown__profile">
                  <Avatar size="40" letter={user?.result?.username?.charAt(0).toUpperCase()} />
                  <div className="leftBar__dropdown__profile__text">
                    <h3 className="leftBar__dropdown__profile__text__name">{user?.result?.username}</h3>
                    <h4 className="leftBar__dropdown__profile__text__link">See your profile</h4>
                  </div>
                </div>
                <hr className="leftBar__dropdown__hr" />
                <div className="leftBar__dropdown__item leftBar__dropdown__option">
                  <span className="material-icons-outlined leftBar__dropdown__option__icon">settings</span>
                  <h3 className="leftBar__dropdown__option__text">Account &amp; Settings</h3>
                  <span className="material-icons-outlined leftBar__dropdown__option__icon" style={{ background: 'none' }}>
                    chevron_right
                  </span>
                </div>
                <div className="leftBar__dropdown__item leftBar__dropdown__option" onClick={logout}>
                  <span className="material-icons-outlined leftBar__dropdown__option__icon">logout</span>
                  <h3 className="leftBar__dropdown__option__text">Logout</h3>
                </div>
                <h4 className="leftBar__dropdown__copyright">Quizbowl © 2021</h4>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="leftBar__quickSelect__option link-style leftBar__login">
            <h3>Log in</h3>
          </Link>
        )}
        <div className="leftBar__quickSelect__option">
          <span className="material-icons-outlined leftBar__quickSelect__option__icon">settings</span>
          <h3 className="leftBar__quickSelect__option__label">Settings</h3>
        </div>
        <div className="leftBar__quickSelect__option">
          <span className="material-icons-outlined leftBar__quickSelect__option__icon">add_box</span>
          <h3 className="leftBar__quickSelect__option__label">Create a Room</h3>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
