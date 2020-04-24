import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App.jsx';
import store from './store/index.js';
import { signIn } from './actions/index.js';
import { Provider } from "react-redux";

window.store = store;
window.signIn = signIn;


ReactDom.render(<Provider store={store}><App /> </Provider>, document.getElementById('app'));