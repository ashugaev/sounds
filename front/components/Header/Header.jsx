import React from 'react';
import query from 'query';
import { cn } from '@bem-react/classname';
import { get } from 'lodash-es';
import { NavLink } from 'react-router-dom';
import Button from 'c/Button';
import { withRouter } from 'react-router';
import './Header.sass';

const cnHeader = cn('Header');

const tabs = [
  {
    text: 'Главная',
    path: '/',
  },
  {
    text: 'Каналы',
    path: '/channels',
  }, {
    text: 'Трансляции',
    path: '/live',
    label: 'live',
  },
];

const Header = ({ history }) => {
  return (
    <div className={cnHeader()}>
      <div className={cnHeader('Tabs')}>
        {tabs.map(el => (
          <NavLink
            key={el.path}
            exact
            activeClassName={cnHeader('OneTab', { active: true })}
            className={cnHeader('OneTab')}
            to={{
              pathname: el.path,
              search: query.getString(history),
            }}
          >
            {el.text}
          </NavLink>
        ))}
      </div>
      <div className={cnHeader('Icons')}>
        <a href="https://www.patreon.com/" target="_blank">
          <Button className={cnHeader('OneIcon')} icon="patreon" size="xs" />
        </a>

        <NavLink
          exact
          activeClassName={cnHeader('OneIcon', { active: true })}
          className={cnHeader('OneIcon')}
          to={{
            pathname: '/liked',
            search: query.getString(history),
          }}
        >
          <Button
            className={cnHeader('OneIcon')}
            icon="like"
            size="xs"
            isActive={get(history, 'location.pathname') === '/liked'}
            hoverable
          />
        </NavLink>
      </div>
    </div>
  );
};

export default withRouter(Header);
