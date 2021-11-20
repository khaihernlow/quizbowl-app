import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../Avatar/Avatar';
import { SocketContext } from '../../contexts/socket';
import { Skeleton } from '@mui/material';

import './Miscbar.css';

const MiscBar = () => {
  const socket = useContext(SocketContext);
  const [userStats, setUserStats] = useState(null);
  const [allUsersStats, setAllUsersStats] = useState(null);
  const [leaderboardMode, setLeaderboardMode] = useState('round');

  useEffect(() => {
    socket.on('userStats', (userStats) => {
      console.log(userStats);
      setUserStats(userStats.userStats);
    });
    socket.on('allUsersStats', (allUsersStats) => {
      setAllUsersStats(allUsersStats.allUsersStats);
      console.log(allUsersStats.allUsersStats);
    });
  }, []);

  const handleToggleLeaderboard = (mode) => {
    if (mode === 'round') {
      setLeaderboardMode('round');
    } else if (mode === 'allTime') {
      setLeaderboardMode('allTime');
    }
  };

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
          <div className="misc__leaderboard__round">
            <h3 className="misc__leaderboard__round__desc">FFA Round</h3>
            <h2 className="misc__leaderboard__round__status">LIVE</h2>
          </div>

          <div className="misc__leaderboard__stats">
            <h2 className="misc__leaderboard__stats__text">Question: 3/24</h2>
          </div>

          <div className="misc__leaderboard__toggle">
            <h4
              className={`misc__leaderboard__toggle__option no-select ${
                leaderboardMode === 'round' ? 'misc__leaderboard__toggle__option--active' : ''
              }`}
              onClick={() => handleToggleLeaderboard('round')}
            >
              Round
            </h4>
            <h4
              className={`misc__leaderboard__toggle__option no-select ${
                leaderboardMode === 'allTime' ? 'misc__leaderboard__toggle__option--active' : ''
              }`}
              onClick={() => handleToggleLeaderboard('allTime')}
            >
              All Time
            </h4>
          </div>

          <div className="misc__leaderboard__table__wrapper">
            <table className="misc__leaderboard__table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}></th>
                  <th>Name</th>
                  <th>Neg</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {allUsersStats &&
                  allUsersStats.map((user, i) => (
                    <motion.tr layout>
                      <td className="misc__leaderboard__table__td__rank">{i + 1}</td>
                      <td className="misc__leaderboard__table__td__name">
                        <Avatar size="25" letter={user.username.charAt(0).toUpperCase()} />
                        {user.username}
                      </td>
                      <td className="misc__leaderboard__table__td__neg">2</td>
                      <td className="misc__leaderboard__table__td__pts">{user.stats.sciencebowl.points}</td>
                    </motion.tr>
                  ))}
                {/* <tr>
                  <td className="misc__leaderboard__table__td__rank">1</td>
                  <td className="misc__leaderboard__table__td__name">
                    <Avatar size="25" letter="K" />
                    khaihern
                  </td>
                  <td className="misc__leaderboard__table__td__neg">2</td>
                  <td className="misc__leaderboard__table__td__pts">1770</td>
                </tr>
                <tr>
                  <td className="misc__leaderboard__table__td__rank">2</td>
                  <td className="misc__leaderboard__table__td__name">
                    <Avatar size="25" letter="H" />
                    hamiltonmiller
                  </td>
                  <td className="misc__leaderboard__table__td__neg">2</td>
                  <td className="misc__leaderboard__table__td__pts">1770</td>
                </tr>
                <tr>
                  <td className="misc__leaderboard__table__td__rank">3</td>
                  <td className="misc__leaderboard__table__td__name">
                    <Avatar size="25" letter="G" />
                    gavinweb
                  </td>
                  <td className="misc__leaderboard__table__td__neg">2</td>
                  <td className="misc__leaderboard__table__td__pts">1770</td>
                </tr>
                <tr>
                  <td className="misc__leaderboard__table__td__rank">4</td>
                  <td className="misc__leaderboard__table__td__name">
                    <Avatar size="25" letter="B" />
                    bensmith
                  </td>
                  <td className="misc__leaderboard__table__td__neg">2</td>
                  <td className="misc__leaderboard__table__td__pts">1770</td>
                </tr>
                <tr>
                  <td className="misc__leaderboard__table__td__rank">5</td>
                  <td className="misc__leaderboard__table__td__name">
                    <Avatar size="25" letter="R" />
                    ratatouille
                  </td>
                  <td className="misc__leaderboard__table__td__neg">2</td>
                  <td className="misc__leaderboard__table__td__pts">1770</td>
                </tr> */}
              </tbody>
            </table>
          </div>

          {/* <div className="misc__leaderboard__rank">
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
          </div> */}
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
