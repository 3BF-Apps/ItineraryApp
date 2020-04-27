import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { SIGN_IN, LOG_OUT } from '../constants/action-types';


// Register User
export const registerUser = (userData, history) => dispatch => {
    axios.post("/users/create", userData)
        .then(res => {
            alert("Successfully registered!");
            history.push("/sign-in");
        })
        .catch(err => {
            // dispatch({
            //     type: GET_ERRORS,
            //     payload: err.response.data
            // })
            alert(JSON.stringify(err.response.data.errorMessage));
        });
};

// Login -Get User token
export const loginUser = (userData) => (dispatch) => {
    axios.post("/users/login", userData)
        .then(res => {
            // Save to local storage
            const { token } = res.data;
            // Set token to local storage
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            console.log(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
            alert(`Welcome ${decoded.username}!  You have successfully logged in.`);
        })
        .catch(err => {
            // dispatch({
            //     type: GET_ERRORS,
            //     payload: err.response.data
            // })
            alert(JSON.stringify(err.response.data.errorMessage));
        })
};


// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SIGN_IN,
        payload: decoded
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    dispatch({ type: LOG_OUT });
}