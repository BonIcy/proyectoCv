import React, { useState, useEffect } from 'react';
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
import RecoveryPassword from './components/RecoveryPassword/RecoveryPassword';
import VerifyCode from './components/VerifyCode/VerifyCode';
import AuthService from './components/auth/authService';

function App() {
  const [userRole, setUserRole] = useState(AuthService.getRole());

  useEffect(() => {
    setUserRole(AuthService.getRole());
  }, []);
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <Switch>
          <Route path="/SignUp" component={SignUp} /> 
          <Route path="/SignIn" component={SignIn} /> 
          <PrivateRoute path="/campers" component={Campers} /> {/* aca ponga el home cuando lo termine mmgv */}
          <PrivateRoute path="/managmentCampers" 
          component={CampersList} 
          roles={['Admin']} />
          <PrivateRoute path="/postCamper" 
          component={PostCamper} 
          roles={['Admin']} />
          <PrivateRoute path="/updateCamper/:id"
           component={UpdateCamper}
           roles={['Admin']} />
          <PrivateRoute path="/campers"
           component={Campers}
           roles={['Company', 'User', 'Admin']} />
          <PrivateRoute path="/administration"
           component={Get}
           roles={['Admin']} /> 
          <PrivateRoute path="/postData"
           component={Post}
           roles={['Admin']} /> 
          <PrivateRoute path="/update"
           component={Update}
           roles={['Admin']} /> 
        <Route path="/RecoveryPassword" component={RecoveryPassword} />
        <Route path="/VerifyCode" component={VerifyCode} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;
