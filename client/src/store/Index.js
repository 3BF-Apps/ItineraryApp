import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import thunk from 'redux-thunk';

var initialState = {

};


let store;

// if (process.env.NODE_ENV === 'production') {
store = createStore(rootReducer, initialState, compose(applyMiddleware(thunk)))
    // } else {
    // store = createStore(rootReducer, initialState, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

// }


export default store;