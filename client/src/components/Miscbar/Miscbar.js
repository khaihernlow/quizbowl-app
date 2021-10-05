import React, { useContext, useEffect, useState } from 'react';
import Avatar from '../Avatar/Avatar';
import { SocketContext } from '../../contexts/socket';
import { Skeleton } from '@mui/material';

import './Miscbar.css';

const MiscBar = () => {
  const socket = useContext(SocketContext);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    socket.on('userStats', (userStats) => {
      setUserStats(userStats.userStats);
    });
  }, []);

  return (
    <div className="misc">
      <div className="misc__info">
        <div className="misc__content__stats">
          <div className="misc__content__stats__tab">
            <h4 className="misc__content__stats__tab__label">Points</h4>
            <h3 className="misc__content__stats__tab__value">
              {userStats ? userStats.sciencebowl.points : <Skeleton variant="text" width={68} height={33} />}
            </h3>
          </div>
          <div className="misc__content__stats__tab">
            <h4 className="misc__content__stats__tab__label">Level</h4>
            <h3 className="misc__content__stats__tab__value">
              {userStats ? userStats.level : <Skeleton variant="text" width={68} height={33} />}
            </h3>
          </div>
          <div className="misc__content__stats__tab">
            <h4 className="misc__content__stats__tab__label">Coins</h4>
            <h3 className="misc__content__stats__tab__value">
              {userStats ? userStats.coins : <Skeleton variant="text" width={68} height={33} />}
            </h3>
          </div>
        </div>
      </div>

      <hr className="misc__divider" />

      <div className="misc__info">
        <div className="misc__heading">
          <span className="material-icons-outlined misc__heading__icon">leaderboard</span>
          <h4 className="misc__heading__label">Leaderboard</h4>
        </div>
        <div className="misc__content__leaderboard">
          <div className="misc__leaderboard__buttons">
            <div className="misc__leaderboard__button">
              <h3>7 Days</h3>
            </div>
            <div className="misc__leaderboard__button">
              <h3>All Time</h3>
            </div>
          </div>

          <div className="misc__leaderboard__rank">
            <h2 className="misc__leaderboard__rank__position">1</h2>
            <div className="misc__leaderboard__rank__avatar">
              <Avatar size="30" letter="K" />
            </div>
            <h3 className="misc__leaderboard__rank__name">khaihern</h3>
            <div className="misc__leaderboard__rank__pts">
              <h2 className="misc__leaderboard__rank__pts__value">1770</h2>
              <h4 className="misc__leaderboard__rank__pts__label"></h4>
            </div>
          </div>

          <div className="misc__leaderboard__rank">
            <h2 className="misc__leaderboard__rank__position">1</h2>
            <div className="misc__leaderboard__rank__avatar">
              <Avatar size="30" letter="K" />
            </div>
            <h3 className="misc__leaderboard__rank__name">khaihern</h3>
            <div className="misc__leaderboard__rank__pts">
              <h2 className="misc__leaderboard__rank__pts__value">1770</h2>
              <h4 className="misc__leaderboard__rank__pts__label"></h4>
            </div>
          </div>

          <div className="misc__leaderboard__rank">
            <h2 className="misc__leaderboard__rank__position">1</h2>
            <div className="misc__leaderboard__rank__avatar">
              <Avatar size="30" letter="K" />
            </div>
            <h3 className="misc__leaderboard__rank__name">khaihern</h3>
            <div className="misc__leaderboard__rank__pts">
              <h2 className="misc__leaderboard__rank__pts__value">1770</h2>
              <h4 className="misc__leaderboard__rank__pts__label"></h4>
            </div>
          </div>

          <div className="misc__leaderboard__rank">
            <h2 className="misc__leaderboard__rank__position">1</h2>
            <div className="misc__leaderboard__rank__avatar">
              <Avatar size="30" letter="K" />
            </div>
            <h3 className="misc__leaderboard__rank__name">khaihern</h3>
            <div className="misc__leaderboard__rank__pts">
              <h2 className="misc__leaderboard__rank__pts__value">1770</h2>
              <h4 className="misc__leaderboard__rank__pts__label"></h4>
            </div>
          </div>
        </div>
      </div>

      <hr className="misc__divider" />

      <div className="misc__info">
        <div className="misc__heading">
          <span className="material-icons-outlined misc__heading__icon">people</span>
          <h4 className="misc__heading__label">Players</h4>
        </div>
        <div className="misc__content__players">
          <div className="misc__players__player">
            <Avatar size="35" letter="K" />
          </div>
          <div className="misc__players__player">
            <Avatar size="35" letter="K" />
          </div>
          <div className="misc__players__player">
            <Avatar size="35" letter="K" />
          </div>
          <div className="misc__players__player">
            <Avatar size="35" letter="K" />
          </div>
          <div className="misc__players__player">
            <Avatar size="35" letter="K" />
          </div>
          <div className="misc__players__player">
            <Avatar size="35" letter="K" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiscBar;
