import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Button, Modal, Form, FormControl } from 'react-bootstrap';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
import { registerUser } from '../actions/auth.js';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      name: "",
      username: "",
      email: "",
      password: ""
    }
    this.close = this.close.bind(this);
  }


  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    //console.log(this.state[event.target.name]);
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { name, username, email, password } = this.state;

    if (name && username && email && password) {
      const newUser = {
        name,
        username,
        email,
        password
      }
      this.setState({ showModal: false });
      this.props.registerUser(newUser, this.props.history);
    }

  }


  getInitialState() {
    return { showModal: false };
  };

  close(event) {
    if (event) {
      event.preventDefault();
    }
    this.setState({ showModal: false });
  };

  open() {
    this.setState({ showModal: true });
  };
  responseFacebook = (response) => {
    console.log(response)

    const first_name = response.name.split(' ')[0]

    const fbUser = {
      name: response.name,
      username: `${first_name}${response.id.substr(0, 5)}`,
      email: response.email,
      password: response.id
    }

    this.props.registerUser(fbUser, this.props.history);
  }

  render() {
    return (
      <div className='account-modal'>
        <Modal show={this.state.showModal} onHide={this.close} {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Create an Account</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control size='sm' name="name" type="name" placeholder="First and Last Name" onChange={this.onChange} />
              </Form.Group>
              <Form.Group controlId="formBasicUserName">
                <Form.Control size='sm' name="username" type="text" placeholder="Username" onChange={this.onChange} />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Control size='sm' name="email" type="email" placeholder="Email" onChange={this.onChange} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Control size='sm' name="password" type="password" placeholder="Password" onChange={this.onChange} />
              </Form.Group>
              <center>
                <Button variant="success" type="submit" size="sm" block onClick={this.onSubmit}>
                  Start Planning!
                            </Button>
              </center>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Form.Text className="text-muted">
              OR
                    </Form.Text>
            <FacebookLogin
              appId={process.env.FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email"
              callback={this.responseFacebook}
              render={renderProps => (
                <Button variant="primary" size="sm" block onClick={renderProps.onClick}>Sign up with Facebook</Button>
              )}
            />
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default connect(null, { registerUser })(withRouter(SignUp));