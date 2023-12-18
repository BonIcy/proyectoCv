import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Get from './components/crruds/get';
import Post from './components/crruds/post';
import Update from './components/crruds/update';
import CampersList from './components/campersManagment/campersManagment';
import PostCamper from './components/campersManagment/postCampers';
import UpdateCamper from './components/campersManagment/updateCamper';
import Campers from './components/campers/camperCards';
import Sidebar from './components/sidebar/sidebar';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
//import Home from './components/home/Home';
import PrivateRoute from './components/auth/privateRoute';
function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <Switch>
          <Route path="/SignUp" component={SignUp} /> 
          <Route path="/SignIn" component={SignIn} /> 
          <PrivateRoute path="/home" component={Campers} /> {/* aca ponga el home cuando lo termine mmgv */}
          <PrivateRoute path="/managmentCampers" component={CampersList} />
          <PrivateRoute path="/postCamper" component={PostCamper} />
          <PrivateRoute path="/updateCamper/:id" component={UpdateCamper} />
          <PrivateRoute path="/campers" component={Campers} />
          <PrivateRoute path="/administration" component={Get} /> 
          <PrivateRoute path="/postData" component={Post} /> 
          <Route path="/update" component={Update} /> 

        </Switch>
      </Router>
    </div>
  );
}

export default App;
