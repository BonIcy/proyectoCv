import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import CampersList from './components/campersManagment/campersManagment'; 
import Campers from './components/campers/camperCards'; 

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/managmentCampers" component={CampersList} />
          <Route path="/campers" component={Campers} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
