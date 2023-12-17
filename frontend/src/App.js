import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Get from './components/crruds/get';
import Post from './components/crruds/post';
import Update from './components/crruds/update';
import CampersList from './components/campersManagment/campersManagment';
import PostCamper from './components/campersManagment/postCampers';
import Campers from './components/campers/camperCards';
import Sidebar from './components/sidebar/sidebar';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <div className="App">
      <Router>
        {/* <Sidebar /> */}
        <Switch>
          <Route path="/managmentCampers" component={CampersList} />
          <Route path="/postCamper" component={PostCamper} />
          <Route path="/campers" component={Campers} />
          <Route path="/administration" component={Get} /> 
          <Route path="/postData" component={Post} /> 
          <Route path="/update" component={Update} /> 
          <Route path="/SignUp" component={SignUp} /> 
        </Switch>
      </Router>
    </div>
  );
}

export default App;
