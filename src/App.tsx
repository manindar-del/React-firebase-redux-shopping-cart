import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'Store/store';
import './App.css';

import AppRouter from './AppRouter';
import TrackAuthState from 'lib/TrackAuthState';

function App() {
  return (
    <div className='app'>
      <Provider store={store}>
        <TrackAuthState />
        <AppRouter />
      </Provider>
    </div>
  );
}

export default App;
