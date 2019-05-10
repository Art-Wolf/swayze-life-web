import React from 'react';
import {Route, Router} from 'react-router-dom';
import Auth from './Auth/Auth';
import Callback from './Callback/Callback';
import history from './history';
import App from './App';
import Bar from './Screens/Bar';
import BarList from './Screens/BarList';
import Bingo from './Screens/Bingo';
import Game from './Screens/Game';
import Home from './Screens/Home';
import Player from './Screens/Player';

const auth = new Auth ();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test (location.hash)) {
    auth.handleAuthentication ();
  }
};

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Route path="/" render={props => <App auth={auth} {...props} />} />
        <Route path="/home" render={props => <Home auth={auth} {...props} />} />
        <Route path="/game" render={props => <Game auth={auth} {...props} />} />
        <Route
          path="/player/:id"
          exact
          render={props => <Player auth={auth} {...props} />}
        />
        <Route
          path="/bingo/:id"
          exact
          render={props => <Bingo auth={auth} {...props} />}
        />
        <Route
          path="/bars"
          exact
          render={props => <BarList auth={auth} {...props} />}
        />
        <Route
          path="/bar/:id"
          exact
          render={props => <Bar auth={auth} {...props} />}
        />
        <Route
          path="/callback"
          render={props => {
            handleAuthentication (props);
            return <Callback {...props} />;
          }}
        />
      </div>
    </Router>
  );
};
