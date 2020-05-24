import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import stores from 'stores';
import Body from 'c/Body';
import './index.sass';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

configure({ enforceActions: 'observed' });

ReactDOM.render(
  <Router>
    <Provider {...stores}>
      <Body />
    </Provider>
  </Router>,
  document.getElementById('app'),
);
