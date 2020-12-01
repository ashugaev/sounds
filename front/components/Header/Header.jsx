import React from 'react';
import query from 'query';
import { NavLink } from 'react-router-dom';
import Button from 'c/Button';
import { withRouter } from 'react-router';
import Search from 'c/Header/Search';
import Text from 'c/Text';
import { albumsPath, livePath } from 'constants';
import s from './Header.sass';

const tabs = [
  {
    text: 'Home',
    path: '/categories',
    label: 'categories',
  },
  {
    text: 'Albums',
    path: albumsPath,
  }, {
    text: 'Live broadcast',
    path: livePath,
    label: 'live',
  },
];

const Header = ({ history }) => {
  const isSearchEnabled = query.hasParam(history, 'isSearchEnabled');

  return (
    <div className={s.Header}>
      <div className={s.Tabs}>
        {tabs.map(el => (
          <NavLink
            key={el.path}
            exact
            activeClassName={s.OneTab_active}
            className={s.OneTab}
            isActive={(match, location) => location.pathname === el.path}
            to={{
              pathname: el.path,
              search: query.getString(history),
            }}
          >
            <Text noWrap>
              {el.text}
            </Text>
          </NavLink>
        ))}
      </div>
      {isSearchEnabled && <Search className={s.Search} />}
      <div className={s.Icons}>
        <a href="https://www.patreon.com/ashugaev" target="_blank">
          <Button className={s.OneIcon} icon="patreon" size="xs" />
        </a>

        {/* <NavLink */}
        {/*  exact */}
        {/*  activeClassName={cnHeader('OneIcon', { active: true })} */}
        {/*  className={cnHeader('OneIcon')} */}
        {/*  to={{ */}
        {/*    pathname: '/liked', */}
        {/*    search: query.getString(history), */}
        {/*  }} */}
        {/* > */}
        {/*  <Button */}
        {/*    className={cnHeader('OneIcon')} */}
        {/*    icon="like" */}
        {/*    size="xs" */}
        {/*    isActive={get(history, 'location.pathname') === '/liked'} */}
        {/*    hoverable */}
        {/*  /> */}
        {/* </NavLink> */}
      </div>
    </div>
  );
};

export default withRouter(Header);
