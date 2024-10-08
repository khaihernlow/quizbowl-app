import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import Avatar from '../Avatar/Avatar';
import './Navbar.css';
import { AuthContext } from '../../contexts/auth';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  console.log(user);   
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
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
    <>
      <div className="nav">
        <div className="nav__logo"></div>
        {user ? (
          <div className="nav__user">
            <div className="nav__avatar" onClick={handleAvatarClick}>
              <Avatar
                size="35"
                letter={user?.result?.username?.charAt(0).toUpperCase()}
              />
            </div>
            {dropdownOpen && (
              <div className="nav__avatar__dropdown">
                <div className="nav__dropdown__item nav__dropdown__profile">
                  <Avatar
                    size="40"
                    letter={user?.result?.username?.charAt(0).toUpperCase()}
                  />
                  <div className="nav__dropdown__profile__text">
                    <h3 className="nav__dropdown__profile__text__name">
                      {user?.result?.username}
                    </h3>
                    <h4 className="nav__dropdown__profile__text__link">
                      See your profile
                    </h4>
                  </div>
                </div>
                <hr className="nav__dropdown__hr" />
                <div className="nav__dropdown__item nav__dropdown__option">
                  <span className="material-icons-outlined nav__dropdown__option__icon">settings</span>
                  <h3 className="nav__dropdown__option__text">
                    Account &amp; Settings
                  </h3>
                  <span className="material-icons-outlined nav__dropdown__option__icon" style={{ background: "none" }}>chevron_right</span>
                </div>
                <div
                  className="nav__dropdown__item nav__dropdown__option"
                  onClick={logout}
                >
                  <span className="material-icons-outlined nav__dropdown__option__icon">logout</span>
                  <h3 className="nav__dropdown__option__text">Logout</h3>
                </div>
                <h4 className="nav__dropdown__copyright">Quizbowl © 2021</h4>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="link-style">
            <h3 className="nav__login">Log in</h3>
          </Link>
        )}
      </div>

      <hr className="nav__divider" />
    </>
  );
};

export default Navbar;
