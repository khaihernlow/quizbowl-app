import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Auth from './pages/Auth/Auth';
import Game from './pages/Game/Game';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/room/:roomID">
          <Game />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Route path="/" exact>
          <h1>Welcome to Quizbowl!</h1>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
  
export default App;
