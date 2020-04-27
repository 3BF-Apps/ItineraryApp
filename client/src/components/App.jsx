import React from 'react';
import { connect } from 'react-redux';
import SplashPage from './Splash-Page.jsx';
import SignIn from './Sign-In.jsx';
import SignUp from './Sign-Up.jsx';
import EventWizard from './Event-Wizard.jsx';
import EventEditor from './Event-Editor.jsx';
import ViewExisting from './View-Existing.jsx';
import PublicViewer from './public-viewer/PublicViewer.jsx'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";



import { setCurrentUser, logoutUser } from '../actions/auth.js';
import setAuthToken from '../utils/setAuthToken.js';
import jwt_decode from 'jwt-decode';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(route) {
    var path = `/${route}`;
    return <Redirect to={path} />
  }

  componentDidMount() {
    // console.log('raw cookie!', document.cookie)
    // console.log('decoded cookie!', decodeURIComponent(document.cookie))

    // console.log('cookie!', JSON.parse(document.cookie))


    // Check for token
    // if (localStorage.jwtToken) {
    //     // Set auth token header auth
    //     setAuthToken(localStorage.jwtToken);
    //     // Decode token and get user info and exp
    //     const decoded = jwt_decode(localStorage.jwtToken);
    //     // Set user and isAuthenticated
    //     this.props.setCurrentUser(decoded);
  }
  render() {
    return (
      <div id='app'>
        <Router>
          <Switch>
            <Route path="/sign-in">
              <SplashPage redirect={this.redirect} />
              <SignIn />
            </Route>
            <Route path="/create-account">
              <SplashPage />
              <SignUp />
            </Route>
            <Route path="/create-new">
              <EventWizard />
            </Route>
            <Route exact path="/event-editor/:itin_id" component={EventEditor} />
            <Route exact path="/public/:itin_id" component={PublicViewer} />
            <Route path="/view-existing">
              <ViewExisting />
            </Route>
            <Route path="/">
              <SplashPage />
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default connect(null, { setCurrentUser, logoutUser })(App);