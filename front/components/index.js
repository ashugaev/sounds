import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import stores from 'stores';
import Body from 'c/Body';
import './index.sass';

configure({ enforceActions: 'observed' });

ReactDOM.render(
  <Provider {...stores}>
    <Body />
  </Provider>,
  document.getElementById('app'),
);
