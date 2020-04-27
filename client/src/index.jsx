import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App.jsx';
import store from './store/Index.js';
import { signIn, saveItinerary, saveItineraryDB, saveItineraryDBById, addEvent, clearCurrentItinerary } from './actions/index.js';
import { Provider } from "react-redux";

window.store = store;
window.signIn = signIn;
window.saveItinerary = saveItinerary;
window.saveItineraryDB = saveItineraryDB;
window.saveItineraryDBById = saveItineraryDBById;
window.addEvent = addEvent;
window.clearCurrentItinerary = clearCurrentItinerary;

import { setCurrentUser, logoutUser } from './actions/auth.js';
import setAuthToken from './utils/setAuthToken.js';
import jwt_decode from 'jwt-decode';


// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));


  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //Logout the user
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentItinerary());

    //Redirect to login
    window.location.href = "/sign-in";
  }
}

ReactDom.render(<Provider store={store}><App /> </Provider>, document.getElementById('app'));