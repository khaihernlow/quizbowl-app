import React from 'react';

import Avatar from '../Avatar/Avatar';
import './Navbar.css';

const Navbar = () => {
  return (
    <>
      <div className="nav">
        <div className="nav__logo"></div>
        <div className="nav__user">
          <div className="nav__avatar">
            <Avatar size="35px" letter="K" />
          </div>
          <div className="nav__avatar__dropdown">
            <div className="nav__dropdown__item nav__dropdown__profile">
              <Avatar size="40px" letter="K" />
              <div className="nav__dropdown__profile__text">
                  <h3 className="nav__dropdown__profile__text__name">khaihern</h3>
                  <h4 className="nav__dropdown__profile__text__link">See your profile</h4>
              </div>
            </div>
            <hr className="nav__dropdown__hr" />
            <div>khaihern</div>
          </div>
        </div>
      </div>

      <hr className="nav__divider" />
    </>
  );
};

export default Navbar;
