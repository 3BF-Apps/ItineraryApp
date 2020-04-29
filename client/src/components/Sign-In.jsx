import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Button, Modal, Form, FormControl } from 'react-bootstrap';
import { connect } from "react-redux";
import { loginUser } from "../actions/auth.js";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"


const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user) => dispatch(loginUser(user)),
  };
}

class ConnectedSignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      email: "",
      password: ""
    }
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  getInitialState() {
    return { showModal: false };
  };

  close(event) {
    if (event) {
      event.preventDefault();
    }
    console.log('Closing!');
    this.setState({ showModal: false });

  };

  open() {
    this.setState({ showModal: true });
  };

  handleClick(event) {
    event.preventDefault();

    const { email, password } = this.state;

    if (email.trim() && password.trim()) {
      this.props.loginUser({ email, password });
      this.close();
    }


  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    //console.log(this.state[event.target.name]);
  }
  responseFacebook = (response) => {
    this.close();
    this.props.loginUser({ email: response.email, password: response.id });
  }
  render() {
    return (
      <div className='account-modal'>
        <Modal show={this.state.showModal} onHide={this.close} {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Sign In</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control name="email" type="email" placeholder="Enter email" onChange={this.onChange} />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control name="password" type="password" placeholder="Password" onChange={this.onChange} />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <center>
                <Button onClick={this.handleClick} variant="success" type="submit" size="sm" block>
                  Submit
                                </Button>
                <FacebookLogin
                  appId={process.env.FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields="name,email"
                  callback={this.responseFacebook}
                  render={renderProps => (
                    <Button variant="primary" size="sm" block onClick={renderProps.onClick}>Sign in with Facebook</Button>
                  )}
                />
              </center>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-muted">
              Don't have an account? <Link to="/create-account">Sign up here!</Link>
            </Form.Text>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

var SignIn = connect(null, mapDispatchToProps)(ConnectedSignIn);

export default SignIn;